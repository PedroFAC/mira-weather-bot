import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getCurrentWeather(cityName, countryCode) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    return "Service currently unavailable";
  }
}

const tools = [
  {
    type: "function",
    function: {
      name: "getCurrentWeather",
      description: "Get the current weather in a given location",
      parameters: {
        type: "object",
        properties: {
          cityName: {
            type: "string",
            description: "The city that the user is located on, e.g: New York",
          },
          countryCode: {
            type: "string",
            description:
              "The country code of the country that the user is located on, e.g: United States",
          },
        },
        required: ["cityName", "countryCode"],
      },
    },
  },
];

const availableTools = {
  getCurrentWeather,
};

const messages = [
  {
    role: "system",
    content: `You are a helpful weather assistant. Only use the functions you have been provided with.
    Someone should go outside only if:
    Temperature feels like less than 25 Celcius
    Humidity is less than 80%
    There is no rain
    Wind speed is lower than 5 m/s
    `,
  },
];

async function agent(userInput) {
  messages.push({
    role: "user",
    content: userInput,
  });

  for (let i = 0; i < 5; i++) {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: messages,
      tools: tools,
    });

    const { finish_reason, message } = response.choices[0];

    if (finish_reason === "tool_calls" && message.tool_calls) {
      const functionName = message.tool_calls[0].function.name;
      const functionToCall = availableTools[functionName];
      const functionArgs = JSON.parse(message.tool_calls[0].function.arguments);
      const functionArgsArr = Object.values(functionArgs);
      const functionResponse = await functionToCall.apply(
        null,
        functionArgsArr
      );
      messages.push({
        role: "function",
        name: functionName,
        content: `
                The result of the last function was this: ${JSON.stringify(
                  functionResponse
                )}
                `,
      });
    } else if (finish_reason === "stop") {
      messages.push(message);
      return message.content;
    }
  }
  return "The maximum number of iterations has been met without a suitable answer. Please try again with a more specific input.";
}

export { agent };
