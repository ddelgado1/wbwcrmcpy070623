import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("https://enigmatic-reaches-71021.herokuapp.com/workerCustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}