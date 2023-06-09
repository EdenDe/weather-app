import axios from 'axios'
import { utils } from './utils'

export const weatherApi = {
	getForecasts,
	getCities,
	getCurrWeather,
}

const API_KEY = process.env.REACT_APP_API_KEY_WEATHER
const BASE_URL = process.env.REACT_APP_API_WEATHER_BASE_URL

async function getForecasts(locationKey, isMetric) {
	try {
		const result = await axios.get(
			BASE_URL +
				`forecasts/v1/daily/5day/${locationKey}?apikey=${API_KEY}&language=en-us&details=false&metric=${isMetric}`
		)

		return result.data.DailyForecasts.map(({ Date, Day, Temperature }) => {
			return _createWeather(
				Date,
				Day.Icon,
				Day.IconPhrase,
				Temperature.Maximum,
				Temperature.Minimum
			)
		})
	} catch (error) {
		return Promise.reject('could not get forecast')
	}
}

async function getCities(locationName) {
	try {
		const result = await axios.get(
			BASE_URL +
				`locations/v1/cities/autocomplete?apikey=${API_KEY}&q=${locationName}&language=en-us`
		)

		return result.data.map(location => ({ name: location.LocalizedName, id: location.Key })) || []
	} catch (error) {
		return Promise.reject('could not get cities')
	}
}

async function getCurrWeather(locationKey, isMetric) {
	try {
		const result = await axios.get(
			BASE_URL +
				`currentconditions/v1/${locationKey}?apikey=${API_KEY}&language=en-us&details=false`
		)

		const { LocalObservationDateTime, WeatherIcon, WeatherText, Temperature } = result.data[0]
		return _createWeather(
			LocalObservationDateTime,
			WeatherIcon,
			WeatherText,
			Temperature[isMetric ? 'Metric' : 'Imperial']
		)
	} catch (error) {
		return Promise.reject('could not get current weather')
	}
}

function _createWeather(date, weatherIcon, weatherText, maxTemp, minTemp) {
	return {
		id: utils.makeId(7),
		date,
		weatherIcon: (weatherIcon + '').padStart(2, 0),
		weatherText,
		maxTemp,
		minTemp,
	}
}
