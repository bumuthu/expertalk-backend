import mongoose from 'mongoose';

const connectToTheDatabase = async () => {

    const MONGO_PATH = process.env.TALK_MONGO_PATH;
    console.log("Mongo URL:", MONGO_PATH);

    if ([1, 2].includes(mongoose.connection.readyState) == false) {
        await mongoose.connect(MONGO_PATH)
            .then(res => console.log('Connected to db'))
            .catch(err => console.log(err));
    }
}

export default connectToTheDatabase;