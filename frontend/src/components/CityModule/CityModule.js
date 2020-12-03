import React, { useEffect, useState } from 'react';
import { WEATHER_API_KEY, IMAGES_API_KEY } from '../../global/API';
import { Card, Flag, Loader, Dimmer } from 'semantic-ui-react'
import styles from './CityModule.module.scss';
import store from '../../redux/store';
import { addCity, addLang } from '../../redux/actionCreators';

export const CityModule = ({ match, history }) => {
  const [weather, setWeather] = useState({
    city: '',
    country: '',
    cityImage: '',
    description: '',
    temperature: '',
    icon: '',
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(async () => {
    try {
      const cityID = +match.params.cityID;

      if (!store.getState().lang) {
        const locationResponse = await fetch('https://api.sypexgeo.net/');
        const locationData = await locationResponse.json();
        store.dispatch(addLang(locationData.country.iso));
      }

      if (!store.getState().cities.find(city => city.data.id === cityID)) {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityID}&lang=${store.getState().lang}&appid=${WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();
  
        const imagesResponse = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${weatherData.name}${IMAGES_API_KEY}`);
        const imagesData = await imagesResponse.json();

        store.dispatch(addCity({
          data: weatherData,
          image: imagesData.results[0]?.urls.regular,
        }));
      }

      const cachedCity = store.getState().cities.find(
        city => city.data.id === cityID
      );

      setWeather({
        city: cachedCity.data.name,
        country: cachedCity.data.sys.country.toLowerCase(),
        cityImage: cachedCity.image,
        description: cachedCity.data.weather[0].description[0].toUpperCase() + cachedCity.data.weather[0].description.slice(1),
        temperature: Math.round(cachedCity.data.main.temp - 273.15),
        icon: `http://openweathermap.org/img/w/${cachedCity.data.weather[0].icon}.png`,
      });

      setIsLoading(false);
    } catch (error) {
      alert(error);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => history.push('/')}
        />

        <div className={styles.city}>
          {weather.city}
        </div>

        <Flag name={weather.country} className={styles.flag} />
      </div>

      <Card
        image={weather.cityImage}
        header={weather.city}
        meta={new Date().toTimeString().slice(0, 5)}
        extra={(
          <div className={styles.weather}>
            <div className={styles.description}>
              {weather.description}
            </div>

            <div className={styles.temperature}>
              {weather.temperature}
            </div>

            <img
              src={weather.icon}
              className={styles.weatherIcon}
              alt="weather icon"
            />
          </div>
        )}
        fluid
      />

      {isLoading && (
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      )}
    </div>
  );
}
