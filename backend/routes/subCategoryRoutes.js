const express = require('express');
const router = express.Router();
const { 
  getSubCategories, 
  createSubCategory, 
  updateSubCategory, 
  deleteSubCategory,
  getSubCategoriesByCategory
} = require('../controllers/SubCategoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSubCategories)
  .post(protect, admin, createSubCategory);

router.route('/:id')
  .put(protect, admin, updateSubCategory)
  .delete(protect, admin, deleteSubCategory);

router.route('/category/:categoryId')
  .get(getSubCategoriesByCategory);

module.exports = router;
