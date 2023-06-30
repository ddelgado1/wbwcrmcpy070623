import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";
import { Link, Outlet } from 'react-router-dom';
import { setCurrentWorker } from '../actions/worker';
import { revertSearchedCustomers } from '../actions/customer.js';
import { deleteErrors } from "../actions/error";
import { useDispatch, useSelector } from 'react-redux';
import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../authConfig";
// import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getRoleFromToken } from '../utils/tokenUtils';

import './components.scss';

import logo from "./Logo.png";
/**
 * Renders the header with a sign in/out button as well as all of the page links
 */
export const PageLayout = (props) => {
    const dispatch = useDispatch();
    const workers = useSelector((state) => state.workers);

    const error = useSelector((state) => state.errors.error); //This is our errors. We have this so that in the case of a 500 or 404 error, we can render a new page, and in the case of a 406, we just show the message

    const isAuthenticated = useIsAuthenticated();
    //The eslint thing is here since we don't need instance and I don't want the whole warning thing
    //eslint-disable-next-line
    const { instance, accounts } = useMsal();

    const [userRole, setUserRole] = useState(null); // New state for holding the role of the user

    useEffect(() => {
        //This is getting the userRole from the given token
        const role = getRoleFromToken(instance, accounts);
        setUserRole(role);
    }, [instance, accounts]);



    useEffect(() => {
        //This displays a toast notification that shows the errors
        if (Object.keys(error).length !== 0 && error.err_code === 406) {
            const error_message = () => {
                toast(error.err_message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    onClose: () => { dispatch(deleteErrors()) }
                });
            }
            error_message();
        }
    }, [error, dispatch])

    useEffect(() => {
        //This useEffect's purpose is to determine if the user with the username of the person signing in is valid
        if (workers.workers.length !== 0 && accounts.length !== 0 && Object.keys(workers.current_worker).length === 0) {
            const findWorker = workers.workers.filter(worker => worker.email === accounts[0].username)
            if (findWorker.length !== 0) {
                dispatch(setCurrentWorker(findWorker[0]))
            }
        }
    }, [accounts, workers, dispatch])

    // useEffect(() => {
    //     // Fetch access token so that we can get our group data. 
    //     if (isAuthenticated && accounts.length > 0) {
    //         instance.acquireTokenSilent({
    //             ...loginRequest,
    //             account: accounts[0]
    //         }).then((response) => {
    //             dispatch(getGroupList(response.accessToken))
    //         }).catch(error => {
    //             if (error instanceof InteractionRequiredAuthError) {
    //                 // fallback to interaction when silent call fails
    //                 instance.acquireTokenRedirect(loginRequest);
    //             }
    //         });
    //     }
    // }, [isAuthenticated, instance, accounts, dispatch]);

    const resetSearch = (e) => {
        dispatch(revertSearchedCustomers());
    }

    if (Object.keys(error).length === 0 || error.err_code === 406) {
        return (
            <>
                {isAuthenticated ?
                    <div>
                        <Navbar >
                            <div className="app_header">
                                <img src={logo} alt="Company Logo" id="wbw-logo" />
                                <h3 onClick={e => resetSearch(e)}><Link to="contacts">View All Contacts</Link></h3>
                                {userRole === 'CRM.Manage' && <h3 onClick={e => resetSearch(e)}><Link to="new_contact">Create a New Contact</Link></h3>}
                                <h3 onClick={e => resetSearch(e)}><Link to="search">Search Contacts</Link></h3>
                                <h3 id="sign_out_button"><SignOutButton /></h3>
                            </div>
                        </Navbar>

                        <Outlet />

                        <ToastContainer />
                    </div>
                    :
                    <div>
                        <Navbar bg="primary" variant="dark"><SignInButton /></Navbar>
                        <p>Welcome to the WBW CRM! Please sign in</p>
                    </div>
                }
                <br />
                <br />
                {props.children}
            </>
        );
    }
    else {
        return (
            <>
                <h1 id="error_header">Error {error.err_code} - {error.err_value}</h1>
                <h3 id="error_message">{error.err_message}</h3>
            </>
        )
    }
};


