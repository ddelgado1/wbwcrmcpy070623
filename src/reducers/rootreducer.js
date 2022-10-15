import { withReduxStateSync } from 'redux-state-sync';

import {combineReducers} from 'redux';
import customerReducer from './customerreducer';
import workerReducer from './workerreducer';
import workerCustomerReducer from './workercustomerreducer';
import errorReducer from './errorreducer';
import calendarReducer from './calendarreducer';

export default withReduxStateSync(combineReducers({customers: customerReducer, workers: workerReducer, workerCustomers: workerCustomerReducer, errors: errorReducer, calendar: calendarReducer}))