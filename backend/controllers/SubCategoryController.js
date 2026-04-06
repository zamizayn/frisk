const { SubCategory, Category } = require('../models');

// @desc    Get all subcategories
// @route   GET /api/subcategories
// @access  Public
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      include: [{ model: Category, as: 'category', attributes: ['name'] }]
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subcategories by category
// @route   GET /api/categories/:categoryId/subcategories
// @access  Public
exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll({
      where: { categoryId: req.params.categoryId }
    });
    res.status(200).json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a subcategory
// @route   POST /api/subcategories
// @access  Admin
exports.createSubCategory = async (req, res) => {
  try {
    const { name, imageUrl, categoryId } = req.body;
    const subCategory = await SubCategory.create({ name, imageUrl, categoryId });
    res.status(201).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a subcategory
// @route   PUT /api/subcategories/:id
// @access  Admin
exports.updateSubCategory = async (req, res) => {
  try {
    const { name, imageUrl, categoryId } = req.body;
    const subCategory = await SubCategory.findByPk(req.params.id);
    
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    await subCategory.update({ name, imageUrl, categoryId });
    res.status(200).json(subCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a subcategory
// @route   DELETE /api/subcategories/:id
// @access  Admin
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });

    await subCategory.destroy();
    res.status(200).json({ message: 'SubCategory removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
