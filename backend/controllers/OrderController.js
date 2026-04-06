const { Order, OrderItem, Product, sequelize } = require('../models');

// @desc    Place an order
// @route   POST /api/orders
// @access  User (Authenticated)
exports.placeOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, address } = req.body;
    let totalAmount = 0;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided' });
    }

    const order = await Order.create({
      userId: req.user.id,
      address,
      status: 'pending',
    }, { transaction });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);

      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const itemTotal = parseFloat(product.price) * item.quantity;
      totalAmount += itemTotal;

      await OrderItem.create({
        orderId: order.id,
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      }, { transaction });

      product.stock -= item.quantity;
      await product.save({ transaction });
    }

    order.totalAmount = totalAmount;
    await order.save({ transaction });

    await transaction.commit();

    const completeOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    if (transaction) await transaction.rollback();
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  User (Authenticated)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({ status });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
