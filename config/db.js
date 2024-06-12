const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('your_mongo_connection_string');
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
