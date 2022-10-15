import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {searchCustomers, revertSearchedCustomers} from '../../actions/customer.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import '../components.scss';

const Search = () => {
    const [customer, setCustomer] = useState(
        {
         company: "",
         customer_name: "",
         category: ""
        });

    const [selected, setSelected] = useState({}); //This determines what has and hasn't been selected yet with workers

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const search_select_workers = useSelector((state) => state.workers.select_tag_worker_list);
    const customers = useSelector((state) => state.customers);
    const workerCustomers = useSelector((state) => state.workerCustomers);

    const hasRenderedRef = useRef(false); //This determines if it's been rendered yet so we don't risk navigating on render

    useEffect(() => {
        //Navigates to the index page on the change of searched_customers
        if (hasRenderedRef.current === true && customers.search_message === null && customers.searched === true){
            navigate("/customers");
        };
        
    }, [customers, navigate, dispatch]);
   
    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        dispatch(revertSearchedCustomers());
        hasRenderedRef.current = true;
        dispatch(searchCustomers(customer, selected, workerCustomers.worker_customers_ordered_by_customer))
        
    }

    const handleChange = (e) => {
        //Handle change for all elements that aren't the Select component
        const newKey = e.target.id;
        const newValue = e.target.value;
        setCustomer(oldState => ({ ...oldState, [newKey]: newValue}));
    }

    const handleSelect = (e) => {
        //Handle change for the Select component
        setSelected(e);
    }
    return(
        <>
            <h1>Search</h1>
            <form id="customer_form" onSubmit={handleSubmit}>
                <label>
                    Company: 
                    <input type="text" defaultValue={customer.company} id="company" onChange={e => handleChange(e)}></input>
                </label>
                <label>
                    Customer: 
                    <input type="text" defaultValue={customer.customer_name} id="customer_name" onChange={e => handleChange(e)}></input>
                </label>
                <label>
                    Category: 
                    <select id="category"onChange={e => handleChange(e)} defaultValue={'Default'}>
                        <option value="Default"> -- no choice -- </option>
                        <option value="EU">EU</option>
                        <option value="REB">REB</option>
                        <option value="A&D">A&D</option>
                        <option value="PMfirm">PMfirm</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
                <label>
                    Workers: 
                    <div id="select_search">
                        <Select options={search_select_workers} onChange={e => handleSelect(e)} />
                    </div>
                </label>
            <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button">Submit</button>
            </form>
            <h2 className='new_messages'>{customers.search_message}</h2>
        </>
    )
}

export default Search;
