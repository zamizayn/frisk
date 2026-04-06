'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = async (tableName) => {
      const tables = await queryInterface.showAllTables();
      return tables.includes(tableName);
    };

    if (!(await tableExists('Users'))) {
      await queryInterface.createTable('Users', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        username: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false, unique: true },
        password: { type: Sequelize.STRING, allowNull: false },
        role: { type: Sequelize.ENUM('admin', 'customer'), defaultValue: 'customer' },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    if (!(await tableExists('Categories'))) {
      await queryInterface.createTable('Categories', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        imageUrl: { type: Sequelize.STRING, allowNull: true },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    if (!(await tableExists('Products'))) {
      await queryInterface.createTable('Products', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.TEXT, allowNull: true },
        price: { type: Sequelize.FLOAT, allowNull: false },
        stock: { type: Sequelize.INTEGER, defaultValue: 0 },
        imageUrl: { type: Sequelize.STRING, allowNull: true },
        categoryId: {
          type: Sequelize.UUID,
          references: { model: 'Categories', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    if (!(await tableExists('ProductVariants'))) {
        await queryInterface.createTable('ProductVariants', {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
          productId: { type: Sequelize.UUID, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
          type: { type: Sequelize.STRING, allowNull: false },
          value: { type: Sequelize.STRING, allowNull: false },
          priceOverride: { type: Sequelize.FLOAT, allowNull: true },
          stock: { type: Sequelize.INTEGER, defaultValue: 0 },
          createdAt: { type: Sequelize.DATE, allowNull: false },
          updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
      }

    if (!(await tableExists('Orders'))) {
      await queryInterface.createTable('Orders', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        userId: { type: Sequelize.UUID, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
        totalAmount: { type: Sequelize.FLOAT, allowNull: false },
        status: { type: Sequelize.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
        address: { type: Sequelize.TEXT, allowNull: false },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    if (!(await tableExists('OrderItems'))) {
      await queryInterface.createTable('OrderItems', {
        id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
        orderId: { type: Sequelize.UUID, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
        productId: { type: Sequelize.UUID, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
        variantId: { type: Sequelize.UUID, allowNull: true },
        quantity: { type: Sequelize.INTEGER, allowNull: false },
        price: { type: Sequelize.FLOAT, allowNull: false },
        createdAt: { type: Sequelize.DATE, allowNull: false },
        updatedAt: { type: Sequelize.DATE, allowNull: false }
      });
    }

    if (!(await tableExists('Banners'))) {
        await queryInterface.createTable('Banners', {
          id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
          title: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          imageUrl: { type: Sequelize.STRING, allowNull: false },
          link: { type: Sequelize.STRING, allowNull: true },
          isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
          createdAt: { type: Sequelize.DATE, allowNull: false },
          updatedAt: { type: Sequelize.DATE, allowNull: false }
        });
      }
  },

  async down(queryInterface, Sequelize) {
    // Usually not reversible for baseline if it existed before migrations
  }
};
