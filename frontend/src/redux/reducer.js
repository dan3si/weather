import actionTypes from './actionTypes';

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_CITY:
      return {
        ...state,
        cities: [
          ...state.cities,
          action.city,
        ],
      }
    
    case actionTypes.ADD_LOCATION:
      return {
        ...state,
        location: action.location,
      }
    
    case actionTypes.ADD_LANG:
      return {
        ...state,
        lang: action.lang,
      }

    default:
      return state;
  }
}
