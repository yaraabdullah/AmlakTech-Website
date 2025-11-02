import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { ownerId } = req.query

    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' })
    }

    const ownerIdBigInt = BigInt(ownerId as string)
    
    // Get all properties (without units/contracts as tables don't exist yet)
    const properties = await prisma.property.findMany({
      where: { ownerId: ownerIdBigInt },
    })

    // Get all contracts (handle case where table doesn't exist)
    let contracts: any[] = []
    try {
      contracts = await prisma.contract.findMany({
        where: { ownerId: ownerIdBigInt },
      })
    } catch (dbError: any) {
      if (dbError.code === 'P2021') {
        console.warn('Contracts table does not exist yet. Using empty array.')
        contracts = []
      } else {
        throw dbError
      }
    }

    // Get active contracts (or count occupied properties if contracts don't exist)
    const activeContracts = contracts.length > 0 
      ? contracts.filter(c => c.status === 'نشط')
      : properties.filter(p => p.status === 'مؤجر')

    // Get payments (handle case where table doesn't exist)
    let payments: any[] = []
    try {
      payments = await prisma.payment.findMany({
        where: { ownerId: ownerIdBigInt },
        include: {
          contract: true,
        },
      })
    } catch (dbError: any) {
      if (dbError.code === 'P2021') {
        console.warn('Payments table does not exist yet. Using empty array.')
        payments = []
      } else {
        throw dbError
      }
    }

    // Get maintenance requests (handle case where table doesn't exist)
    let maintenance: any[] = []
    try {
      maintenance = await prisma.maintenanceRequest.findMany({
        where: { ownerId: ownerIdBigInt },
        include: {
          property: true,
        },
      })
    } catch (dbError: any) {
      if (dbError.code === 'P2021') {
        console.warn('Maintenance requests table does not exist yet. Using empty array.')
        maintenance = []
      } else {
        throw dbError
      }
    }

    // Calculate KPIs
    const totalProperties = properties.length
    
    // Calculate occupancy rate based on active contracts, not property status
    const occupiedProperties = properties.filter(p => {
      // Property is occupied if it has at least one active contract
      return contracts.some(c => c.propertyId === p.id && c.status === 'نشط')
    }).length
    const occupancyRate = totalProperties > 0 
      ? Math.round((occupiedProperties / totalProperties) * 100) 
      : 0

    // Calculate collected rents (paid payments)
    const collectedRents = payments
      .filter(p => p.type === 'إيجار' && p.status === 'مدفوعة')
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate expenses (maintenance costs)
    const expenses = maintenance
      .filter(m => m.status === 'مكتملة' && m.cost)
      .reduce((sum, m) => sum + (m.cost || 0), 0)

    // Calculate monthly revenue (from active contracts)
    const monthlyRevenue = contracts
      .filter(c => c.status === 'نشط' && c.monthlyRent)
      .reduce((sum, c) => sum + (Number(c.monthlyRent) || 0), 0)

    // Get urgent maintenance
    const urgentMaintenance = maintenance.filter(m => 
      m.priority === 'urgent' && (m.status === 'قيد الانتظار' || m.status === 'مجدولة')
    )

    // Get due invoices (payments due in next 5 days)
    const fiveDaysFromNow = new Date()
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5)
    const dueInvoices = payments.filter(p => {
      const dueDate = new Date(p.dueDate)
      return p.status === 'مستحقة' && 
             dueDate <= fiveDaysFromNow && 
             dueDate >= new Date()
    })

    // Calculate cash flow for last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const recentPayments = payments.filter(p => new Date(p.dueDate) >= sixMonthsAgo)
    const cashFlow = []
    
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date()
      monthStart.setMonth(monthStart.getMonth() - i)
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      
      const monthEnd = new Date(monthStart)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      
      const monthPayments = recentPayments.filter(p => {
        const paymentDate = new Date(p.dueDate)
        return paymentDate >= monthStart && paymentDate < monthEnd
      })
      
      const income = monthPayments
        .filter(p => p.type === 'إيجار' && p.status === 'مدفوعة')
        .reduce((sum, p) => sum + p.amount, 0)
      
      const expenses = maintenance
        .filter(m => {
          const completedDate = m.updatedAt
          return m.status === 'مكتملة' && 
                 m.cost && 
                 completedDate >= monthStart && 
                 completedDate < monthEnd
        })
        .reduce((sum, m) => sum + (m.cost || 0), 0)
      
      cashFlow.push({
        month: monthStart.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' }),
        income,
        expenses,
        net: income - expenses,
      })
    }

    // Get properties overview
    const propertiesOverview = properties.map(property => {
      // Check if property has active contracts
      const propertyActiveContracts = contracts.filter(c => 
        c.propertyId === property.id && c.status === 'نشط'
      )
      
      // Property is occupied if it has active contracts
      const isOccupied = propertyActiveContracts.length > 0
      const occupancy = isOccupied ? 100 : 0
      
      // Calculate revenue from active contracts or property monthly rent
      let propertyRevenue = 0
      if (propertyActiveContracts.length > 0) {
        // Sum revenue from active contracts
        propertyRevenue = propertyActiveContracts.reduce((sum, c) => 
          sum + (Number(c.monthlyRent) || 0), 0
        )
      } else if (property.monthlyRent) {
        // Fallback to property monthly rent if no contracts
        propertyRevenue = Number(property.monthlyRent)
      }
      
      // Determine status based on active contracts, not property.status
      let status = 'متاح'
      if (isOccupied) {
        status = 'مؤجر'
      } else if (property.status === 'صيانة') {
        status = 'صيانة'
      } else {
        status = 'متاح'
      }
      
      return {
        id: property.id.toString(),
        name: property.name,
        units: '1 وحدة', // Default to 1 since units table doesn't exist
        occupancy: `${occupancy}%`,
        monthlyRevenue: propertyRevenue > 0 
          ? `${propertyRevenue.toLocaleString('ar-SA')} ر.س` 
          : '0 ر.س',
        status,
      }
    })

    // Ensure all BigInt values are converted to strings/numbers
    const response = {
      kpis: {
        totalProperties,
        occupancyRate,
        collectedRents: Number(collectedRents) || 0,
        expenses: Number(expenses) || 0,
        monthlyRevenue: Number(monthlyRevenue) || 0,
      },
      alerts: {
        urgent: urgentMaintenance.length,
        dueInvoices: dueInvoices.length,
      },
      cashFlow: cashFlow.map(item => ({
        month: item.month,
        income: Number(item.income) || 0,
        expenses: Number(item.expenses) || 0,
        net: Number(item.net) || 0,
      })),
      propertiesOverview,
      activeContracts: Array.isArray(activeContracts) ? activeContracts.length : 0,
    }

    return res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}

