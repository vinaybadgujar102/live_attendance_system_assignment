import express from "express";
import http from "http";
import cors from "cors";
import connectToDB from "./db";
import v1Router from "./routers/index.router";
import router from "./routers/index.router";
import { initWsServer } from "./infrastructure/WebSocketManager";

const app = express();
const server = http.createServer(app);

// middlewares
app.use(express.json());
app.use(cors());

app.use("/", router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  connectToDB();
  initWsServer(server);
  console.log(`listening on port ${port}`);
});
