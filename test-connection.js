const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test 1: Count users
    const userCount = await prisma.users.count();
    console.log(`✅ Connection successful!`);
    console.log(`✅ Found ${userCount} user(s) in the database\n`);
    
    // Test 2: List all users
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        user_type: true,
        created_at: true,
      },
      take: 10,
      orderBy: {
        created_at: 'desc',
      },
    });
    
    if (users.length > 0) {
      console.log('📋 Current users in database:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.first_name} ${user.last_name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Type: ${user.user_type}`);
        console.log(`      ID: ${user.id}`);
        console.log(`      Created: ${user.created_at.toISOString().split('T')[0]}\n`);
      });
    } else {
      console.log('📝 No users found (table is empty)');
      console.log('   ✅ This is normal if you haven\'t created any accounts yet\n');
    }
    
    // Test 3: Try a simple query
    const testQuery = await prisma.users.findFirst({
      where: {
        user_type: 'owner',
      },
    });
    
    if (testQuery) {
      console.log(`✅ Query test successful (found owner user)\n`);
    }
    
    console.log('🎉 All tests passed!');
    console.log('✅ Your database connection is working correctly!');
    console.log('✅ You can now copy your DATABASE_URL to Vercel\n');
    
    // Display the DATABASE_URL (without password for security)
    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      const maskedUrl = dbUrl.replace(/:[^:@]+@/, ':****@');
      console.log('📋 DATABASE_URL format (password hidden):');
      console.log(`   ${maskedUrl}\n`);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.message.includes('Authentication')) {
      console.error('\n⚠️  Authentication failed - check your password:');
      console.error('   1. Verify password in Supabase Dashboard → Settings → Database');
      console.error('   2. Make sure password is URL-encoded in .env file');
      console.error('   3. Special characters: [ → %5B, ] → %5D\n');
    } else if (error.message.includes('Environment variable')) {
      console.error('\n⚠️  DATABASE_URL not found in .env file\n');
    } else {
      console.error('\n⚠️  Check your connection string format\n');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

