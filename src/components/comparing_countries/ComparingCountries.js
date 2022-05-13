import { useRef, useState, useEffect } from 'react';
import D3Map from './D3Map'
import D3Table from './D3Table'
import * as d3 from 'd3';


const ComparingCountries = () => {
  const [data1980, setData1980] = useState([]);
  const [data1990, setData1990] = useState([]);
  const [data2000, setData2000] = useState([]);
  const [data2010, setData2010] = useState([]);
  const [data2020, setData2020] = useState([]);
  const [clean1980, setClean1980] = useState([]);
  const [clean1990, setClean1990] = useState([]);
  const [clean2000, setClean2000] = useState([]);
  const [clean2010, setClean2010] = useState([]);
  const [clean2020, setClean2020] = useState([]);
  const [countries, setCountries] = useState('');
  const [loaded1980, setLoaded1980] = useState(false);
  const [loaded1990, setLoaded1990] = useState(false);
  const [loaded2000, setLoaded2000] = useState(false);
  const [loaded2010, setLoaded2010] = useState(false);
  const [loaded2020, setLoaded2020] = useState(false);


  useEffect(() => {
    const url = 'https://api.worldbank.org/v2/country/all/indicator/NY.GDP.PCAP.CD?format=json&per_page=400&date=';
    fetch(url + '1980')
      .then(res => res.json())
      .then((json) => {
        setData1980(json[1]);
      });
    fetch(url + '1990')
      .then(res => res.json())
      .then((json) => {
        setData1990(json[1]);
      });
    fetch(url + '2000')
      .then(res => res.json())
      .then((res) => {
        setData2000(res[1])
      });
    fetch(url + '2010')
      .then(res => res.json())
      .then((res) => {
        setData2010(res[1])
      });
    fetch(url + '2020')
      .then(res => res.json())
      .then((res) => {
        setData2020(res[1])
      });
    fetch('https://api.worldbank.org/v2/country?format=json&per_page=400')
      .then(res => res.json())
      .then((res) => {
        const filtered = res[1].filter((item) => item.region.value !== 'Aggregates')
        setCountries(filtered)
      })
  }, []);

  useEffect(() => {
    if (data1980.length !== 0) {
      data1980.map((item) => {
        const country = item.countryiso3code;
        const gdpPC = item.value;
        const obj = [{ country, gdpPC }];
        setClean1980(clean1980 => clean1980.concat(obj))
        setLoaded1980(true);
      })
    }
    if (data1990.length !== 0) {
      data1990.map((item) => {
        const country = item.countryiso3code;
        const gdpPC = item.value;
        const obj = [{ country, gdpPC }];
        setClean1990(clean1990 => clean1990.concat(obj))
        setLoaded1990(true);
      })
    }
    if (data2000.length !== 0) {
      data2000.map((item) => {
        const country = item.countryiso3code;
        const gdpPC = item.value;
        const obj = [{ country, gdpPC }];
        setClean2000(clean2000 => clean2000.concat(obj))
        setLoaded2000(true);
      })
    }
    if (data2010.length !== 0) {
      data2010.map((item) => {
        const country = item.countryiso3code;
        const gdpPC = item.value;
        const obj = [{ country, gdpPC }];
        setClean2010(clean2010 => clean2010.concat(obj))
        setLoaded2010(true);
      })
    }
    if (data2020.length !== 0) {
      data2020.map((item) => {
        const country = item.countryiso3code;
        const gdpPC = item.value;
        const obj = [{ country, gdpPC }];
        setClean2020(clean2020 => clean2020.concat(obj))
        setLoaded2020(true);
      })
    }
  }, [data1990, data2000, data2010, data2020, data1980])

  const data = {
    clean1990,
    clean2000,
    clean2010,
    clean2020,
    clean1980,
    countries
  }

  return (
    <section className="Comparing--Countries Proj">
      <header>
        <h4>About</h4>
        <p>Visualizing Gross Domestic Product (GDP) per capita (in current US$) from 1980 to 2020.</p>
        <h6 className="Source">Source(s): The World Bank</h6>
      </header>
      {(loaded1980 && loaded1990 && loaded2000 && loaded2010 && loaded2020) ? <D3Map {...data} /> : null}
      {(loaded1980 && loaded1990 && loaded2000 && loaded2010 && loaded2020) ? <D3Table countries={countries} />: null}
    </section>
  )
}

export default ComparingCountries;