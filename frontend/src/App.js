import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { CityPage } from './pages/CityPage';
import 'semantic-ui-css/semantic.min.css';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact component={MainPage} />
      <Route path="/cities/:cityID" exact component={CityPage} />
    </BrowserRouter>
  );
}

export default App;
