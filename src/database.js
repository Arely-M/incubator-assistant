import mongoose from "mongoose";

const user = "ovoscopia";
const password = "ovoscopia";
const dbname = "DBIncubation";
const uri = `mongodb+srv://${user}:${password}@cluster0.es6kgmx.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((db) => console.log("DataBase is connected"))
  .catch((err) => console.error(err));

export default mongoose;
