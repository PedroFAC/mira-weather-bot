import express from "express";
import "dotenv/config";
import { chatController } from "./controllers/chatController.js";

const app = express();

app.use(express.json());
app.post("/chat", chatController);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
