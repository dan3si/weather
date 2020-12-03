import React from 'react';
import { CityModule } from '../../components/CityModule';

export const CityPage = ({ match, history }) => {
  return (
    <CityModule
      match={match}
      history={history}
    />
  );
}
