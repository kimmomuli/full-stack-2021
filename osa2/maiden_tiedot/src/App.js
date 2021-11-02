import React, { useState, useEffect } from 'react';
import axios from 'axios'

const ShowOneCountry = ({ showCountry, setWeather, weather  }) => {
  useEffect(() => {
    axios
      .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${showCountry.capital}`)
      .then(response => {
        setWeather(response.data)
      })
    // eslint-disable-next-line
    }, [showCountry.name])

  if (weather !== null) {
    return (
      <>
        <h1>{showCountry.name}</h1>
        <p>capital {showCountry.capital}</p>
        <p>population {showCountry.population}</p>
        <h2>languages</h2>
        <ul>
          {Object.values(showCountry.languages).map(lang => <li key={lang.name}>{lang.name}</li>)}
        </ul>
        <img height="100" src={showCountry.flags.png} alt="flag" />
        <h2>Weather in Helsinki</h2>
        <p><b>temperature: </b>{weather.current.temperature} Celcius</p>
        <img height="100" width="100" src={weather.current.weather_icons} alt="weather icon"/>
        <p><b>wind: </b>{weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>
      </>
    )}
    return null
}

const ShowCountriesList = ({ showCountries, setFilter }) => {
  return (
    <>
      {
        showCountries.map(country =>
          <div key={country.name}>
            {country.name} <button onClick={() => setFilter(country.name)}>show</button>
          </div>
        )
      }
    </>
  )
}

const Countries = ({ showCountries, setFilter, filter, weather, setWeather }) => {
  if (filter === '' && showCountries.length === 0) {
    return null
  }
  if (showCountries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  } else if (showCountries.length === 1) {
    return (
      <>
        <ShowOneCountry showCountry={showCountries[0]} weather={weather} setWeather={setWeather}/>
      </>
    )
  }
  return (
    <div>
      <ShowCountriesList showCountries={showCountries} setFilter={setFilter}/>
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  
  useEffect(() => {
    axios
      .get('https://restcountries.com/v2/all')
      .then(response => setCountries(response.data))
  }, [])
  
  const handleFilterChange = (event) => setFilter(event.target.value)
  
  const showCountries = filter.length === 0
  ? []
  : countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      <br />
      <Countries filter={filter} showCountries={showCountries} setFilter={setFilter} weather={weather} setWeather={setWeather}/>
    </div>
  )
}

export default App;