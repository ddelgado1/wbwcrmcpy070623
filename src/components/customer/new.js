import {useState, useEffect, useRef} from 'react';
import { MultiSelect } from "react-multi-select-component";
import { useSelector, useDispatch } from 'react-redux';
import {createCustomer} from '../../actions/customer.js';
import { useNavigate } from 'react-router-dom';

import '../components.scss';

const New = () => {
    const [customer, setCustomer] = useState(
        {
         company: "",
         contact_name: "",
         title: "",
         email: "",
         number: "",
         old_address: "",
         new_address: "",
         category: "EU",
         broker_company: "",
         broker_name: "",
         broker_number: "",
         broker_email: "",
         architect_company: "",
         architect_name: "",
         architect_number: "",
         architect_email: "",
         consultant_company: "",
         consultant_name: "",
         consultant_number: "",
         consultant_email: ""
        });

    const [selected, setSelected] = useState([]); //This determines what has and hasn't been selected yet with workers

    const dispatch = useDispatch();
    const workers = useSelector((state) => state.workers);
    const errors = useSelector((state) => state.errors.error);
    const customers = useSelector((state) => state.customers.customers); //We add this purely so the useEffect where we navigate will be called when a new customer is made!
    const selectedWorker = useSelector((state) => state.workers.current_worker); //We will be using this to determine if the user has a right to access this page


    const navigate = useNavigate();


    const hasBeenRenderedRef = useRef(false); //Used to determine if we've rendered it yet or not so that we don't have to run second useEffect at first render

    useEffect(() => {
        //This useEffect is for determining if we've had our workersTables changed so that we can render our show and not worry about the index page having a lack of workers in it
        if (hasBeenRenderedRef.current === true && Object.keys(errors).length === 0){
           navigate("/contact");
        }
        else{
            hasBeenRenderedRef.current = false
        }
        }, [errors, customers, navigate]) 


    
    
     

    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        hasBeenRenderedRef.current = true;
        dispatch(createCustomer(customer, selected));
    }


    const handleChange = (e) => {
        const newKey = e.target.id;
        const newValue = e.target.value
        setCustomer(oldState => ({ ...oldState, [newKey]: newValue}));
    }
    
    if (Object.keys(selectedWorker).length !== 0){
        if (selectedWorker.admin === 1){
            return(
                <div className='form-container'>
                    <h1 className="form-title">Create a new Contact</h1>
                    <form id="customer_form" onSubmit={handleSubmit}>
                        <div className='form-field-container'>
                            <div className="form-field">
                                <label>
                                    Company: <span className='red_asterisk'>*</span>
                                    <input type="text" defaultValue={customer.company} id="company" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Contact: <span className='red_asterisk'>*</span>
                                    <input type="text" defaultValue={customer.contact_name} id="contact_name" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    WB Wood Owners: <span className='red_asterisk'>*</span>
                                    <div id="multi_select">
                                    <MultiSelect 
                                        options={workers.select_tag_worker_list}
                                        value={selected}
                                        onChange={setSelected}
                                        labelledBy="Select"
                                    />
                                    </div>
                                
                                    
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Title: 
                                    <input type="text" id="title" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Email: 
                                    <input type="text" defaultValue={customer.email} id="email" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                        <div className="form-field">
                            <label>
                                Number: 
                                <input type="text" defaultValue={customer.number} id="number" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>
                        <div className="form-field">
                            <label>
                                Old Address: 
                                <input type="text" defaultValue={customer.old_address} id="old_address" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>
                        
                        <div className="form-field">
                            <label>
                                New Address: 
                                <input type="text" defaultValue={customer.new_address} id="new_address" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>
                       
                        <div className="form-field">
                            <label>
                                Category: 
                                <div className="custom-select">
                                    <select id="category" onChange={e => handleChange(e)}>
                                        <option value="EU">EU</option>
                                        <option value="REB">REB</option>
                                        <option value="A&D">A&D</option>
                                        <option value="PMfirm">PMfirm</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                            </label>
                        </div>
                        </div>

                        <div className='form-field-container'>
                            <div className="form-field">
                                <label>
                                    Broker Company: 
                                    <input type="text" defaultValue={customer.broker_company} id="broker_company" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            
                            <div className="form-field">
                                <label>
                                    Broker Name: 
                                    <input type="text" defaultValue={customer.broker_name} id="broker_name" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            
                            <div className="form-field">
                                <label>
                                    Broker Number: 
                                    <input type="text" defaultValue={customer.broker_number} id="broker_number" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            
                            <div className="form-field">
                                <label>
                                    Broker Email: 
                                    <input type="text" defaultValue={customer.broker_email} id="broker_email" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                        
                        </div>
                        
                        <div className='form-field-container'>
                            <div className="form-field">
                                <label>
                                    Architect Company: 
                                    <input type="text" defaultValue={customer.architect_company} id="architect_company" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Architect Name: 
                                    <input type="text" defaultValue={customer.architect_name} id="architect_name" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Architect Number: 
                                    <input type="text" defaultValue={customer.architect_number} id="architect_number" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Architect Email: 
                                    <input type="text" defaultValue={customer.architect_email} id="architect_email" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                        </div>

                        <div className='form-field-container'>
                            <div className="form-field">
                                <label>
                                    Consultant Company: 
                                    <input type="text" defaultValue={customer.consultant_company} id="consultant_company" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>

                            <div className="form-field">
                                <label>
                                    Consultant Name: 
                                    <input type="text" defaultValue={customer.consultant_name} id="consultant_name" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Consultant Number: 
                                    <input type="text" defaultValue={customer.consultant_number} id="consultant_number" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                            <div className="form-field">
                                <label>
                                    Consultant Email: 
                                    <input type="text" defaultValue={customer.consultant_email} id="consultant_email" onChange={e => handleChange(e)}></input>
                                </label>
                            </div>
                        </div>
                    <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button form-button">Submit</button>
                    </form>
                </div>
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

export default New;

