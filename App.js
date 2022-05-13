import './styles/App.css';
import ComparingCountries from './components/comparing_countries/ComparingCountries';
import { useRef, useState } from 'react';
import React from 'react';
import * as d3 from 'd3';
import { Outlet } from "react-router-dom";

function App() {
  const [blueTheme, setBlueTheme] = useState(true);

  return (
    <div className={blueTheme ? ("App Theme__blue") : null}>
      <header className="App__header">
        <h1>Visualizing GDP Per Capita</h1>
      </header>
      <main className="Main__app">
        <ComparingCountries />
      </main>
    </div>
  );
}

export default App;
