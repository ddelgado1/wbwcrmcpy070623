import { createReducer } from "@reduxjs/toolkit"; 

const initialState = {
    workers: [],
    workers_succeeded: false, //The purpose of this is that when we start the webpage, if we have no workers at all, we run the risk of having it load forever. Instead, we'll change this and load based on if this is true or not instead of if there are workers or not
    select_tag_worker_list: [],
    current_worker: {},
    admins: []
}

const workerReducer = createReducer(initialState, (builder) => {
    builder
      .addCase("GET_ALL_WORKERS", (state, action) => {
        state.workers = action.payload;
        state.select_tag_worker_list = action.payload.map(worker_object => ({label: worker_object.name, value: worker_object.id}));
        state.workers_succeeded = true;
      })
      .addCase("CREATE_NEW_WORKER", (state, action) => {
        state.workers.push(action.payload[0]);
        state.select_tag_worker_list.push({label: action.payload[0].name, value: action.payload[0].id});
      })
      .addCase("SET_CURRENT_WORKER", (state, action) => {
        state.current_worker = action.payload;
      })
      .addCase("WORKER_DESTROYED", (state, action) => {
        state.workers = state.workers.filter(worker => worker.id !== action.payload);
        state.select_tag_worker_list = state.select_tag_worker_list.filter(worker => worker.value !== action.payload);
      })
      .addCase("GROUP_WORKER_LIST", (state, action) => {
        state.admins = action.payload
      })
      .addDefaultCase((state,action) => {})
})

export default workerReducer;

// export default function workerReducer(state = initialState, action){
//     switch(action.type){
//         case 'GET_ALL_WORKERS':
//             return{
//                 ...state,
//                 workers: action.payload,
//                 select_tag_worker_list: action.payload.map(worker_object => ({label: worker_object.name, value: worker_object.id})),
//                 workers_succeeded: true
//             }
//         case 'CREATE_NEW_WORKER':
//             return{
//                 ...state,
//                 workers: [...state.workers, action.payload[0]],
//                 select_tag_worker_list: [...state.select_tag_worker_list, {label: action.payload[0].name, value: action.payload[0].id}] 
//             }
//         case 'SET_CURRENT_WORKER':
//             return{
//                 ...state,
//                 current_worker: action.payload
//             }
//         default:
//             return{
//                 ...state
//             }
//     }
// }
 
