const initialState = {
    error: {}
}

export default function errorReducer(state = initialState, action){
    switch(action.type){
        case 'ERROR_CAUGHT':
            return{
                ...state,
                error: action.payload
            }
        case 'DELETE_ERROR':
            return{
                ...state,
                error: {}
            }
        default:
            return{
                ...state
            }
    }
}