import actionTypes from './actionTypes';

export const addCity = (city) => ({
  type: actionTypes.ADD_CITY,
  city,
});

export const addLocation = (location) => ({
  type: actionTypes.ADD_LOCATION,
  location,
});

export const addLang = (lang) => ({
  type: actionTypes.ADD_LANG,
  lang,
})
