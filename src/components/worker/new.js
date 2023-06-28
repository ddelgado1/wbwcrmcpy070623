import {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createWorker } from '../../actions/worker';

import '../components.scss';

const New = () => {
     
    const [worker, setWorker] = useState(
        {
            name: "",
            email: "",
            confirmation_email: "",
            admin: false
        }
    );

    const [checked, setChecked] = useState(false); //Determines if admin checkbox is checked or not

    const dispatch = useDispatch();
    const errors = useSelector((state) => state.errors.error);
    const selectedWorker = useSelector((state) => state.workers.current_worker); //We will be using this to determine if the user has a right to access this page
 
    const [renderedAlready, setRenderedAlready] = useState(false); // Will determine if it's been rendered already so we don't need to worry about the message popping up immediately on render


    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        setRenderedAlready(true)
        dispatch(createWorker(worker));
    }


    const handleChange = (e) => {
        const newKey = e.target.id;
        const newValue = e.target.value
        if (newKey === "admin"){
            setChecked(!checked)
            setWorker(oldState => ({...oldState, "admin": !checked}))
        }
        else{
            setWorker(oldState => ({ ...oldState, [newKey]: newValue}));
        }
        
        
    }
    if (Object.keys(selectedWorker).length !== 0){
        if (selectedWorker.admin === 1){
            return(
                <div className='form-container'>
                    <h1 className="form-title">Add a WB Wood Worker to the system</h1>
                    <form id="worker_form" onSubmit={e => handleSubmit(e)}>
                        <div className="form-field">
                            <label>
                                Worker Name: <span className='red_asterisk'>*</span>
                                <input type="text" defaultValue={worker.name} id="name" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>    
                        <div className="form-field">
                            <label>
                                Worker Email:  <span className='red_asterisk'>*</span>
                                <input type="text" defaultValue={worker.email} id="email" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>    
                        <div className="form-field">
                            <label>
                                Confirmation Email: <span className='red_asterisk'>*</span>
                                <input type="text" defaultValue={worker.confirmation_email} id="confirmation_email" onChange={e => handleChange(e)}></input>
                            </label>
                        </div>    
                        <div className="form-field">
                            <label>
                                Are they an admin?: <input type="checkbox" checked={checked} id="admin" onChange={e => handleChange(e)} />
                            </label>
                        </div>
                        <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button">Submit</button>
                    </form>
                    <h3 className='new_messages'>{renderedAlready === true && Object.keys(errors).length === 0 ? "Worker created successfully" : null}</h3>
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


