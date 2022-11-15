import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    calendar_info: [],
    connected_people: [],
    info_success: false
}

const calendarReducer = createReducer(initialState, (builder) => {
    builder
      .addCase("USER_CALENDAR_INFORMATION", (state, action) => {
        const new_calendar_info = action.payload.map(element => {
            return {title: element.subject, attendees: element.attendees, start: element.start.dateTime, end: element.end.dateTime, isAllDay: element.isAllDay, categories: element.categories, location: element.location, 
                recurrence: element.recurrence, id: element.id
        }})
        state.calendar_info = new_calendar_info;
        state.info_success = true;
      })
      .addCase("USER_PEOPLE_CONNECTIONS", (state, action) => {
        const new_connections = action.payload.map(person => {
            return {name: person.displayName, email: person.emailAddresses[0].address
        }})
        state.connected_people = new_connections;
      })
      .addCase("EVENT_CREATED", (state, action) => {
        state.calendar_info.push(action.payload);
      })
      .addDefaultCase((state, action) => {});
})

export default calendarReducer;

// export default function calendarReducer(state = initialState, action){
//     switch(action.type){
//         case 'USER_CALENDAR_INFORMATION':
//             return{
//                 ...state,
//                 calendar_info: action.payload.map(element => {
//                     return {title: element.subject, attendees: element.attendees, start: element.start.dateTime, end: element.end.dateTime, isAllDay: element.isAllDay, categories: element.categories, location: element.location, 
//                         recurrence: element.recurrence, id: element.id
//                 }}),
//                 info_success: true
//             }
//         case 'USER_PEOPLE_CONNECTIONS':
//             return{
//                 ...state,
//                 connected_people: action.payload.map(person => {
//                     return {name: person.displayName, email: person.emailAddresses[0].address
//                 }})
//             }
//         case 'EVENT_CREATED':
//             return{
//                 ...state,
//                 calendar_info: [...state.calendar_info, action.payload]
//             }
//         default:
//             return{
//                 ...state
//             }
//     }
// }

