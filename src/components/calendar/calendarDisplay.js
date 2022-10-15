import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { getCalendarInformation } from '../../actions/calendar.js';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment-timezone';

import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig.js';

import "./calendar scsses/styles.scss"; //Just how to style it ya know?

const localizer = momentLocalizer(moment);

const OutlookCalendar = (props) => {
  const { instance, accounts } = useMsal();
    
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const calendar_info = useSelector((state) => state.calendar.calendar_info) // Here are all of the calendar events
  const [calendarClassName, setCalendarClassName] = useState("normal");
  const [eventChosenDiv, setEventChosenDiv] = useState(null);

  useEffect(() => {
    //Here's all of the stuff to actually get the calendar events and send it to the reducer. We do it here instead of App for some 
    //Reason (maybe so we don't have to load that data all of the time, but like we run the risk of it not having been changed yet)
    const accessTokenRequest = {
      ...loginRequest,
      account: accounts[0]
    }
    instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          // Call your API with token
          dispatch(getCalendarInformation(accessToken))
        })
  }, [instance, accounts, dispatch]);


  // const handleNewEventClick = (e) => {
  //   // This is the function that takes us to the page to create a new event that we will add to our calendar
  //   navigate("/event_create")
  // }

  const handleEventClicked = (e) => {
    //Here will be where we display the full information of the event displayed next to the actual thing we clicked on
    setCalendarClassName("event_picked");
    const chosenCalEvent = calendar_info.filter(element => element.id === e.id)[0];
  
    const optionsStart = { //This allows us to provide which information in our date we want to include for the start time
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'America/New_York'
  }

  const optionsEnd = { //This allows us to provide which information in our date we want to include for the end time
    hour: 'numeric',
    minute: 'numeric'
}
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const start = moment.tz(`${chosenCalEvent.start.split(".")[0]}Z`, "Etc/UTC"); //This is the UTC start time
    const start_shifted = start.clone().tz("America/New_York").toDate(); //This is the start time shifted to being in the Eastern time zone
    const end = moment.tz(`${chosenCalEvent.end.split(".")[0]}Z`, "Etc/UTC"); //This is the UTC end time
    const end_shifted = end.clone().tz("America/New_York").toDate(); //This is the end time shifted to being in the Eastern time zone

    setEventChosenDiv(
      <div id="chosen_event">
        <span id="x_button" onClick={e => handleXClicked(e)}>x</span>
        <br/>
        <h3>{chosenCalEvent.title}</h3>
        {/* This crazy thing below is how we get the date to look the way we want it. The first thing (with the weekDays) is how we get the name of the weekday. The second thing (with the options) is how we get the date itself
        Then the third thing with the ternary operator basically says that if the thing only lasts over one day, we only include the time, but if it's over multiple days, we include both the time and the weekday  */}
        <h3>
          {`When: ${weekDays[start_shifted.getDay()]}  ${start_shifted.toLocaleString('en-US', optionsStart)} - 
          ${start_shifted.getDay() === end_shifted.getDay() ? `${end_shifted.toLocaleString('en-US', optionsEnd)}` : `${weekDays[end_shifted.getDay()]} ${end_shifted.toLocaleString('en-US', optionsStart)}`}`}
        </h3>
        
        <h3>
          {chosenCalEvent.location.displayName === "" ? "" : `Where: ${chosenCalEvent.location.displayName}`}
        </h3>

        <div key="attendees_div">
          <h3>Attendees: </h3>
          {chosenCalEvent.attendees.map((element, index) => {
        return <h3 key={element.emailAddress.name}>{(index === chosenCalEvent.attendees.length - 1 ? `${element.emailAddress.name}` : `${element.emailAddress.name}, `)}</h3>})}</div>
      </div>
    )
  }

  const handleXClicked = (e) => {
    // Exits the event div on click of the x
    setCalendarClassName("normal")
    setEventChosenDiv(null)
  }

  return(
    calendar_info.length !== 0 ? 
    <div>
      {eventChosenDiv}
      <div id="calendar_component" className={calendarClassName}>
        <Calendar
          localizer={localizer}
          events={calendar_info.map(element => {
            return {title: element.title, allDay: element.isAllDay, start: moment(element.start).toDate(), end: moment(element.end).toDate(), id: element.id}
          })}
          onSelectEvent={e => handleEventClicked(e)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          popup
        />
      </div>
      {/* <button onClick={e => handleNewEventClick(e)}>Create New Event</button> */}
      
  </div>
  :
  <h1>Loading Calendar</h1>
  )
  

}


export default OutlookCalendar;
