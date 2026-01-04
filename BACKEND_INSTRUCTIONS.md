# Backend Implementation Instructions

Since the `aio-backend` directory was not accessible in the workspace, please manually add the following files to your backend project to enable the Admin Panel features.

## 1. Create `src/controllers/admin.controller.ts`

```typescript
import { Request, Response } from 'express';
// Adjust the import path to your Prisma client or Database service
// import { prisma } from '../lib/prisma'; 

export const getStats = async (req: Request, res: Response) => {
  try {
    // Check if user is admin (security)
    // const user = (req as any).user;
    // if (user.role !== 'admin') return res.status(403).json({ error: 'Unauthorized' });

    // const totalTenants = await prisma.tenant.count();
    // const startOfMonth = new Date();
    // startOfMonth.setDate(1);
    // const newTenants = await prisma.tenant.count({
    //   where: { created_at: { gte: startOfMonth } }
    // });
    
    // MOCK RESPONSE IF DB NOT READY
    const totalTenants = 12;
    const totalRevenue = 28540; 
    const activeTenants = 10;
    const newTenants = 2;

    res.json({
      totalTenants,
      totalRevenue: totalRevenue || 0,
      activeTenants,
      newTenantsThisMonth: newTenants
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'İstatistikler alınamadı' });
  }
};

export const getTenants = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || '');
    
    // REPLACE WITH REAL DB CALL
    /*
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    const [tenants, total] = await Promise.all([
      prisma.tenant.findMany({ where, skip, take: limit, orderBy: { created_at: 'desc' }, include: { agents: true } }),
      prisma.tenant.count({ where })
    ]);
    */

   // MOCK FOR NOW (BUT IMPLEMENT THE ABOVE IN PRODUCTION)
   const tenants = [
     { id: '1', name: 'Test Tenant', email: 'test@example.com', plan: 'pro', phone_number: '+905551112233', created_at: new Date() }
   ];
   const total = 1;

    // Map to match frontend interface
    const formattedTenants = tenants.map((t: any) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      plan_type: t.plan || 'starter',
      phone_number: t.phone_number,
      verimor_did: t.agents?.[0]?.verimor_did || null,
      status: 'active',
      created_at: t.created_at
    }));

    res.json({
      tenants: formattedTenants,
      total,
      page,
      limit
    });
  } catch (error) {
    console.error('Admin tenants error:', error);
    res.status(500).json({ error: 'Müşteriler alınamadı' });
  }
};
```

## 2. Register Routes in `src/routes/index.ts`

```typescript
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';

const router = Router();

// Stats
router.get('/admin/stats', adminController.getStats);

// Tenants List
router.get('/admin/tenants', adminController.getTenants);

export default router;
```
