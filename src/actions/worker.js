import axios from 'axios';

export const getWorkers = () => dispatch => {
  axios.get("https://crmpilot0.azurewebsites.net/workers")
  .then(response => dispatch({ type: 'GET_ALL_WORKERS', payload: response.data}))
}

export const createWorker = (worker_information) => dispatch => {
  //Does exactly what it says it does
  if (worker_information.email === worker_information.confirmation_email){
    // We add this if since we're just gonna do the confirmation email validation here to simplify things since it's not a key in the worker table
    axios.post("https://crmpilot0.azurewebsites.net/workers", worker_information)
    .then(response => {
      dispatch({ type: 'CREATE_NEW_WORKER', payload: response.data}) 
    })
    .catch(err => {
      console.log(err)
      dispatch({type: 'ERROR_CAUGHT', payload: {err_message: err.response.data.message, err_code: err.response.request.status, err_value: err.response.request.statusText}})})
  }
  else{
    dispatch({type: 'ERROR_CAUGHT', payload: {err_message: "Email and confirmation email do not match", err_code: 406, err_value: "didn't work"}})
  }
}

export const setCurrentWorker = (worker_information) => dispatch => {
  //Once we have confirmation that the worker is signed in, we set the current worker to be this
  dispatch({type: 'SET_CURRENT_WORKER', payload: worker_information});
}
export const getGroupList = (accessToken) => dispatch => {
  //Gets us our user info
    axios.get(`https://graph.microsoft.com/v1.0/groups/628f70b0-c47a-43f9-8e0a-e7b34cafd770/members`,
    {headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
          'Prefer' : 'outlook.body-content-type="text"'
    }})
    .then(response => {
      dispatch({type: 'GROUP_WORKER_LIST', payload: response.data.value})})
    .catch(err => dispatch({type: 'ERROR_CAUGHT', payload: {err_message: "Can't find calendar for account", err_code: err.response.request.status, err_value: err.response.request.statusText}}));
}
