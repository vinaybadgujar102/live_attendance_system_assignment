import express from "express";
import cors from "cors";
import connectToDB from "./db";
import v1Router from "./routers/index.router";
import router from "./routers/index.router";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

app.use("/", router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectToDB();
  console.log(`listening on port ${port}`);
});
