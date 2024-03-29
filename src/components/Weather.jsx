import "./component-css/weather.css";
import { useEffect, useState } from "react";

export const Weather = () => {
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(localStorage.getItem("city"));
  const [isInputVisible, setIsInputVisible] = useState(false);
  useEffect(() => city !== null && localStorage.setItem("city", city), [city]);
  useEffect(
    () =>
      navigator.geolocation.getCurrentPosition((x) =>
        setCoordinates({
          latitude: x.coords.latitude,
          longitude: x.coords.longitude,
        })
      ),
    []
  );

  useEffect(
    () =>
      coordinates.latitude !== 0 &&
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?${
          city !== null
            ? `q=${city}`
            : `lat=${coordinates.latitude}&lon=${coordinates.longitude}`
        }&APPID=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
      )
        .then((res) => res.json())
        .then((x) =>
          setWeatherData({
            location: x.name,
            country: x.sys.country,
            weather: x.weather[0].main,
            weather_description: x.weather[0].description,
            icon: x.weather[0].icon,
            temperature: (x.main.temp - 273.15).toFixed(2),
            temperature_min: (x.main.temp_min - 273.15).toFixed(2),
            temperature_max: (x.main.temp_max - 273.15).toFixed(2),
            humidity: x.main.humidity,
            wind: x.wind.speed,
          })
        ),
    [coordinates, city]
  );

  return (
    <div
      className="weather-wrapper"
      onMouseEnter={() => setIsInputVisible(true)}
      onMouseLeave={() => setIsInputVisible(false)}
    >
      {weatherData !== null && (
        <>
          <div className="temp-wrapper">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
              width="50px"
              height="50px"
              alt="weather-icon"
            />
            {weatherData.temperature}°C
          </div>
          {isInputVisible && (
            <input
              type="text"
              className="city-search"
              placeholder="Enter city name"
              onKeyDown={(e) => e.code === "Enter" && setCity(e.target.value)}
            />
          )}
          {weatherData.location}
        </>
      )}
    </div>
  );
};
