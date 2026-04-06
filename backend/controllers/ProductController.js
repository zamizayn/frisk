const { Product, Category, ProductVariant, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all products with search and filters
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { search, categoryId, minPrice, maxPrice } = req.query;
    
    let where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['name'] },
        { model: ProductVariant, as: 'variants' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: ProductVariant, as: 'variants' }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description, price, stock, categoryId, imageUrl, variants } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl
    }, { transaction });

    if (variants && variants.length > 0) {
      const variantsWithProduct = variants.map(v => ({ ...v, productId: product.id }));
      await ProductVariant.bulkCreate(variantsWithProduct, { transaction });
    }

    await transaction.commit();
    
    const completeProduct = await Product.findByPk(product.id, {
      include: [{ model: ProductVariant, as: 'variants' }]
    });

    res.status(201).json(completeProduct);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { variants, ...productData } = req.body;
    await product.update(productData, { transaction });

    if (variants) {
      // For simplicity in a "basic" app, we'll replace variants
      // In a production app, we would sync (update/create/delete)
      await ProductVariant.destroy({ where: { productId: product.id }, transaction });
      const variantsWithProduct = variants.map(v => ({ ...v, productId: product.id }));
      await ProductVariant.bulkCreate(variantsWithProduct, { transaction });
    }

    await transaction.commit();
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{ model: ProductVariant, as: 'variants' }]
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.status(200).json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
