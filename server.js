import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// * ---------------------------Routers-----------------------------
import ProductRouter from "./routers/productRouter.js";
import StockExchangeRouter from "./routers/stockRouter.js";
import WareHouseRouter from "./routers/warehouseRouter.js";
import stockRouter from "./routers/stockRouterr.js";
import inwardRoutes from "./routers/inwardRouter.js";
import outwardRoutes from "./routers/outwardRouter.js";
import authRouter from "./routers/userRouter.js";
import newCustomerRouter from "./routers/FinanceModule/newCustomer.js";
import additionalDetialsRouter from "./routers/FinanceModule/extraDetails.js";
import addressDetailsRouter from "./routers/FinanceModule/addressDetails.js";
import assetDetailsRouter from "./routers/FinanceModule/asset.js";
import officeDetailsRouter from "./routers/FinanceModule/officeInfo.js";
import zipVerifyRouter from "./routers/FinanceModule/zipauthen.js";
import documentsRouter from "./routers/FinanceModule/documentRoutes.js";
import userDetailsRouter from "./routers/FinanceModule/userDetails.js";
import bankDetailsRouter from "./routers/FinanceModule/bankDetailsRouter.js";
import loanDetailsRouter from "./routers/FinanceModule/loanDetailsRouter.js";
import SchemeRouter from "./routers/FinanceModule/schemeRouter.js";
// * ---------------------------public----- ------------------------

// * --------------General middleware for set up-------------------

// * -----------Dynamic storing of multimedia-------------------------
app.use(cors({ origin: "*", credentials: true })); // allow all origins in prod
app.use(cookieParser());
app.use(express.json());

// * -----------------------------------------------------------

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test route" });
});

// * -----------------Building-Blocks---------------------------------
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/warehouse", WareHouseRouter);
app.use("/api/v1/stockExchange", StockExchangeRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/inward", inwardRoutes);
app.use("/api/v1/outward", outwardRoutes);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/newCustomer", newCustomerRouter);
app.use("/api/v1/additionalDetails", additionalDetialsRouter);
app.use("/api/v1/addressDetails", addressDetailsRouter);
app.use("/api/v1/assetDetails", assetDetailsRouter);
app.use("/api/v1/officeDetails", officeDetailsRouter);
app.use("/api/v1/zipVerify", zipVerifyRouter);
app.use("/api/v1/documents", documentsRouter);
app.use("/api/v1/userDetails", userDetailsRouter);
app.use("/api/v1/bankDetails", bankDetailsRouter);
app.use("/api/v1/loanDetails", loanDetailsRouter);
app.use("/api/v1/Schemes", SchemeRouter);
// * -----------------------------------------------------------
// Serve React frontend
// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend/dist", "index.html"));
});
const port = process.env.PORT || 3000;

try {
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
