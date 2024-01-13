import mongoose from 'mongoose';

const connectToTheDatabase = async () => {

    const MONGO_PATH = process.env.MO_MONGO_PATH;
    console.log("Mongo URL:", MONGO_PATH);

    if ([1, 2].includes(mongoose.connection.readyState) == false) {
        await mongoose.connect(MONGO_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
            .then(res => console.log('Connected to db'))
            .catch(err => console.log(err));
    }
}

export default connectToTheDatabase;