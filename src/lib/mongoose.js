import mongoose from "mongoose";

const MONGODB_URI_DEV = process.env.MONGODB_URI_DEV;
const MONGODB_URI_PROD = process.env.MONGODB_URI_PROD;

const MONGODB_URI =
  process.env.NODE_ENV === "production" ? MONGODB_URI_PROD : MONGODB_URI_DEV;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI_DEV and MONGODB_URI_PROD environment variables inside .env.local or in the production environment"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
