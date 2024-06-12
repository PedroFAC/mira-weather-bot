import express from "express";
import { agent } from "./agent.js";
const app = express();
app.use(express.json());
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.post("/chat", async (req, res) => {
  const message = req.body.message;
  const receivedMessage = await agent(message);
  res.json({ receivedMessage });
});
