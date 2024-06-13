export async function getCurrentWeather(cityName, countryCode) {
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
