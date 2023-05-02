import { configureStore, combineReducers } from '@reduxjs/toolkit'
import locationReducer from './locationSlice'
import { weatherApi } from './apiSlice'

const rootReducer = combineReducers({
	location: locationReducer,
	[weatherApi.reducerPath]: weatherApi.reducer,
})

export const store = configureStore({
	reducer: rootReducer,
	middleware: getDefaultMiddleware => [...getDefaultMiddleware(), weatherApi.middleware],
})
