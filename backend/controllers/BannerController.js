const { Banner } = require('../models');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Admin
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active banners
// @route   GET /api/banners/active
// @access  Public
exports.getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a banner
// @route   POST /api/banners
// @access  Admin
exports.createBanner = async (req, res) => {
  try {
    const { title, description, imageUrl, link, isActive } = req.body;
    const banner = await Banner.create({
      title,
      description,
      imageUrl,
      link,
      isActive
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a banner
// @route   PUT /api/banners/:id
// @access  Admin
exports.updateBanner = async (req, res) => {
  try {
    const { title, description, imageUrl, link, isActive } = req.body;
    const banner = await Banner.findByPk(req.params.id);
    
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.update({
      title,
      description,
      imageUrl,
      link,
      isActive
    });
    
    res.status(200).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a banner
// @route   DELETE /api/banners/:id
// @access  Admin
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });

    await banner.destroy();
    res.status(200).json({ message: 'Banner removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
