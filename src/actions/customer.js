import axios from 'axios';

export const getCustomers = () => dispatch => {
  //Does exactly what it says it does
  axios.get("https://crmpilot0.azurewebsites.net/customers")
  .then(response => dispatch({ type: 'GET_ALL_CUSTOMERS', payload: response.data}))
  .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}}))
} 

export const createCustomer = (customer_information, selected_workers) => dispatch => {
  //Does exactly what it says it does
  axios.post("https://crmpilot0.azurewebsites.net/customers", {customer: customer_information, workers: selected_workers})
  .then(response => {
    dispatch({ type: 'CREATE_NEW_CUSTOMER', payload: {customer: response.data.customer[0], workers: selected_workers}}) 
    dispatch({ type: 'CREATE_NEW_WORKER_CUSTOMERS', payload: response.data.new_worker_customers })
  })
  .catch(err => {
    dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}})
  })
}

export const lookAtSpecificCustomer = (customer_information, workers) => dispatch => {
  // renders show page
  dispatch({type: 'CUSTOMER_SHOW_PAGE', payload: {customer: customer_information, workers: workers}});
}

export const updateNotes = (note_data) => dispatch => {
  //Since we will be defaulting with the notes already blank, we only need patch This both sends the data to the back end as well as updates the current notes on the front end
  dispatch({type: 'NOTE_UPDATED', payload: note_data})
  axios.post(`https://crmpilot0.azurewebsites.net/customers/update`, {value: note_data.value, id: note_data.id})
}

export const destroyCustomer = (customer_id) => dispatch => {
  //This deletes the customer as well as the worker_customers associated with it
  
  axios.post(`https://crmpilot0.azurewebsites.net/customers/destroy`, {id: customer_id})
  .then(() => {
    dispatch({type: 'CUSTOMER_DESTROYED', payload: customer_id});
    dispatch({type: 'WORKER_CUSTOMER_ROWS_DESTROYED', payload: customer_id});  
    })
  .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}}))
}

export const searchCustomers = (customer_search_qualities, worker_chosen, worker_customers_ordered_by_customer_id) => dispatch => {
  //This is how we search for the customers if there are no workers selected
  dispatch({type: 'SEARCH_FOR_CUSTOMERS', payload: {search_qualities: customer_search_qualities, worker_id: worker_chosen.value, all_worker_customers: worker_customers_ordered_by_customer_id}});
}

export const revertSearchedCustomers = () => dispatch => {
  //Does exactly what it says it does
  dispatch({type: "REMOVE_SEARCHED_CUSTOMERS"});
}
