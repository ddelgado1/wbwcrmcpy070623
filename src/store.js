import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './reducers/rootreducer.js';


const store = configureStore({
  reducer: rootReducer,
  devTools: false
})

export default store