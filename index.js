const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user.js");
const categoryRoutes = require("./routes/category");
const medicineRoutes = require("./routes/medicine.js")
const cartRoutes = require("./routes/cart.js")
const orderRoutes = require("./routes/order.js");
const { errorHandler } = require('./auth');


require("dotenv").config();

// [SECTION] Server setup
const app = express();

// [SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(errorHandler);

const corsOptions = {
	origin: ["https://24meds-client.vercel.app", 
		"https://24meds-client-git-master-juberts-projects.vercel.app", 
		"https://24meds-client-o28d52dqm-juberts-projects.vercel.app"],
	credentials: true,
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));  


// [SECTION] MongoDB Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas"));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes); 
app.use("/medicines", medicineRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);


// [SECTION] Server Gateway Response
if(require.main === module) {
	app.listen(process.env.PORT || 4000, () => console.log(`API is now available in port ${process.env.PORT || 4000}`));
} 

module.exports = { app, mongoose };
