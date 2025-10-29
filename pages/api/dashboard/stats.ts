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

    // Get all properties
    const properties = await prisma.property.findMany({
      where: { ownerId: ownerId as string },
      include: {
        units: true,
        contracts: {
          where: { status: 'نشط' },
        },
      },
    })

    // Get all contracts
    const contracts = await prisma.contract.findMany({
      where: { ownerId: ownerId as string },
    })

    // Get active contracts
    const activeContracts = contracts.filter(c => c.status === 'نشط')

    // Get payments
    const payments = await prisma.payment.findMany({
      where: { ownerId: ownerId as string },
      include: {
        contract: true,
      },
    })

    // Get maintenance requests
    const maintenance = await prisma.maintenanceRequest.findMany({
      where: { ownerId: ownerId as string },
      include: {
        property: true,
      },
    })

    // Calculate KPIs
    const totalProperties = properties.length
    
    // Calculate occupancy rate
    const totalUnits = properties.reduce((sum, p) => sum + p.units.length, 0)
    const occupiedUnits = properties.reduce((sum, p) => {
      return sum + p.units.filter(u => u.status === 'مؤجر').length
    }, 0)
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0

    // Calculate collected rents (paid payments)
    const collectedRents = payments
      .filter(p => p.type === 'إيجار' && p.status === 'مدفوعة')
      .reduce((sum, p) => sum + p.amount, 0)

    // Calculate expenses (maintenance costs)
    const expenses = maintenance
      .filter(m => m.status === 'مكتملة' && m.cost)
      .reduce((sum, m) => sum + (m.cost || 0), 0)

    // Calculate monthly revenue (from active contracts)
    const monthlyRevenue = activeContracts.reduce((sum, c) => sum + c.monthlyRent, 0)

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
      const occupiedUnits = property.units.filter(u => u.status === 'مؤجر').length
      const occupancy = property.units.length > 0 
        ? Math.round((occupiedUnits / property.units.length) * 100) 
        : 0
      
      const propertyRevenue = property.contracts.reduce((sum, c) => sum + c.monthlyRent, 0)
      
      let status = 'متوسط'
      if (occupancy >= 95) status = 'ممتاز'
      else if (occupancy >= 80) status = 'جيد'
      else if (occupancy >= 60) status = 'متوسط'
      
      return {
        id: property.id,
        name: property.name,
        units: `${property.units.length} وحدات`,
        occupancy: `${occupancy}%`,
        monthlyRevenue: `${propertyRevenue.toLocaleString('ar-SA')} ر.س`,
        status,
      }
    })

    return res.status(200).json({
      kpis: {
        totalProperties,
        occupancyRate,
        collectedRents,
        expenses,
        monthlyRevenue,
      },
      alerts: {
        urgent: urgentMaintenance.length,
        dueInvoices: dueInvoices.length,
      },
      cashFlow,
      propertiesOverview,
      activeContracts: activeContracts.length,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
}

