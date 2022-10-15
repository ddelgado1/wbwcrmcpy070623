import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import DatePicker from "react-datepicker";
import Switch from "react-switch";
import { getUserConnections } from '../../actions/calendar';

import '../components.scss';
import "./calendar scsses/styles.scss"; //Just how to style it ya know?

import { useMsal } from "@azure/msal-react";
import { loginRequest } from '../../authConfig.js';

//Date Picker styles
import "react-datepicker/dist/react-datepicker.css";

const CreateEvent = () => {
    const { instance, accounts } = useMsal();


    const [eventData, setEventData] = useState(
        {
            subject: '',
            body: {
              contentType: 'HTML',
              content: ''
            },
            start: {
                dateTime: new Date(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
                dateTime: new Date(),
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            location: {
                displayName: ''
            },
            isAllDay: false,
            reminderMinutesBeforeStart: null,
            isReminderOn: false,
            attendees: []
          });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const calendar_connections = useSelector((state) => state.calendar.connected_people); //These are your contacts on outlook with their names and emails
    const calendar_info = useSelector((state) => state.calendar.calendar_info); //This is so we can proc the useEffect where we navigate
    const errors = useSelector((state) => state.errors.error);

    const hasRenderedRef = useRef(false); //This determines if it's been rendered yet so we don't risk navigating on render

    useEffect(() => {
        //Here's all of the stuff to actually get the connections
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
              dispatch(getUserConnections(accessToken))
            })
      }, [instance, accounts, dispatch]);

    useEffect(() => {
        //Navigates to the index page on the change of searched_customers
        if (hasRenderedRef.current === true && Object.keys(errors).length === 0){
            navigate("/calendar");
        };
        
    }, [errors, calendar_info, navigate]);
   

    // useEffect(() => {
    //     if (typeof eventData.start.dateTime === "string" && typeof eventData.end.dateTime === "string")
    // })

    const handleInputAndSelectChange = (e) => {
        //Handle change for all input and select elements
        const newKey = e.target.id;
        const newValue = e.target.value;
        if (newKey === "reminderMinutesBeforeStart" && newValue === "Default"){
            setEventData(oldState => ({...oldState, isReminderOn: false}));
        }
        else{
            if (newKey === "reminderMinutesBeforeStart"){
                setEventData(oldState => ({...oldState, isReminderOn: true}));
            }
            setEventData(oldState => ({ ...oldState, [newKey]: newValue}));
        }
    }

    const handleSwitchChange = (e) => {
        // Handles the change of the allday switch
        setEventData(oldState => ({...oldState, isAllDay: !oldState.isAllDay}))
    }

    const handleDateTimeChange = (date, startOrEnd) => {
        //Handles the change of dateTimeElements
        setEventData(oldState => ({...oldState, [startOrEnd]: {...oldState[startOrEnd], dateTime: date}}));
    }

    const handleTextAreaChange = (e) => {
        //Handles the change of the textArea
        setEventData(oldState => ({...oldState, body: {...oldState.body, content: e.target.value}}));
    }

    const handleSubmit = (e) => {
        //Handles submitting the form
        e.preventDefault();
        hasRenderedRef.current = true;
        //All this crazy stuff below is how we format the dateTime object we have to match what microsoft graph wants of us
        setEventData(oldState => ({...oldState, 
            start: {...oldState.start, dateTime: {dateTime: `${eventData.start.dateTime.getFullYear()}-${eventData.start.dateTime.getMonth() < 10 ? `0${eventData.start.dateTime.getMonth()}` : eventData.start.dateTime.getMonth()}-${eventData.start.dateTime.getDate()}T${eventData.start.dateTime.getHours()}:${eventData.start.dateTime.getMinutes() < 10 ? `0${eventData.start.dateTime.getMinutes()}` : eventData.start.dateTime.getMinutes()}:${eventData.start.dateTime.getSeconds() < 10 ? `0${eventData.start.dateTime.getSeconds()}` : eventData.start.dateTime.getSeconds()}`}},
            end: {...oldState.end, dateTime: {dateTime: `${eventData.end.dateTime.getFullYear()}-${eventData.end.dateTime.getMonth() < 10 ? `0${eventData.end.dateTime.getMonth()}` : eventData.end.dateTime.getMonth()}-${eventData.end.dateTime.getDate()}T${eventData.end.dateTime.getHours()}:${eventData.end.dateTime.getMinutes() < 10 ? `0${eventData.end.dateTime.getMinutes()}` : eventData.end.dateTime.getMinutes()}:${eventData.end.dateTime.getSeconds() < 10 ? `0${eventData.end.dateTime.getSeconds()}` : eventData.end.dateTime.getSeconds()}`}}}))
        console.log(eventData)
    }

    /* This stuff below is all for the autocompletion search */


    const handleOnSelect = (item) => {
        // the item selected, meaning contact is added to attendees
        if (eventData.attendees.filter(contact => contact.emailAddress.name === item.name && contact.emailAddress.email === item.email).length === 0){
            setEventData(oldState => ({ ...oldState, "attendees": [...oldState.attendees, {emailAddress: {address: item.email, name: item.name}}]}));
        }

    }
    const handleXClicked = (e, contact) => {
        // Removes the contact from the attendees list
        setEventData(oldState => ({ ...oldState, "attendees": oldState.attendees.filter(attendee => attendee !== contact)}));
      }

    const formatResult = (item) => {
        return (
            <>
                <span style={{ display: 'block', textAlign: 'left' }}>name: {item.name}</span>
                <span style={{ display: 'block', textAlign: 'left' }}>email: {item.email}</span>
            </>
        )
    }
    /* --------------------------------------------------------------- */

    return(
        <>
            <h1 id="center">Create a New Calendar Event</h1>
            <form id="event_creation_form" onSubmit={handleSubmit}>
                <label>
                    Add a title:
                    <input type="text" defaultValue={eventData.subject} id="subject" onChange={e => handleInputAndSelectChange(e)}></input>
                </label>
                <label>
                    Invite Attendees: 
                    <div className="react_auto_search">
                        {eventData.attendees.map(attendee => {return(
                            <div key={attendee.emailAddress.address} className="contact_card">
                                
                                <p className='contact_email'>{attendee.emailAddress.address}</p>
                                <button className="contact_x" onClick={(e) => handleXClicked(e, attendee)}>x</button>
                            </div>
                        )})}
                        <header className="search_header">
                            <div style={{ width: 400 }}>
                            <ReactSearchAutocomplete
                                items={calendar_connections}
                                onSelect={handleOnSelect}
                                autoFocus
                                formatResult={formatResult}
                            />
                            </div>
                        </header>
                    </div>
                </label>

                <label>
                    What times?: 
                    <div id="start_and_all_day">
                        <div id="start">{eventData.isAllDay ? <DatePicker selected={eventData.start.dateTime} onChange={(date) => handleDateTimeChange(date, "start")} /> : <DatePicker selected={eventData.start.dateTime} onChange={(date) => handleDateTimeChange(date, "start")} showTimeSelect dateFormat="Pp" />}</div>
                        <div id="all_day"><Switch onChange={e => handleSwitchChange(e)} checked={eventData.isAllDay} /></div>
                    </div>
                    <div id="end">
                        {eventData.isAllDay ? null : <DatePicker selected={eventData.end.dateTime} onChange={(date) => handleDateTimeChange(date, "end")} showTimeSelect dateFormat="Pp" />}
                    </div>
                </label>
                <label>
                    Location:
                    <input type="text" defaultValue={eventData.location.displayName} id="location" onChange={e => handleInputAndSelectChange(e)}></input>
                </label>
                <label>
                    Remind me: 
                    <select id="reminderMinutesBeforeStart" onChange={e => handleInputAndSelectChange(e)} defaultValue={'Default'}>
                        <option value="Default"> Don't remind me </option>
                        <option value="0">At time of event</option>
                        <option value="15">15 minutes before</option>
                        <option value="30">30 minutes before</option>
                        <option value="60">1 hour before</option>
                        <option value="120">2 hours before</option>
                        <option value="720">12 hours before</option>
                        <option value="1440">1 day before</option>
                        <option value="1440">1 day before</option>
                        <option value="10080">1 week before</option>
                    </select>
                </label>

                <label>
                    Description:
                </label>
                <textarea  defaultValue={eventData.body.content} id="body" onChange={e => handleTextAreaChange(e)}></textarea><br/>
                

            <button type="submit" onClick={e => handleSubmit(e)} className="submit_new_button">Submit</button>
            </form>
        </>
    )
}

export default CreateEvent;




 
