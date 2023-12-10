const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Transaction = require("./models/Transaction");
const dotenv = require("dotenv");

const app = express();
const port = process.env.PORT || 5000;

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/test", (req, res) => {
  res.json("Test Working");
});

app.post("/api/transaction", async (req, res) => {
  try {
    console.log("MongoDB URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({
      name,
      description,
      datetime,
      price
    });

    res.json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Always close the connection, whether successful or with an error
    mongoose.disconnect();
  }
});

app.get('/api/transactions', async (req,res)=>{
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
