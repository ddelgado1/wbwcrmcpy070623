import { useRef, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { Link, Outlet } from 'react-router-dom';
import { setCurrentWorker } from '../actions/worker';
import { deleteErrors } from "../actions/error";
import { useDispatch, useSelector } from 'react-redux';
import { useMsal } from "@azure/msal-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/**
 * Renders the header with a sign in/out button as well as all of the page links
 */
export const PageLayout = (props) => {
    const dispatch = useDispatch();
    const workers = useSelector((state) => state.workers);
    
    const error = useSelector((state) => state.errors.error); //This is our errors. We have this so that in the case of a 500 or 404 error, we can render a new page, and in the case of a 406, we just show the message

    const userIsInSystemRef = useRef(false); // Even if the user has an account within the allowances of what we have for microsoft, we will use this to determine if they are valid (as in they are saved to the database). If not, we won't render anything

    const isAuthenticated = useIsAuthenticated();
    //The eslint thing is here since we don't need instance and I don't want the whole warning thing
    //eslint-disable-next-line
    const { instance, accounts } = useMsal();
    
    useEffect(() => {
        //This useEffect's purpose is to determine if the user with the username of the person signing in is valid
        if (workers.workers.length !== 0 && accounts.length !== 0 && Object.keys(workers.current_worker).length === 0){
            const findWorker = workers.workers.filter(worker => worker.email === accounts[0].username)
            if (findWorker.length !== 0){
                userIsInSystemRef.current = true;
                dispatch(setCurrentWorker(findWorker[0]))
            }
        }
    }, [accounts, workers, dispatch])

    

    useEffect(() => {
        //This displays a toast notification that shows the errors
        if (Object.keys(error).length !== 0 && error.err_code === 406){
            const error_message = () => {
                toast(error.err_message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    onClose: () => {dispatch(deleteErrors())}
                    });
            }
            error_message();
        }
    }, [error, dispatch])


    if (Object.keys(error).length === 0 || error.err_code === 406){
        return (
            <>
            { isAuthenticated && userIsInSystemRef.current ?
            <div>
                <Navbar bg="primary" variant="dark">
                    <div className="app_header">
                        <h3><Link to="customers">View All Customers</Link></h3>
                        <h3><Link to="calendar">View Calendar</Link></h3>
                        {workers.current_worker.admin === 1 && <h3><Link to="new_customer">Create a New Customer</Link></h3>}
                        <h3><Link to="search">Search Customers</Link></h3>
                        {workers.current_worker.admin === 1 && <h3><Link to="new_worker">Add a New Worker</Link></h3>}
                        <h3 id="sign_out_button"><SignOutButton /></h3>
                    </div>
                </Navbar>
                <Outlet />
                <ToastContainer />
            </div>
                    : 
            <div>
                <Navbar bg="primary" variant="dark"><SignInButton /></Navbar>
                {userIsInSystemRef.current ? <p>Welcome to the WBW CRM! Please sign in</p> : <p>You are not within this system and as such are not elligible to use this site</p>}
            </div>
            }
                <br />
                <br />
                {props.children}
            </>
        );
    }
    else{
        return(
            <>
                <h1 id="error_header">Error {error.err_code} - {error.err_value}</h1>
                <h3 id="error_message">{error.err_message}</h3>
            </> 
        )
    }
};

