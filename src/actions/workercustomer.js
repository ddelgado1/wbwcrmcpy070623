import axios from 'axios';


export const getWorkerCustomers = () => dispatch => {
  axios.get("https://crmpilot0.azurewebsites.net/workercustomers")
  .then(response => dispatch({ type: 'GET_ALL_WORKER_CUSTOMERS', payload: response.data}))
}

export const addWorkerToCustomer = (customer_id, worker_id) => dispatch => {
  //This deletes the customer as well as the worker_customers associated with it
  axios.post(`https://crmpilot0.azurewebsites.net/workercustomers`, {customer_id: customer_id, worker_id: worker_id})
  .then((response) => {
    console.log('here')
    dispatch({type: 'ADDED_WORKER', payload: response.data});
    })
  .catch(err => console.log(err))
}