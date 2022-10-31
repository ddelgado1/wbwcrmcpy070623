import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("https://crmpilot0.azurewebsites.net/workerCustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}