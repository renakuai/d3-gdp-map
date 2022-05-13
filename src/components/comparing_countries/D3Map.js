import { useRef, useState, useEffect } from 'react';
import { event, select, geoPath, geoMercator, min, max, scaleLinear, scaleThreshold, map, stackOrderNone } from 'd3';
import { feature } from "topojson-client";
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';


const D3Map = (props) => {
  //prior data
  const { clean1980, clean1990, clean2000, clean2010, clean2020, countries } = props;
  const dataLoadedRef = useRef(false);

  //const [loaded, setLoaded] = useState(false);
  const [geo, setGeo] = useState('');
  const d3map = useRef(null);

  //year selection states
  const [select1980, setSelect1980] = useState(false);
  const [select1990, setSelect1990] = useState(false);
  const [select2000, setSelect2000] = useState(false);
  const [select2010, setSelect2010] = useState(false);
  const [select2020, setSelect2020] = useState(true);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(res => {
        setGeo(res);
        dataLoadedRef.current = true;
      })
  }, []);


  const createMap = (() => {
    function generateGeo(i) {
      const mapProjection = d3.geoMercator()
      .scale(140)
      .rotate([0, 0])
      .center([28, 55])
      //.fitHeight(500, geo)
      const geoGenerator = d3.geoPath().projection(mapProjection);
      return geoGenerator(i);
    }
    //find country to fill in gdp color
    function findCountry(name) {
      let fillValue = '';
      if (name !== null && select1980) {
        const country = clean1980.filter(item => item.country === name);
        if (country.length !== 0) {
          fillValue = country[0].gdpPC || 0;
          return fillValue;
        }
        else {
          fillValue = 0
          return fillValue;
        }
      }
    if (name !== null && select1990) {
      const country = clean1990.filter(item => item.country === name);
      if (country.length !== 0) {
        fillValue = country[0].gdpPC || 0;
        return fillValue;
      }
      else {
        fillValue = 0
        return fillValue;
      }
    }
    if (name !== null && select2000) {
      const country = clean2000.filter(item => item.country === name);
      if (country.length !== 0) {
        fillValue = country[0].gdpPC || 0;
        return fillValue;
      }
      else {
        fillValue = 0
        return fillValue;
      }
    }
    if (name !== null && select2010) {
      const country = clean2010.filter(item => item.country === name);
      if (country.length !== 0) {
        fillValue = country[0].gdpPC || 0;
        return fillValue;
      }
      else {
        fillValue = 0
        return fillValue;
      }
    }
    if (name !== null && select2020) {
      const country = clean2020.filter(item => item.country === name);
      if (country.length !== 0) {
        fillValue = country[0].gdpPC || 0;
        return fillValue;
      }
      else {
        fillValue = 0
        return fillValue;
        }
      }
    }

    function handleFill(name) {
      if (select1980) {
        return scale1990(findCountry(name));
      }
      if (select1990) {
        return scale1990(findCountry(name));
      }
      if (select2000) {
        return scale2000(findCountry(name));
      }
      if (select2010) {
        return scale2010(findCountry(name));
      }
      if (select2020) {
        return scale2020(findCountry(name));
      }
    }
    return {
      generateGeo: generateGeo,
      handleFill: handleFill,
      findCountry: findCountry
    }
  })();

  //scales
  const scale1990 = d3.scaleThreshold()
    .domain([250, 500, 1000, 5000, 10000, 15000, 20000, 25000, 30000, 35000])
    .range(['#B93D16', '#D87144', '#F0A269', '#FFC093', '#FED6B9', '#D9C2F6', '#AF93FF', '#522AF1', '#4319E9'])
  const scale2000 = d3.scaleThreshold()
    .domain([250, 500, 1000, 5000, 10000, 15000, 20000, 30000, 40000])
    .range(['#B93D16', '#D87144', '#F0A269', '#FFC093', '#FED6B9', '#D9C2F6', '#6A52FA', '#522AF1', '#4319E9'])
  const scale2010 = d3.scaleThreshold()
    .domain([250, 500, 1000, 5000, 10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000])
    .range(['#B93D16', '#D0562F', '#D87144', '#E48744', '#F0A269', '#FFC093', '#FED6B9', '#F0E4FA', '#AF93FF', '#907DFF','#6A52FA', '#6046FE', '#522AF1','#4319E9'])
  const scale2020 = d3.scaleThreshold()
    .domain([250, 500, 1000, 5000, 10000, 15000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000])
    .range(['#B93D16', '#D0562F', '#D87144', '#E48744', '#F0A269', '#F6B382', '#FFC093', '#CCAAF6', '#AF93FF', '#907DFF', '#7C67FF', '#6A52FA', '#6046FE', '#522AF1', '#4319E9'])
  
  function displayTooltip(e) {
    //set selected country
    const countryCode = e.target.id;
    
    //find country name based on code
    const countryArray = countries.filter(row => row.id === countryCode)
    const countryName = countryArray[0].name || countryCode;

    //reordering svg
    const ID = '#' + countryCode;
    d3.select('#Map')
      .select(ID)
      .raise()
    
    //find country data
    let filtered = '';
    let dataGDP = 0;
    if (select1980) {
      filtered = clean1980.filter(item => item.country === countryCode);
      if (filtered[0].gdpPC) {
        dataGDP = filtered[0].gdpPC.toFixed(0);
      }
      else {
        dataGDP = '--';
      }
    }
    if (select1990) {
      filtered = clean1990.filter(item => item.country === countryCode);
      if (filtered[0].gdpPC) {
        dataGDP = filtered[0].gdpPC.toFixed(0);
      }
      else {
        dataGDP = '--';
      }
    }
    if (select2000) {
      filtered = clean2000.filter(item => item.country === countryCode);
      if (filtered[0].gdpPC) {
        dataGDP = filtered[0].gdpPC.toFixed(0);
      }
      else {
        dataGDP = '--';
      }
    }
    if (select2010) {
      filtered = clean2010.filter(item => item.country === countryCode);
      if (filtered[0].gdpPC) {
        dataGDP = filtered[0].gdpPC.toFixed(0);
      }
      else {
        dataGDP = '--';
      }
    }
    if (select2020) {
      filtered = clean2020.filter(item => item.country === countryCode);
      if (filtered[0].gdpPC) {
        dataGDP = filtered[0].gdpPC.toFixed(0);
      }
      else {
        dataGDP = '--';
      }
    }

    //position tooltip
    const xPos = (window.pageXOffset + e.clientX - 120);
    const yPos = (window.pageYOffset + e.clientY - 90);

    //create tooltip
    d3.select('.SVG')
      .append('div')
      .attr('class', 'Tooltip')
      .style('position', "absolute")
      .style('visibility', 'visible')
      .style('top', yPos + "px")
      .style('left', xPos + "px")
      .append('h5')
      .text(countryName)
    
    d3.select('.Tooltip')
      .append('p')
      .attr('class', 'Tooltip__text')
      .text('GDP Per Capita: ')
    
    d3.select('.Tooltip__text')
      .append('span')
      .attr('class', 'Tooltip__data')
      .text('$'+dataGDP)
  }

  function removeTooltip(e) {
    d3.select('.SVG')
      .select('.Tooltip')
      .remove()
  }

  function handleYear(e) {
    if (e.target.id === '1980') {
      setSelect1980(true);
      setSelect1990(false);
      setSelect2000(false);
      setSelect2010(false);
      setSelect2020(false);
    }
    if (e.target.id === '1990') {
      setSelect1980(false);
      setSelect1990(true);
      setSelect2000(false);
      setSelect2010(false);
      setSelect2020(false);
    }
    if (e.target.id === '2000') {
      setSelect1980(false);
      setSelect1990(false);
      setSelect2000(true);
      setSelect2010(false);
      setSelect2020(false);
    }
    if (e.target.id === '2010') {
      setSelect1980(false);
      setSelect1990(false);
      setSelect2000(false);
      setSelect2010(true);
      setSelect2020(false);
    }
    if (e.target.id === '2020') {
      setSelect1980(false);
      setSelect1990(false);
      setSelect2000(false);
      setSelect2010(false);
      setSelect2020(true);
    }
  }
  
  return (
    <article className="Map">
      <nav className="Year__nav">
        <button id="1980" className={select1980 ? 'Active--year' : null } onClick={handleYear}>1980</button>
        <button id="1990" className={select1990 ? 'Active--year' : null } onClick={handleYear}>1990</button>
        <button id="2000" className={select2000 ? 'Active--year' : null } onClick={handleYear}>2000</button>
        <button id="2010" className={select2010 ? 'Active--year' : null } onClick={handleYear}>2010</button>
        <button id="2020" className={select2020 ? 'Active--year' : null } onClick={handleYear}>2020</button>
      </nav>
      {dataLoadedRef.current && 
        <div className="SVG">
          <div className="Legend"></div>
          <svg id="Map" ref={d3map} viewBox="0 0 855 600" key={uuidv4()}>
          {geo.features.map((i) => {
            return <path
              d={createMap.generateGeo(i)}
              key={i.id}
              id={i.id}
              fill={createMap.handleFill(i.id)}
              stroke="#F9F6FF"
              onMouseEnter={displayTooltip}
              onMouseLeave={removeTooltip}
            />
          })}
          </svg>
        </div>
      }
    </article>
  )
}

export default D3Map;