import { useEffect, useState } from 'react'
import './App.css'

const DEFAULT_CITY = 'London'
const GEOCODE_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_ENDPOINT = 'https://api.open-meteo.com/v1/forecast'

function toSentence(text) {
  if (!text) {
    return 'Unknown'
  }

  return text.replaceAll('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())
}

function getWeatherCodeDetails(code) {
  const map = {
    0: { label: 'Clear sky', icon: 'sun' },
    1: { label: 'Mainly clear', icon: 'sun-cloud' },
    2: { label: 'Partly cloudy', icon: 'cloud-sun' },
    3: { label: 'Overcast', icon: 'cloud' },
    45: { label: 'Fog', icon: 'fog' },
    48: { label: 'Depositing rime fog', icon: 'fog' },
    51: { label: 'Light drizzle', icon: 'rain' },
    53: { label: 'Moderate drizzle', icon: 'rain' },
    55: { label: 'Dense drizzle', icon: 'rain' },
    56: { label: 'Freezing drizzle', icon: 'sleet' },
    57: { label: 'Freezing drizzle', icon: 'sleet' },
    61: { label: 'Slight rain', icon: 'rain' },
    63: { label: 'Moderate rain', icon: 'rain' },
    65: { label: 'Heavy rain', icon: 'rain' },
    66: { label: 'Freezing rain', icon: 'sleet' },
    67: { label: 'Freezing rain', icon: 'sleet' },
    71: { label: 'Slight snow', icon: 'snow' },
    73: { label: 'Moderate snow', icon: 'snow' },
    75: { label: 'Heavy snow', icon: 'snow' },
    77: { label: 'Snow grains', icon: 'snow' },
    80: { label: 'Rain showers', icon: 'rain' },
    81: { label: 'Rain showers', icon: 'rain' },
    82: { label: 'Violent rain showers', icon: 'rain' },
    85: { label: 'Snow showers', icon: 'snow' },
    86: { label: 'Snow showers', icon: 'snow' },
    95: { label: 'Thunderstorm', icon: 'storm' },
    96: { label: 'Thunderstorm with hail', icon: 'storm' },
    99: { label: 'Thunderstorm with hail', icon: 'storm' },
  }

  return map[code] || { label: 'Unknown conditions', icon: 'cloud' }
}

function getWeatherIcon(icon) {
  switch (icon) {
    case 'sun':
      return '☀'
    case 'sun-cloud':
      return '⛅'
    case 'cloud-sun':
      return '🌤'
    case 'fog':
      return '🌫'
    case 'rain':
      return '🌧'
    case 'sleet':
      return '🌨'
    case 'snow':
      return '❄'
    case 'storm':
      return '⛈'
    default:
      return '☁'
  }
}

async function fetchCityWeather(cityName, signal) {
  const searchResponse = await fetch(
    `${GEOCODE_ENDPOINT}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`,
    { signal },
  )

  if (!searchResponse.ok) {
    throw new Error('Unable to find that city right now.')
  }

  const searchData = await searchResponse.json()

  if (!searchData?.results?.length) {
    throw new Error('No weather location matched that city name.')
  }

  const location = searchData.results[0]
  const weatherResponse = await fetch(
    `${WEATHER_ENDPOINT}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`,
    { signal },
  )

  if (!weatherResponse.ok) {
    throw new Error('Weather service returned an unexpected response.')
  }

  const weatherData = await weatherResponse.json()
  const current = weatherData?.current
  const hourly = weatherData?.hourly ?? {}
  const currentIndex = Array.isArray(hourly.time)
    ? hourly.time.findIndex((time) => time === current?.time)
    : -1

  return {
    location,
    current,
    hourly,
    currentIndex,
    raw: weatherData,
  }
}

function App() {
  const [query, setQuery] = useState(DEFAULT_CITY)
  const [searchInput, setSearchInput] = useState(DEFAULT_CITY)
  const [weather, setWeather] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadWeather() {
      setStatus('loading')
      setError('')

      try {
        const result = await fetchCityWeather(query, controller.signal)
        setWeather(result)
        setStatus('success')
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return
        }

        setWeather(null)
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load weather data.')
        setStatus('error')
      }
    }

    loadWeather()

    return () => controller.abort()
  }, [query])

  function handleSearch(event) {
    event.preventDefault()

    const nextQuery = searchInput.trim()

    if (!nextQuery) {
      return
    }

    setQuery(nextQuery)
  }

  const currentWeather = weather?.current
  const weatherCode = currentWeather?.weather_code ?? 3
  const weatherDetails = getWeatherCodeDetails(weatherCode)
  const hourly = weather?.hourly ?? {}
  const currentIndex = weather?.currentIndex ?? -1
  const nextHours = Array.isArray(hourly.time)
    ? hourly.time.slice(Math.max(currentIndex, 0), Math.max(currentIndex, 0) + 6).map((time, index) => ({
        time,
        temperature: hourly.temperature_2m?.[Math.max(currentIndex, 0) + index],
        humidity: hourly.relative_humidity_2m?.[Math.max(currentIndex, 0) + index],
        wind: hourly.wind_speed_10m?.[Math.max(currentIndex, 0) + index],
        code: hourly.weather_code?.[Math.max(currentIndex, 0) + index],
      }))
    : []

  return (
    <main className="weather-app">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Weather dashboard</p>
          <h1>Live conditions by city.</h1>
          <p className="lede">
            Search any city, fetch live weather through async JavaScript, and inspect the
            nested JSON response behind the metrics.
          </p>
        </div>

        <form className="search-card" onSubmit={handleSearch}>
          <label className="sr-only" htmlFor="city-search">
            Search weather by city name
          </label>
          <input
            id="city-search"
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search city, e.g. Nairobi"
            autoComplete="off"
            maxLength={80}
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="content-grid">
        <article className="weather-card spotlight">
          <div className="spotlight-head">
            <div>
              <p className="card-label">Current location</p>
              <h2>{weather?.location ? `${weather.location.name}, ${weather.location.country}` : query}</h2>
            </div>
            <span className="weather-icon" aria-hidden="true">
              {getWeatherIcon(weatherDetails.icon)}
            </span>
          </div>

          {status === 'loading' ? (
            <p className="status-message">Loading live weather data...</p>
          ) : error ? (
            <p className="status-message error" role="alert">
              {error}
            </p>
          ) : null}

          {currentWeather ? (
            <div className="current-summary">
              <div className="temperature-block">
                <span className="temperature">{Math.round(currentWeather.temperature_2m)}°</span>
                <p>{weatherDetails.label}</p>
              </div>

              <dl className="metrics-grid">
                <div>
                  <dt>Humidity</dt>
                  <dd>{currentWeather.relative_humidity_2m}%</dd>
                </div>
                <div>
                  <dt>Wind speed</dt>
                  <dd>{Math.round(currentWeather.wind_speed_10m)} km/h</dd>
                </div>
                <div>
                  <dt>Coordinates</dt>
                  <dd>
                    {weather?.location?.latitude?.toFixed(2)}, {weather?.location?.longitude?.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt>Timezone</dt>
                  <dd>{toSentence(weather?.raw?.timezone)}</dd>
                </div>
              </dl>
            </div>
          ) : null}
        </article>

        <article className="weather-card details-card">
          <div className="card-header">
            <div>
              <p className="card-label">Nested JSON snapshot</p>
              <h2>Forecast window</h2>
            </div>
            <span className={status === 'success' ? 'pill success' : 'pill'}>{status}</span>
          </div>

          <div className="forecast-list">
            {nextHours.length > 0 ? (
              nextHours.map((entry) => {
                const hour = new Date(entry.time).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })

                const codeDetails = getWeatherCodeDetails(entry.code)

                return (
                  <div key={entry.time} className="forecast-row">
                    <div>
                      <strong>{hour}</strong>
                      <p>{codeDetails.label}</p>
                    </div>
                    <div>
                      <span>{Math.round(entry.temperature)}°</span>
                      <small>{Math.round(entry.wind)} km/h wind</small>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="forecast-empty">
                <p>Search a city to inspect the next hours of live forecast data.</p>
              </div>
            )}
          </div>

          <details className="json-panel">
            <summary>View raw JSON structure</summary>
            <pre>{JSON.stringify(weather?.raw, null, 2)}</pre>
          </details>
        </article>
      </section>
    </main>
  )
}

export default App
