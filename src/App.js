import { getCustomers } from './actions/customer.js';
import { getWorkers } from './actions/worker';
import { Routes, Route } from 'react-router-dom';
import { getWorkerCustomers } from './actions/workercustomer'
import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { PageLayout } from "./components/PageLayout";
import {lazy, Suspense} from 'react';
import './App.css';  

const Index = lazy(() => import('./components/customer/customer_index.js'));
const NewCustomer = lazy(() => import('./components/customer/new.js'));
const Show = lazy(() => import('./components/customer/show.js'));
const Search = lazy(() => import('./components/customer/search.js'));
const NewWorker = lazy(() => import('./components/worker/new.js'));
const OutlookCalendarDisplay = lazy(() => import('./components/calendar/calendarDisplay.js'));
const OutlookCalendarEventCreate = lazy(() => import('./components/calendar/createEvent.js'));
const Home = lazy(() => import('./components/home.js'));

const App = () => {
    
    const dispatch = useDispatch();

      useEffect(() => {
        dispatch(getCustomers());
        dispatch(getWorkers());
        dispatch(getWorkerCustomers());
      }, [dispatch]);

    return(
      <div>
        <PageLayout /> 
        <Suspense fallback={<h1>Loading...</h1>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="customers" element={<Index />} />
            <Route path="new_customer" element={<NewCustomer />} />
            <Route path="customer" element={<Show />} />
            <Route path="search" element={<Search />} />
            <Route path="new_worker" element={<NewWorker />} />
            <Route path="calendar" element={<OutlookCalendarDisplay />} />
            <Route path="event_create" element={<OutlookCalendarEventCreate />} />
          </Routes>
        </Suspense>
      </div>
      
    )
}
export default App;