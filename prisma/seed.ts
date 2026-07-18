// prisma/seed.ts
import { PrismaClient, SkillCategory, ProductCategory } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed Products
  await prisma.product.createMany({
    data: [
      { name: 'Bamburi Cement (50kg)', slug: 'bamburi-cement-50kg', description: 'High-quality Portland cement.', price: 750, category: ProductCategory.CONSTRUCTION_MATERIALS, images: ['/images/cement.jpg'], stock: 500 },
      { name: '12mm Steel Bars (Bundle)', slug: '12mm-steel-bars', description: 'Premium steel reinforcement bars.', price: 8500, category: ProductCategory.CONSTRUCTION_MATERIALS, images: ['/images/steel.jpg'], stock: 200 },
      { name: 'Premium Ceramic Tiles (sqm)', slug: 'premium-ceramic-tiles', description: 'Modern finishing tiles.', price: 1200, category: ProductCategory.FINISHING_MATERIALS, images: ['/images/tiles.jpg'], stock: 1000 },
    ],
  });

  // Seed Jobs
  await prisma.jobPost.createMany({
    data: [
      { title: 'Senior Mason for Residential Villa', skillRequired: SkillCategory.MASON, location: 'Karen, Nairobi', contractDuration: '3 Months', workersNeeded: 4, budgetMin: 1500, budgetMax: 2500, deadline: new Date('2024-12-31'), description: 'Experienced mason needed for high-end residential finishing.' },
      { title: 'Site Foreman for Commercial Block', skillRequired: SkillCategory.FOREMAN, location: 'Westlands, Nairobi', contractDuration: '6 Months', workersNeeded: 1, budgetMin: 80000, budgetMax: 120000, deadline: new Date('2024-12-15'), description: 'Looking for a certified foreman to manage a 4-story commercial build.' },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());