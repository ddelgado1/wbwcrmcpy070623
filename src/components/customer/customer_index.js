import '../components.scss';
import { lookAtSpecificCustomer } from '../../actions/customer';
import { useMemo, lazy, Suspense, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Table = lazy(() => import('./customer_index_table.js'));


const Index = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const customers = useSelector((state) => state.customers) // Here are all of the customers
    const customersIfNoSearchedCustomersElseSearchedCustomersRef = useRef([]) //The reason we're including this is that if there are searched customers, we want to use them instead of all customers
    const workers = useSelector((state) => state.workers)
    const workerCustomers = useSelector((state) => state.workerCustomers)
    

    const columns = useMemo( //These are the columns for the table we're using
        () => [
          {
            Header: 'Customers',
            columns: [
              {
                Header: 'Company Name',
                accessor: 'company',
              },
              {
                Header: 'Customer Name',
                accessor: 'customer_name',
              },
              {
                Header: 'Category',
                accessor: 'category',
              },
              {
                Header: 'Workers',
                accessor: 'workers',
              },
              {
                Header: "See Customer",
                accessor: "customer_button"
              }
            ],
          }
        ],
        []
      )
    
    const workerListMaker = (id_of_customer) => {
        //Using worker_customers to get worker information 
        const workers_list = [];
        const worker_customers_list = workerCustomers.worker_customers.filter(x => x.customer_id === id_of_customer);
        for (const worker_customer of worker_customers_list){
            workers_list.push(workers.workers.find(worker => worker.id === worker_customer.worker_id).name)
        }
        return workers_list
    }
    
    const dataMaker = () => {
        //This is how we make the array work in a way that 
        if (customers.searched){
            customersIfNoSearchedCustomersElseSearchedCustomersRef.current = customers.searched_customers
        }
        else{
            customersIfNoSearchedCustomersElseSearchedCustomersRef.current = customers.customers
        }
        return (customersIfNoSearchedCustomersElseSearchedCustomersRef.current.map((individual_customer) => {
            const workers_array = workerListMaker(individual_customer.id).map((worker, index, workers) => {
                if (index + 1 === workers.length){
                    return worker;
                }
                else{
                    return worker + ", ";
                }
            });
            return(
                {
                    company: individual_customer.company,
                    customer_name: individual_customer.contact_name,
                    category: individual_customer.category,
                    workers: workers_array,
                    customer_button: <button onClick={e => handleClick(e, individual_customer)}>Click To see</button>
                }
            )
        }))
    }
    
    const handleClick = (e, chosen_customer) => {
        //This should mean they clicked on a choice and now they're supposed to be routed to the show page of that specific customer
        dispatch(lookAtSpecificCustomer(chosen_customer, workerListMaker(chosen_customer.id)))
        navigate('/customer')
        /* Route to page once redux saves the information */
    }

    if (workerCustomers.worker_customers_succeeded === false || customers.customers_succeeded === false || workers.workers_succeeded === false ){
        return <h1>Loading...</h1>
    }
    else{
        return(
            <div className="index">
                <Suspense fallback={<h1>Loading...</h1>}><Table columns={columns} data={dataMaker()} /></Suspense>
            </div>
        )
    }
    
}



export default Index;
