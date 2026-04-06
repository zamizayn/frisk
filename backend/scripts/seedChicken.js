const { Category, SubCategory, Product, ProductVariant } = require('../models');
const { sequelize } = require('../config/database');

async function seedChicken() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Create or Find Category
    const [category] = await Category.findOrCreate({
      where: { name: 'CHICKEN' },
      defaults: { description: 'Premium fresh chicken and poultry' }
    });

    // 2. Create or Find SubCategory
    const [subCategory] = await SubCategory.findOrCreate({
      where: { name: 'Fresh Poultry', categoryId: category.id },
      defaults: { description: 'Freshly processed country and broiler chicken' }
    });

    const products = [
      {
        name: 'Chicken curry Cut Without Skin',
        price: 85.00,
        description: 'Tender chicken pieces, expertly cut for curry, without skin.',
        variants: [{ name: 'Weight', value: '250 Grams', priceOverride: 85.00, stock: 50 }]
      },
      {
        name: 'Chicken Drumsticks with Skin',
        price: 370.00,
        description: 'Juicy chicken drumsticks with skin for maximum flavor.',
        variants: [{ name: 'Weight', value: '1 KG', priceOverride: 370.00, stock: 30 }]
      },
      {
        name: 'Chicken Biryani Cut With Skin',
        price: 315.00,
        description: 'Large, succulent chicken pieces with skin, perfect for Biryani.',
        variants: [{ name: 'Weight', value: '1 KG', priceOverride: 315.00, stock: 40 }]
      },
      {
        name: 'Naatukozhi Chicken with Skin',
        price: 615.00,
        description: 'Traditional country chicken with skin, known for its rich taste.',
        variants: [{ name: 'Weight', value: '1 KG', priceOverride: 615.00, stock: 20 }]
      },
      {
        name: 'Chicken Mince (keema)',
        price: 555.00,
        description: 'Finely minced fresh chicken, ideal for keema recipes.',
        variants: [{ name: 'Weight', value: '1 KG', priceOverride: 555.00, stock: 25 }]
      },
      {
        name: 'Chicken Gutted with Skin',
        price: 310.00,
        description: 'Whole chicken, gutted and cleaned with skin on.',
        variants: [{ name: 'Weight', value: '1 KG', priceOverride: 310.00, stock: 15 }]
      }
    ];

    for (const p of products) {
      const [product] = await Product.findOrCreate({
        where: { name: p.name },
        defaults: {
          description: p.description,
          price: p.price,
          stock: 100,
          categoryId: category.id,
          subCategoryId: subCategory.id
        }
      });

      for (const v of p.variants) {
        await ProductVariant.findOrCreate({
          where: { productId: product.id, value: v.value },
          defaults: {
            name: v.name,
            value: v.value,
            priceOverride: v.priceOverride,
            stock: v.stock,
            sku: `${p.name.substring(0, 3).toUpperCase()}-${v.value.replace(' ', '')}-${Math.floor(Math.random() * 1000)}`
          }
        });
      }
    }

    console.log('Chicken products seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding chicken products:', error);
    process.exit(1);
  }
}

seedChicken();
