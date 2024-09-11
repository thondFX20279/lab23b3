import express from "express";
import path from "path";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import initialRoutes from "./routes/index.js";
import socketSever from "./socket.js";
dotenv.config();
const { urlencoded } = bodyParser;
const Port = process.env.PORT || 3030;
const uri =
  "mongodb+srv://thondfx20279:NDTnvt01987274@cluster0.foib8.mongodb.net/message22?retryWrites=true&w=majority&appName=Cluster0";
const app = express();
// app.use(cors({ origin: "*" }));
app.use(cookieParser());
app.use(urlencoded({ extended: false }));
app.use(express.json());
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

initialRoutes(app);

mongoose
  .connect(uri)
  .then(() => {
    const sever = app.listen(Port, () => {
      console.log("app success: ", Port);
    });
    const io = socketSever.init(sever);
    io.on("connection", (thread) => {
      console.log("connected: ");
    });
  })
  .catch((err) => {
    console.log(err);
  });
