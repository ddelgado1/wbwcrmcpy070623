import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("https://crmpilot0.azurewebsites.net/workerCustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}

export const addWorkerToCustomer = (customer_id, workers) => dispatch => {
  //This deletes the customer as well as the worker_customers associated with it
  
  axios.post(`https://crmpilot0.azurewebsites.net/workerCustomers/addWorkers`, {customer_id: customer_id, workers: workers})
  .then((response) => {
    dispatch({type: 'ADDED_WORKERS', payload: response});
    })
  .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}}))
}