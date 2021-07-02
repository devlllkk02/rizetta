//Imports
const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URI } = require("./config/keys");
const PORT = process.env.PORT || 5000;

//Initialise the express app
const app = express();
app.use(express.json());

//Connnect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.log(error));

//Routes
require("./models/UserModel");
require("./models/RecipeModel");

app.use(require("./routes/UserRoutes"));
app.use(require("./routes/RecipeRoutes"));
app.use(require("./routes/VisitorRoutes"));


//Deploy to Heroku
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

//Listen
app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
