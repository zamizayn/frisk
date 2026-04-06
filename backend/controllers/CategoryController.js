const { Category, SubCategory, Product } = require('../models');

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const category = await Category.create({ name, description, imageUrl });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, imageUrl } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.description = description || category.description;
      category.imageUrl = imageUrl !== undefined ? imageUrl : category.imageUrl;
      
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      // Sequelize associations with onDelete: 'CASCADE' will handle subcategories
      // But we might want to ensure products are handled too if they link directly
      await category.destroy();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
