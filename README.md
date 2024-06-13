# Mira Weather Bot

Mira Weather Bot is a chat API created with Express that uses the OpenAI Assistant API to provide weather information for specific cities around the world.

## Features

- Retrieve current weather information for any city
- Simple API interface
- Built using Express.js
- Integrates with OpenAI's Assistant API

## Getting Started

### Installation

1. Install dependencies
```sh
 npm install
```
2. Create a .env file in the root directory and add your OpenAI API key, Weather API Key, and the Id of the OpenAI Assistant you have created
```sh
OPENAI_API_KEY=your_openai_api_key
WEATHER_ASSISTANT_ID=your_openai_assistant_id
WEATHER_API_KEY=your_weather_api_key
```
### Running the Application
```sh
npm start
```
The server will start on the port specified in your environment variables or default to port 3000.


### Usage
To get the weather information for a specific city, make a POST request to the following endpoint:

#### Request
The request body should be in JSON format and include the message you want to send to the assistant:
```json
{
  "message": "Can I go out today in New York, US?"
}
```