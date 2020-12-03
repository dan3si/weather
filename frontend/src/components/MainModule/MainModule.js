import React, { useEffect, useState } from 'react';
import { WEATHER_API_KEY, IMAGES_API_KEY } from '../../global/API';
import Select from 'react-select';
import { Card, Dimmer, Loader, Flag } from 'semantic-ui-react'
import styles from './MainModule.module.scss';
import store from '../../redux/store';
import { addCity, addLocation, addLang } from '../../redux/actionCreators';

export const MainModule = ({ history }) => {
  const [weather, setWeather] = useState({
    city: '',
    country: '',
    cityImage: '',
    description: '',
    temperature: '',
    icon: '',
  });
  const [cityNames, setCityNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const getCityNames = (query) => {
    (async () => {
      const response = await fetch(`/api/cities?query=${query}`);
      const cities = await response.json();
      setCityNames(cities);
    })();
  }

  useEffect(async () => {
    try {
      if (!store.getState().cities.find(
          city => city.data.name.toLowerCase() === store.getState().location?.toLowerCase()
        )
        || !store.getState().location
      ) {
        const locationResponse = await fetch('https://api.sypexgeo.net/');
        const locationData = await locationResponse.json();
        const lang = locationData.country.iso;

        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationData.country.capital_en}&lang=${lang}&appid=${WEATHER_API_KEY}`);
        const weatherData = await weatherResponse.json();

        const imagesResponse = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${locationData.country.capital_en}${IMAGES_API_KEY}`);
        const imagesData = await imagesResponse.json();

        store.dispatch(addLocation(weatherData.name));
        store.dispatch(addLang(lang));
        store.dispatch(addCity({
          data: weatherData,
          image: imagesData.results[0]?.urls.regular,
        }));
      }

      const cachedCity = store
        .getState()
        .cities
        .find(
          city => city.data.name.toLowerCase() === store.getState().location.toLowerCase()
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
      <div className={styles.city}>
        {weather.city}
        <Flag name={weather.country} />
      </div>

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

      <Card
        image={weather.cityImage}
        header={weather.city}
        meta={new Date().toTimeString().slice(0, 5)}
        extra={(
          <Select
            className={styles.search}
            options={cityNames}
            onChange={option => history.push(`/cities/${option.value}`)}
            onInputChange={getCityNames}
            placeholder="Search"
            noOptionsMessage={() => 'No matching results'}
            styles={{
              valueContainer: (provided) => ({
                ...provided,
                cursor: 'text',
              }),
            }}
          />
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
