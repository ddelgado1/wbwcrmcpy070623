import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("http://localhost:3001/workerCustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}