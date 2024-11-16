const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
}

/**
 * Connect to MongoDB using Mongoose.
 */
exports.connect = async () => {
    try {
        console.log("⏳ Connecting to the MongoDB database...");

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Successfully connected to the MongoDB database.");
    } catch (error) {
        console.error("Failed to connect to the database.");
        console.error(`Error: ${error.message || error}`);
        process.exit(1); // Exit the application if the database connection fails
    }

    // Log the database connection status
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connection established.");
    });

    mongoose.connection.on("error", (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB connection lost. Attempting to reconnect...");
    });
};
