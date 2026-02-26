const mongoose = require('mongoose');
const User = require('./models/User');

async function run() {
    try {
        await mongoose.connect('mongodb://localhost:27017/skillbuddy_db');
        const user = await User.findOne();
        if (!user) {
            console.log("No user found");
            process.exit(0);
        }
        console.log("User before:", user.dateOfBirth);

        const dateOfBirth = "";

        user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
        await user.save();
        console.log("Successfully saved!");
        console.log("User after:", user.dateOfBirth);
    } catch (e) {
        console.error("Error saving:", e);
    } finally {
        mongoose.disconnect();
    }
}
run();
