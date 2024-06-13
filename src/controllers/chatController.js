import { processChatMessage } from "../services/openaiService.js";

export const chatController = async (req, res) => {
  const message = req.body.message;
  try {
    const responses = await processChatMessage(message);
    res.json(responses);
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).send("Service currently unavailable");
  }
};
