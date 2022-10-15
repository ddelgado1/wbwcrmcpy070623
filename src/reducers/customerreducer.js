const initialState = {
    customers: [],
    customers_succeeded: false, //The purpose of this is that when we start the webpage, if we have no customers at all, we run the risk of having it load forever. Instead, we'll change this and load based on if this is true or not instead of if there are customers or not
    selected_customer: {},
    selected_customer_workers: [],
    searched_customers: [],
    searched: false, //The purpose of this is to determine if we got to the index page by searching or not. That way, if there are no search results, we don't default to the main page,
    search_message: null //Rather than have an "errors" quality, we just make this its own thing
}

export default function customerReducer(state = initialState, action){
    switch(action.type){
        case 'GET_ALL_CUSTOMERS':
            return{
                ...state,
                customers: action.payload,
                customers_succeeded: true
            }
        case 'CUSTOMER_SHOW_PAGE':
            return{
                ...state,
                selected_customer: action.payload.customer,
                selected_customer_workers: action.payload.workers
            }
        case 'NOTE_UPDATED':
            return{
                ...state,
                selected_customer: {...state.selected_customer, notes: state.selected_customer.notes + action.payload.value}
            }
        case 'CUSTOMER_DESTROYED':
            return{
                ...state,
                customers: state.customers.filter(customer => customer.id !== action.payload),
                selected_customer: {},
                selected_customer_workers: []

            }
        case 'REMOVE_SEARCHED_CUSTOMERS':
            return{
                ...state,
                searched_customers: [],
                searched: false
            }
        case 'CREATE_NEW_CUSTOMER':
            return{
                ...state,
                customers: [...state.customers, action.payload.customer],
                selected_customer: action.payload.customer,
                selected_customer_workers: action.payload.workers
            }
        case 'SEARCH_FOR_CUSTOMERS':
            //Here, our action.payload looks like this: {search_qualities: {company: "...", customer_name: "...", category: "..."}, worker_id: <id of worker selected>, all_joins: <every join table categorized by worker>}}
            let filteredOutCustomers = [...state.customers];
            for (const key of Object.keys(action.payload.search_qualities)){
                //The purpose of this for loop is to filter out only the ones that match the qualities. The reason we use let is we want it to be somthing that keeps filtering so that it meets all of the qualities
                //Now that we have this, we need to filter it further by checking all of the join tables, which we will do in the join table reducer, then just take the intersection of the two
                if (action.payload.search_qualities[key] !== ""){
                    filteredOutCustomers = filteredOutCustomers.filter(individualCustomer => individualCustomer[key] === action.payload.search_qualities[key])
                }
            }
            if (action.payload.worker_id){//We don't include an else because we already have what would happen saved to filteredOutCustomers if an else clause was used
                filteredOutCustomers = filteredOutCustomers.filter(individualCustomer => action.payload.all_joins[individualCustomer.id].includes(action.payload.worker_id)) //Here we do the final step where we filter it even further so that it only has the ones where the workers are in it
            }
            filteredOutCustomers.sort((a,b) => {//This makes it so that we have them sorted by how many workers are on that customer
                return action.payload.all_joins[a.id].length - action.payload.all_joins[b.id].length; 
            })
            if (filteredOutCustomers.length === 0){
                return{
                    ...state,
                    searched: true,
                    search_message: "No search results came up. Try again with different parameters."
                }
            }
            else{
                return{
                    ...state,
                    searched_customers: filteredOutCustomers,
                    searched: true,
                    search_message: null
                }
            }
            
        default:
            return{
                ...state
            }
    }
}