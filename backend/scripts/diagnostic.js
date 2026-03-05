import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    isApproved: Boolean,
});

const User = mongoose.model('User', userSchema);

const check = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'name email role isApproved');
        console.log('USERS_FOUND:' + JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('DIAGNOSTIC_ERROR:', err);
        process.exit(1);
    }
};

check();
