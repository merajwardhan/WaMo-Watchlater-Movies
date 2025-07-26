// MongoDB connection

  import mongoose from 'mongoose';

  const DATABASE_NAME = "Wamo";
  const MONGO_URL = `mongodb://172.21.16.1:27017/${DATABASE_NAME}`;

  export async function connectDB() {
    try {
      const conn = await mongoose.connect(MONGO_URL);

      console.log(`Mongo DB connected : ${conn.connection.host}`);

      mongoose.connection.on('error', err => {
        console.error(`MongoDB connection error : ${err}`);
      })
      mongoose.connection.on('disconnected', () => {
        console.warn(`MongoDB disconnected!!!`);
      })

    } catch (error) {
      console.error(`Unable to connect to MongoDB : ${error}`);
      process.exit(1) //stop the process if the DB is unrechable
    }
  }