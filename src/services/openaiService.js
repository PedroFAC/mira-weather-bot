import client from "../config/openai.js";
import { getCurrentWeather } from "./weatherService.js";

const handleRequiresAction = async (run, thread) => {
  if (
    run.required_action &&
    run.required_action.submit_tool_outputs &&
    run.required_action.submit_tool_outputs.tool_calls
  ) {
    const toolOutputs = await Promise.all(
      run.required_action.submit_tool_outputs.tool_calls.map(async (tool) => {
        if (tool.function.name === "getCurrentWeather") {
          const { cityName, countryCode } = JSON.parse(tool.function.arguments);
          const weatherOutput = await getCurrentWeather(cityName, countryCode);
          return {
            tool_call_id: tool.id,
            output: JSON.stringify(weatherOutput),
          };
        }
      })
    );

    if (toolOutputs.length > 0) {
      run = await client.beta.threads.runs.submitToolOutputsAndPoll(
        thread.id,
        run.id,
        { tool_outputs: toolOutputs }
      );
    }

    return handleRunStatus(run, thread);
  }
};

const handleRunStatus = async (run, thread) => {
  if (run.status === "completed") {
    let messages = await client.beta.threads.messages.list(thread.id);
    return messages.data;
  } else if (run.status === "requires_action") {
    return await handleRequiresAction(run, thread);
  } else {
    console.error("Run did not complete:", run);
  }
};

export const processChatMessage = async (message) => {
  const assistant = await client.beta.assistants.retrieve(
    process.env.WEATHER_ASSISTANT_ID
  );
  const thread = await client.beta.threads.create();
  await client.beta.threads.messages.create(thread.id, {
    role: "user",
    content: message,
  });

  let run = await client.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  return await handleRunStatus(run, thread);
};
