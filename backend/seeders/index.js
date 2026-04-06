const { User, Category, Product, sequelize } = require('../models');

const seedDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected for seeding.');

        // Warning: This will clear the existing database tables
        await sequelize.sync({ force: true });
        console.log('Database tables cleared and synced.');

        // 1. Create Admin
        await User.create({
            username: 'SuperAdmin',
            email: 'admin@example.com',
            password: 'adminpassword',
            role: 'admin'
        });
        console.log('Admin created.');

        // 2. Create Categories
        const categories = await Category.bulkCreate([
            { name: 'Electronics', description: 'Gadgets, devices, and accessories' },
            { name: 'Fashion', description: 'Clothing, shoes, and apparel' },
            { name: 'Home & Living', description: 'Furniture and home decor' },
            { name: 'Fitness', description: 'Gym equipment and health supplies' }
        ]);
        console.log('Categories seeded.');

        // 3. Create Products
        await Product.bulkCreate([
            { 
                name: 'Pro Laptop 15"', 
                description: 'Powerful laptop for professionals.', 
                price: 1299.99, 
                stock: 10, 
                categoryId: categories[0].id,
                imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000'
            },
            { 
                name: 'Wireless Headphones', 
                description: 'Noise cancelling over-ear headphones.', 
                price: 199.50, 
                stock: 25, 
                categoryId: categories[0].id,
                imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000'
            },
            { 
                name: 'Premium Cotton T-Shirt', 
                description: 'Soft and breathable daily wear.', 
                price: 25.00, 
                stock: 100, 
                categoryId: categories[1].id,
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000'
            },
            { 
                name: 'Modern Ergonomic Chair', 
                description: 'Comfortable office chair for long hours.', 
                price: 450.00, 
                stock: 5, 
                categoryId: categories[2].id,
                imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=1000'
            },
            { 
                name: 'Smart Watch Series X', 
                description: 'Track your fitness and notifications.', 
                price: 299.00, 
                stock: 15, 
                categoryId: categories[0].id,
                imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000'
            }
        ]);
        console.log('Products seeded.');

        console.log('Seed successful! All data populated.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
