import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './reducers/rootreducer.js';


const store = configureStore({
  reducer: rootReducer
})

export default store