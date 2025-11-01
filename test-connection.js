const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...\n');
    
    // Test querying the users table
    const userCount = await prisma.users.count();
    console.log(`✓ Connection successful!`);
    console.log(`✓ Found ${userCount} user(s) in the database\n`);
    
    // List all users
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        user_type: true,
      },
      take: 5,
    });
    
    if (users.length > 0) {
      console.log('Current users:');
      users.forEach(user => {
        console.log(`  - ${user.first_name} ${user.last_name} (${user.email}) - ${user.user_type}`);
      });
    } else {
      console.log('No users found (table is empty)');
    }
    
    console.log('\n✓ Database connection test passed!');
    console.log('✓ Your signup form should work correctly!');
    
  } catch (error) {
    console.error('✗ Connection failed:', error.message);
    if (error.message.includes('Authentication')) {
      console.error('\n⚠ The DATABASE_URL credentials might be incorrect.');
      console.error('Please check your .env file and verify:');
      console.error('  1. Password is URL-encoded correctly');
      console.error('  2. Connection string matches Supabase dashboard');
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

