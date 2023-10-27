import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import dashboardRouter from "./routes/dashboard.js";
import authRouter from "./routes/jwtAuth.js";

const { error } = dotenv.config();
if (error) {
  console.error("Error loading .env configuration:", error);
}

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/dashboard", dashboardRouter);
app.use("/api/auth", authRouter);

app.get("/health", (req, res) => res.status(200));

app.use((req, res, next) => {
  res.status(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
