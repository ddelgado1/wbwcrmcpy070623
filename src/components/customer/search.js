import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {searchCustomers, revertSearchedCustomers} from '../../actions/customer.js';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import AutoCompleteSearch from "./select_search";

import '../components.scss';

const Search = () => {
    const [customer, setCustomer] = useState(
        {
         company: "",
         contact_name: "",
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
            navigate("/contacts");
        };
        
    }, [customers, navigate, dispatch]);
   
    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        dispatch(revertSearchedCustomers());
        hasRenderedRef.current = true;
        dispatch(searchCustomers(customer, selected, workerCustomers.worker_customers))
        
    }

    const handleCategoryChange = (e) => {
        //Handle change for the category component
       setCustomer(oldState => ({ ...oldState, category: e.target.value}));
    }

    const handleSelect = (e) => {
        //Handle change for the Select component
        setSelected(e);
    }

    const autoSearchItemsMaker = (tag) => {
        return tag === "company" ? customers.customers.map(customer => customer.company)
        : 
        customers.customers.map(customer => customer.contact_name)
    }

    return(
        <>
            <h1 id="search-title">Search</h1>
            <form id="customer_form" onSubmit={handleSubmit} className='search-form'>
                <div className='search-form__group'>
                    <AutoCompleteSearch className="custom-select" title={"Company"} key_name={"company"} customers={autoSearchItemsMaker("company")} setCustomer={setCustomer} />
                    <AutoCompleteSearch className="custom-select" title={"Contact"} key_name={"contact_name"} customers={autoSearchItemsMaker("contact_name")} setCustomer={setCustomer} />
                </div>
                <div className='search-form__group'>
                    <label>
                        Category: 
                        <select id="category"onChange={e => handleCategoryChange(e)} defaultValue={'Default'}>
                            <option value="Default"> -- no choice -- </option>
                            <option value="EU">EU</option>
                            <option value="REB">REB</option>
                            <option value="A&D">A&D</option>
                            <option value="PMfirm">PMfirm</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                </div>
                <div className='search-form__group'>
                    <label>
                        WB Wood Owners: 
                        <div id="select_search">
                            <Select options={search_select_workers} onChange={e => handleSelect(e)} />
                        </div>
                    </label>
                </div>
            <button type="submit" onClick={e => handleSubmit(e)} className="search-form__button">Submit</button>
            </form>
            <h2 className='new_messages'>{customers.search_message}</h2>
        </>
    )
}

export default Search;
