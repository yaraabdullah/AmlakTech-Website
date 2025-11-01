import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a demo owner
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const owner = await prisma.users.upsert({
    where: { email: 'ahmed@example.com' },
    update: {},
    create: {
      email: 'ahmed@example.com',
      first_name: 'أحمد',
      last_name: 'الغامدي',
      phone_number: '966501234567',
      national_id: '1234567890',
      password_hash: hashedPassword,
      user_type: 'owner',
      is_verified: false,
    },
  })

  // Create sample properties
  const property1 = await prisma.property.create({
    data: {
      ownerId: BigInt(owner.id.toString()),
      name: 'عمارة الرياض',
      type: 'شقة',
      address: 'الرياض، حي الترجس',
      city: 'الرياض',
      area: 120,
      rooms: '3',
      bathrooms: '2',
      constructionYear: '2018',
      status: 'مؤجر',
      description: 'عمارة فاخرة في قلب الرياض',
    },
  })

  const property2 = await prisma.property.create({
    data: {
      ownerId: BigInt(owner.id.toString()),
      name: 'مجمع الأمل',
      type: 'شقة',
      address: 'الرياض، حي الشفاء',
      city: 'الرياض',
      area: 150,
      rooms: '4',
      bathrooms: '3',
      constructionYear: '2020',
      status: 'مؤجر',
      description: 'مجمع سكني حديث',
    },
  })

  const property3 = await prisma.property.create({
    data: {
      ownerId: BigInt(owner.id.toString()),
      name: 'برج النخيل',
      type: 'شقة',
      address: 'الرياض، حي النخيل',
      city: 'الرياض',
      area: 100,
      rooms: '2',
      bathrooms: '2',
      constructionYear: '2015',
      status: 'مؤجر',
      description: 'برج سكني في حي راقي',
    },
  })

  // Create units
  const unit1 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitNumber: '101',
      type: '3 غرف',
      area: 120,
      status: 'مؤجر',
    },
  })

  // Create contracts
  const contract1 = await prisma.contract.create({
    data: {
      propertyId: property1.id,
      unitId: unit1.id,
      ownerId: BigInt(owner.id.toString()),
      tenantName: 'محمد العلي',
      tenantEmail: 'mohamed@example.com',
      tenantPhone: '0501234567',
      type: 'إيجار سكني',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2024-12-31'),
      monthlyRent: 8500,
      deposit: 8500,
      status: 'نشط',
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      propertyId: property2.id,
      ownerId: BigInt(owner.id.toString()),
      tenantName: 'سارة خالد',
      tenantEmail: 'sara@example.com',
      tenantPhone: '0551234567',
      type: 'إيجار سكني',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2025-06-30'),
      monthlyRent: 12000,
      deposit: 12000,
      status: 'نشط',
    },
  })

  // Create payments
  await prisma.payment.createMany({
    data: [
      {
        contractId: contract1.id,
        ownerId: BigInt(owner.id.toString()),
        type: 'إيجار',
        amount: 8500,
        dueDate: new Date('2025-08-01'),
        paidDate: new Date('2025-07-28'),
        status: 'مدفوعة',
      },
      {
        contractId: contract1.id,
        ownerId: BigInt(owner.id.toString()),
        type: 'إيجار',
        amount: 8500,
        dueDate: new Date('2025-09-01'),
        status: 'مستحقة',
      },
      {
        contractId: contract2.id,
        ownerId: BigInt(owner.id.toString()),
        type: 'إيجار',
        amount: 12000,
        dueDate: new Date('2025-08-01'),
        paidDate: new Date('2025-07-30'),
        status: 'مدفوعة',
      },
    ],
  })

  // Create maintenance requests
  await prisma.maintenanceRequest.createMany({
    data: [
      {
        propertyId: property1.id,
        ownerId: BigInt(owner.id.toString()),
        unit: '103',
        type: 'سباكة',
        priority: 'urgent',
        problemDescription: 'تسرب مياه في الحمام',
        status: 'قيد الانتظار',
        contactName: 'أحمد محمد',
        contactPhone: '0501234567',
      },
      {
        propertyId: property1.id,
        ownerId: BigInt(owner.id.toString()),
        unit: '101',
        type: 'كهربائي',
        priority: 'medium',
        problemDescription: 'مشكلة في الإضاءة',
        status: 'مجدولة',
        scheduledDate: new Date('2025-08-15'),
      },
    ],
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

