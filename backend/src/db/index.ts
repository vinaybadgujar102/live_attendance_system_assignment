import mongoose from "mongoose";
import { DB_NAME } from "../constants";

async function connectToDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`,
    );
  } catch (e) {
    console.log("Connection to db failed: ", e);
    process.exit(1);
  }
}

export default connectToDB;
