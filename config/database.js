import mongoose from 'mongoose';

let connected = false;

const connectDB = async () => {
    mongoose.set('strictQuery', true);

    // if database already connected, dont connect again
    if (connected) {
        console.log('mongodb is already connected');
        return;
    }

    // connect to mongodb
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        connected = true;
        console.log('mongodb connected...')

    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
