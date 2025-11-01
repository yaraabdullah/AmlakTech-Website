# Relationship Between Properties and Users Tables

## ✅ Relationship is Already Set Up!

Yes, the `properties` table is **fully connected** to the `users` table through a **foreign key relationship**.

## How It Works

### 1. Database Relationship (Foreign Key)

In the SQL script (`CREATE_PROPERTIES_TABLE.sql`):
```sql
CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
```

This means:
- ✅ Each property **must** belong to an owner (user)
- ✅ The `owner_id` in `properties` table references `id` in `users` table
- ✅ If an owner is deleted, all their properties are automatically deleted (CASCADE)
- ✅ You cannot create a property without a valid owner ID

### 2. Prisma Schema Relationship

In `prisma/schema.prisma`:
```prisma
model Property {
  ownerId  BigInt @map("owner_id")
  owner    Users  @relation("OwnerProperties", fields: [ownerId], references: [id], onDelete: Cascade)
}

model Users {
  owner_properties Property[] @relation("OwnerProperties")
}
```

This creates a **one-to-many** relationship:
- ✅ One User (owner) can have **many** Properties
- ✅ Each Property belongs to **one** Owner

### 3. API Includes Owner Info

When you fetch properties, the API automatically includes owner information:

**GET `/api/properties?ownerId=123`** returns:
```json
[
  {
    "id": "property123",
    "name": "شقة - الرياض",
    "type": "شقة",
    "address": "...",
    "city": "الرياض",
    "owner": {
      "id": "2",
      "first_name": "yara",
      "last_name": "Bahmaid",
      "email": "yarabahmaid@icloud.com",
      "phone_number": "966550113301"
    },
    ...
  }
]
```

**GET `/api/properties/[id]`** also includes owner info when fetching a single property.

### 4. Form Automatically Gets Owner ID

In `AddProperty.tsx`, when you submit the form:
```typescript
// Gets the current logged-in owner ID
const ownerResponse = await fetch('/api/user/get-owner-id')
const owner = await ownerResponse.json()
const ownerId = owner.id

// Creates property with this owner ID
const propertyData = {
  ownerId,  // Automatically connects to the owner
  name: "...",
  ...
}
```

## Summary

✅ **Foreign Key**: `properties.owner_id` → `users.id`
✅ **Cascade Delete**: If owner deleted, properties deleted automatically
✅ **API Includes Owner**: When fetching properties, owner info is included
✅ **Form Auto-Connects**: Form automatically gets current user's ID

Everything is already connected! You just need to create the table in Supabase using the SQL script I provided.

## Verify After Creating Table

After creating the `properties` table:

1. **Test the relationship:**
   ```sql
   -- This should show the owner info with each property
   SELECT 
     p.id,
     p.name,
     p.type,
     u.first_name,
     u.last_name,
     u.email
   FROM properties p
   JOIN users u ON p.owner_id = u.id;
   ```

2. **Try adding a property:**
   - Go to `/owner/add-property`
   - Fill in the form
   - Submit
   - The property will automatically be linked to your user account!

