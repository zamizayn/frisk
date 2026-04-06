const app = require('./app');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Sync Models
    // In development, you might use { alter: true } to update tables without losing data
    // Or { force: true } to drop and recreate (CAUTION: Lose all data)
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');

    // 3. Start Listening
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
};

startServer();
