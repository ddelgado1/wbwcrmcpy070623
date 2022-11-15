import { createReducer } from "@reduxjs/toolkit";   

const initialState = {
    error: {}
}

const errorReducer = createReducer(initialState, (builder) => {
    builder
      .addCase("ERROR_CAUGHT", (state, action) => {
        state.error = action.payload;
      })
      .addCase("DELETE_ERROR", (state, action) => {
        state.error = {};
      })
      .addDefaultCase((state,action) => {})
})

export default errorReducer;



// export default function errorReducer(state = initialState, action){
//   switch(action.type){
//       case 'ERROR_CAUGHT':
//           return{
//               ...state,
//               error: action.payload
//           }
//       case 'DELETE_ERROR':
//           return{
//               ...state,
//               error: {}
//           }
//       default:
//           return{
//               ...state
//           }
//   }
// }