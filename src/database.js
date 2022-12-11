import mongoose, { connect } from "mongoose";
import { MONGODB_URI } from './config';

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => console.log("MongoDB is connected to", db.connection.host))
  .catch((err) => console.error(err));

export default mongoose;
