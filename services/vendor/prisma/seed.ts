import { PrismaClient } from '../generated/prisma-client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // PREDEFINED VARIANT ATTRIBUTES
  // ============================================

  console.log('📦 Creating predefined variant attributes...');

  // Color Attribute
  const existingColor = await prisma.variantAttribute.findFirst({
    where: { slug: 'color', storeId: null },
  });

  const colorAttr = existingColor || await prisma.variantAttribute.create({
    data: {
      name: 'Color',
      slug: 'color',
      storeId: null,
    },
  });

  const colors = [
    { value: 'Red', slug: 'red' },
    { value: 'Blue', slug: 'blue' },
    { value: 'Green', slug: 'green' },
    { value: 'Black', slug: 'black' },
    { value: 'White', slug: 'white' },
    { value: 'Yellow', slug: 'yellow' },
    { value: 'Orange', slug: 'orange' },
    { value: 'Purple', slug: 'purple' },
    { value: 'Pink', slug: 'pink' },
    { value: 'Brown', slug: 'brown' },
    { value: 'Gray', slug: 'gray' },
  ];

  for (const color of colors) {
    await prisma.variantAttributeValue.upsert({
      where: { attributeId_slug: { attributeId: colorAttr.id, slug: color.slug } },
      update: {},
      create: {
        attributeId: colorAttr.id,
        value: color.value,
        slug: color.slug,
      },
    });
  }

  console.log(`✅ Created Color attribute with ${colors.length} values`);

  // Size Attribute
  const existingSize = await prisma.variantAttribute.findFirst({
    where: { slug: 'size', storeId: null },
  });

  const sizeAttr = existingSize || await prisma.variantAttribute.create({
    data: {
      name: 'Size',
      slug: 'size',
      storeId: null,
    },
  });

  const sizes = [
    { value: 'XS', slug: 'xs' },
    { value: 'S', slug: 's' },
    { value: 'M', slug: 'm' },
    { value: 'L', slug: 'l' },
    { value: 'XL', slug: 'xl' },
    { value: 'XXL', slug: 'xxl' },
    { value: 'XXXL', slug: 'xxxl' },
  ];

  for (const size of sizes) {
    await prisma.variantAttributeValue.upsert({
      where: { attributeId_slug: { attributeId: sizeAttr.id, slug: size.slug } },
      update: {},
      create: {
        attributeId: sizeAttr.id,
        value: size.value,
        slug: size.slug,
      },
    });
  }

  console.log(`✅ Created Size attribute with ${sizes.length} values`);

  // Material Attribute
  const existingMaterial = await prisma.variantAttribute.findFirst({
    where: { slug: 'material', storeId: null },
  });

  const materialAttr = existingMaterial || await prisma.variantAttribute.create({
    data: {
      name: 'Material',
      slug: 'material',
      storeId: null,
    },
  });

  const materials = [
    { value: 'Cotton', slug: 'cotton' },
    { value: 'Polyester', slug: 'polyester' },
    { value: 'Silk', slug: 'silk' },
    { value: 'Wool', slug: 'wool' },
    { value: 'Leather', slug: 'leather' },
    { value: 'Denim', slug: 'denim' },
    { value: 'Linen', slug: 'linen' },
  ];

  for (const material of materials) {
    await prisma.variantAttributeValue.upsert({
      where: { attributeId_slug: { attributeId: materialAttr.id, slug: material.slug } },
      update: {},
      create: {
        attributeId: materialAttr.id,
        value: material.value,
        slug: material.slug,
      },
    });
  }

  console.log(`✅ Created Material attribute with ${materials.length} values`);

  // ============================================
  // GLOBAL CATEGORIES
  // ============================================

  console.log('📂 Creating global categories...');

  const categories = [
    { name: 'Clothing', slug: 'clothing', description: 'Apparel and fashion items' },
    { name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors', description: 'Sports equipment and outdoor gear' },
    { name: 'Books', slug: 'books', description: 'Books and publications' },
    { name: 'Toys & Games', slug: 'toys-games', description: 'Toys and gaming products' },
    { name: 'Health & Beauty', slug: 'health-beauty', description: 'Health and beauty products' },
    { name: 'Food & Beverages', slug: 'food-beverages', description: 'Food and drink items' },
  ];

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { slug: category.slug, storeId: null },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          storeId: null,
        },
      });
    }
  }

  console.log(`✅ Created ${categories.length} global categories`);

  console.log('✨ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
