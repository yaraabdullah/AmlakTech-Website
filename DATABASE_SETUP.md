# Database Setup Guide

This guide will help you set up the database for the AmlakTech property management system.

## Prerequisites

- Node.js installed (v18 or higher)
- npm or yarn package manager

## Step 1: Install Dependencies

Run the following command to install Prisma and other dependencies:

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database queries
- `prisma` - Prisma CLI for database management

## Step 2: Initialize the Database

After installing dependencies, run:

```bash
npx prisma generate
```

This generates the Prisma Client based on your schema.

## Step 3: Create the Database

Run the migration to create the database and tables:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the SQLite database file at `prisma/dev.db`
- Create all the tables defined in `prisma/schema.prisma`

## Step 4: Seed the Database (Optional)

To populate the database with sample data, run:

```bash
npx prisma db seed
```

This will create:
- A demo owner user (ahmed@example.com)
- Sample properties
- Sample contracts
- Sample maintenance requests
- Sample payments

**Note:** If you get an error about ts-node, you can install it:
```bash
npm install -D ts-node
```

## Step 5: Start the Development Server

```bash
npm run dev
```

The application should now be running at `http://localhost:3000`

## Database Schema Overview

The database includes the following models:

- **User**: Property owners, tenants, service providers, and property managers
- **Property**: Real estate properties (apartments, houses, villas, etc.)
- **Unit**: Individual units within properties
- **Contract**: Rental or sale contracts
- **MaintenanceRequest**: Maintenance requests and scheduling
- **Payment**: Payment records (rent, maintenance, etc.)

## Viewing the Database

You can use Prisma Studio to view and edit the database:

```bash
npx prisma studio
```

This opens a browser-based database editor at `http://localhost:5555`

## API Endpoints

### Properties
- `GET /api/properties?ownerId=xxx` - Get all properties for an owner
- `POST /api/properties` - Create a new property
- `GET /api/properties/[id]` - Get a specific property
- `PUT /api/properties/[id]` - Update a property
- `DELETE /api/properties/[id]` - Delete a property

### Contracts
- `GET /api/contracts?ownerId=xxx` - Get all contracts
- `POST /api/contracts` - Create a new contract

### Maintenance
- `GET /api/maintenance?ownerId=xxx` - Get maintenance requests
- `POST /api/maintenance` - Create a maintenance request

### Payments
- `GET /api/payments?ownerId=xxx` - Get payment records
- `POST /api/payments` - Create a payment record

### Dashboard Stats
- `GET /api/dashboard/stats?ownerId=xxx` - Get dashboard statistics and KPIs

## Important Notes

1. **Owner ID**: Currently, the application uses a hardcoded owner ID (`clx000000000000000000000001`). In production, this should come from authentication.

2. **Authentication**: The current setup doesn't include authentication. You should implement user authentication before deploying to production.

3. **Database**: SQLite is used for development. For production, you should switch to PostgreSQL or MySQL by updating the `datasource` in `prisma/schema.prisma`.

## Troubleshooting

### Error: "Cannot find module '@prisma/client'"
Run `npx prisma generate` again.

### Error: "Database does not exist"
Run `npx prisma migrate dev` to create the database.

### Error: "Cannot find module 'ts-node'"
Install it: `npm install -D ts-node`

