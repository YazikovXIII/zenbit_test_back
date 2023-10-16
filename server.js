const app = require("./app");
const mongoose = require("mongoose");
const { DB_HOST } = process.env;

mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(8000);
    console.log("Database connected");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
