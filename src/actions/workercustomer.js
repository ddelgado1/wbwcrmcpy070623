import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("https://crmpilot0.azurewebsites.net/workerCustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}

export const addWorkerToCustomer = (customer_id, worker_id) => dispatch => {
  //This deletes the customer as well as the worker_customers associated with it
  axios.post(`https://crmpilot0.azurewebsites.net/workerCustomers`, {customer_id: customer_id, worker_id: worker_id})
  .then((response) => {
    dispatch({type: 'ADDED_WORKER', payload: response.data});
    })
  .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}}))
}