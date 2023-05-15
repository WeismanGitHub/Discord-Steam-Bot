import { errorToast, successToast } from '../../toasts'
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from '../nav-bar';
import { useParams } from 'react-router-dom';

export default function Ticket() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [response, setResponse] = useState('')
	const [ticket, setTicket] = useState(null)
    const { ticketID } = useParams()

    useEffect(async () => {
		const { data } = await axios.get(`/api/v1/tickets/${ticketID}`)
		.catch(err => errorToast(err?.response?.data?.error || err.message));

        setTicket(data)
	}, [])

    function resolveTicket() {

    }

    return (<>
        <NavBar/>

        <h2>{ticket?.title || 'title'}</h2>
        <h6>status: {ticket?.status || 'unknown'}</h6>

        <h3>{ticket?.text || 'text'}</h3>

        <h3>{ticket?.response}</h3>
        
        {(ticket?.status === 'open' && ['admin', 'owner'].includes(userData?.role)) && 
            <input
                type='text'
                class=''
                value={response}
                onChange={(e)=> {
                    if (e.target.value.length > 4096) {
                        return errorToast('Must be less than 4096.')
                    }

                    setResponse(e.target.value)
                }}
                onKeyPress={ (e) => e.key === 'Enter' && resolveTicket()}
            />
        }
    </>)
}