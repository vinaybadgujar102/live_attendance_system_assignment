import express from "express";
import cors from "cors";
import connectToDB from "./db";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectToDB();
  console.log(`listening on port ${port}`);
});
