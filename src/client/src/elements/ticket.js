import { errorToast, successToast } from '../toasts'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from './nav-bar';
import '../../css/tickets.css';

export default function Ticket() {
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [response, setResponse] = useState('')
	const [posts, setPosts] = useState([])
    const { ticketID } = useParams()

    useEffect(async () => {
		axios.get(`/api/v1/posts`)
        .then(res => setPosts(res.data))
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}, [])

    function resolveTicket() {
        axios.post(`/api/v1/tickets/${ticketID}`, { response })
		.then(res => {
            successToast('Responded and closed ticket!')
            setTicket({ ...ticket, response, status: 'closed' })
        })
		.catch(err => errorToast(err?.response?.data?.error || err.message))
    }

    return (<>
        <NavBar/>

        <div class='ticket-area'>
            <div class='ticket-title'> {ticket?.title}</div>
            <br/>
            <div class='ticket-status'>status: {ticket?.status || 'unknown'}</div>
            <br/>

            <div class='ticket-section'>{ticket?.text}</div>

            { ticket?.response && <div class='ticket-section'>{ticket?.response}</div>}
            
            {(ticket?.status === 'open' && ['admin', 'owner'].includes(userData?.role)) && 
                <>
                    <textarea
                        style={{ width: '50%', height: '50%' }}
                        class='ticket-response-input'
                        value={response}
                        onChange={(e)=> {
                            if (e.target.value.length > 4096) {
                                return errorToast('Must be less than 4096.')
                            }

                            setResponse(e.target.value)
                        }}
                    />
                    <br/>
                    <button class='generic-button' onClick={resolveTicket}>Respond</button>
                </>
            }
        </div>
    </>)
}