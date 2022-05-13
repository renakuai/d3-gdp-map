import { useRef, useState, useEffect } from 'react';
import { event, select, geoPath, geoMercator, min, max, scaleLinear, scaleThreshold, map, stackOrderNone } from 'd3';
import { feature } from "topojson-client";
import * as d3 from 'd3';
import { v4 as uuidv4 } from 'uuid';


const D3Table = (props) => {
  const { countries } = props;
  const [data, setData] = useState('');
  const [loaded, setLoaded] = useState(false);

  //prior data
  useEffect(() => {
    fetch('https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=12000&date=1980:2020&frequency=Y')
      .then(res => res.json())
      .then((res) => {
        let filtered = [];
        for (let i = 0; i < res[1].length; i++) {
          if (res[1][i].date === '2020' || res[1][i].date === '2010' || res[1][i].date === '2000' || res[1][i].date === '1990' || res[1][i].date === '1980')
            filtered.push(res[1][i]);
        }
        setData(filtered);
        setLoaded(true);
      })
  }, [])
  
  function getData(country, year) {
    let filterByYear = '';
    if (year === '1980') {
      filterByYear = data.filter(row => row.date === '1980');
    }
    if (year === '1990') {
      filterByYear = data.filter(row => row.date === '1990');
    }
    if (year === '2000') {
      filterByYear = data.filter(row => row.date === '2000');
    }
    if (year === '2010') {
      filterByYear = data.filter(row => row.date === '2010');
    }
    if (year === '2020') {
      filterByYear = data.filter(row => row.date === '2020');
    }
    const filterByCountry = filterByYear.filter(row => row.countryiso3code === country);
    let gdp =''
    if (filterByCountry.length === 0) {
      gdp = '--';
    }
    if (filterByCountry.length !== 0) {
      const val = +filterByCountry[0].value
      gdp = val.toFixed(0);
    }
    return gdp;
  }

  const calcData =(() => {
    function dollar(country) {
      let dollarVal = ''
      if (getData(country, '2020') === '--' || getData(country, '1980') === '--') {
        dollarVal = '--'
      }
      dollarVal = +getData(country, '2020') - +getData(country, '1980');
      return dollarVal;
    }
    function perc(country) {
      let percVal = ''
      if (getData(country, '2020') === '--' || getData(country, '1980') === '--' || getData(country, '1980') === '0' || getData(country, '2020') === '0') {
        return percVal = '--'
      }
      else {
        percVal = ((getData(country, '2020') - getData(country, '1980')) / (+getData(country, '1980')));
        return (percVal * 100).toFixed(1);
      }
    }
    return {
      dollar,
      perc,
    }
  })()

  //for each country, loop through and display country name
  //loop through each clean datasheet and find datapoints for respective country
  //take difference between clean2020 point and clean1990 point
  //div clean2020 / clean1990 * 100%
  return (
    <article className="Table">
      <header>GDP per capita for all countries and years</header>
      <table>
        <colgroup>
          <col span="1" style={{ width: '20%' }}/>
          <col span="1" style={{ width: '10%' }}/>
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '10%' }} />
          <col span="1" style={{ width: '10%' }}/>
        </colgroup>
        {loaded &&
          <tbody>
            <th>Country</th>
            <th>1980</th>
            <th>1990</th>
            <th>2000</th>
            <th>2010</th>
            <th>2020</th>
            <th>Change($)</th>
            <th>Change(%)</th>
            {countries.map((country) => {
              return <tr key={country.id} id={country.id}>
                <td><span className="Col__bold">{country.name}</span></td>
                <td>{getData(country.id, '1980')}</td>
                <td>{getData(country.id, '1990')}</td>
                <td>{getData(country.id, '2000')}</td>
                <td>{getData(country.id, '2010')}</td>
                <td>{getData(country.id, '2020')}</td>
                <td>${calcData.dollar(country.id)}</td>
                <td><span className="Col__bold" style={{ color: calcData.perc(country.id) > 0 ? '#55FF52' : '#FF584E' }}>{calcData.perc(country.id)}%</span></td>
              </tr>
            })}
          </tbody>}
      </table>
    </article>
  )
}

export default D3Table;