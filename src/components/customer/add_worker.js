import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addWorkerToCustomer } from '../../actions/workercustomer.js';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

import '../components.scss';

const AddWorkerToCustomer = () => {
     
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const errors = useSelector((state) => state.errors.error);
    const customerChosen = useSelector((state) => state.customers.selected_customer); //This is the current customer we get from redux
    const allWorkers = useSelector((state) => state.workers.select_tag_worker_list); //This is all of the workers formatted for select
    const selectedWorker = useSelector((state) => state.workers.current_worker); //We will be using this to determine if the user has a right to access this page
    const workerCustomers = useSelector((state) => state.workerCustomers.worker_customers); //These are the worker customers that will be accessed in the useEffect to determine if a change has occurred
    
    const [selected, setSelected] = useState({}); //This determines what has and hasn't been selected yet with workers

    const hasBeenRenderedRef = useRef(false); //Used to determine if we've rendered it yet or not so that we don't have to run second useEffect at first render

    useEffect(() => {
        //When the customer gets deleted (if there are no errors) or we reload the page, we navigate to the main page
        if (hasBeenRenderedRef.current === true && Object.keys(errors).length === 0){
            navigate("/contacts");
        };
    }, [workerCustomers, errors, navigate])
    
    

    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        hasBeenRenderedRef.current = true;
        dispatch(addWorkerToCustomer(customerChosen, selected))

    }

    const handleSelect = (e) => {
        //Handle change for the Select component
        setSelected(e);
    }

    if (Object.keys(selectedWorker).length !== 0){
        if (selectedWorker.admin === 1){
            return(
                <>
                    <form id="add_worker_form" onSubmit={e => handleSubmit(e)}>
                        <label>
                            Choose one or more owners to add: 
                            <div id="select_search">
                                <Select options={allWorkers} onChange={e => handleSelect(e)} />
                            </div>
                        </label>
                        <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button">Submit</button>
                    </form>
                </>
            )
        }
        else{
            return(
                <div id="Forbidden">
                    <h1>Error 403 - Forbidden</h1>
                    <h2>You do not have access to this page</h2>
                </div>
            )
        }
    }
    else{
        return(<h1>Loading...</h1>)
    }
}

export default AddWorkerToCustomer;


