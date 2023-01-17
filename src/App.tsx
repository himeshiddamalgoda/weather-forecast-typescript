import { useState, ChangeEvent, useEffect } from 'react'
import Forecast from './components/Forecast'
import Search from './components/Search'

import { forecastType, optionType } from './types'

const App = (): JSX.Element => {
  const [term, setTerm] = useState<string>('')
  const [options, setOptions] = useState<[]>([])
  const [city, setCity] = useState<optionType | null>(null)
  const [forecast, setForecast] = useState<forecastType | null>(null)

  const getSearchOptions = (value: string) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=5&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
  }

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setTerm(value)

    if (value === '') return

    getSearchOptions(value)
  }

  const onOptionSelect = (option: optionType) => {
    setCity(option)
    // console.log(option.name);
  }

  const getForecast = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const forecastData = {
          ...data.city,
          list:data.list.slice(0,16)
        }
        console.log(forecastData)
        setForecast(forecastData)
      })
  }

  const onSubmit = () => {
    if (!city) return

    getForecast(city)
  }

  useEffect(() => {
    if (city) {  
      setTerm(city.name)
      setOptions([])
    }
  }, [city])

  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-sky-200 to-white h-[100vh] w-full">
      {forecast? (
        <Forecast data={forecast} />

      ):(
        <Search 
          term={term} 
          options={options} 
          onInputChange={onInputChange} 
          onOptionSelect={onOptionSelect}
          onSubmit={onSubmit}
        />
      )}
      
    </main>
  )
}

export default App
