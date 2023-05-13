import { errorToast, successToast } from '../../toasts'
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from '../nav-bar';

export default function Ticket() {
	const [ticket, setTicket] = useState(null)

    useEffect(async () => {
		const { data } = await axios.get(`/api/v1/tickets/${'64577108d0e3625b2749e657'}`)
		.catch(err => errorToast(err?.response?.data?.error || err.message));

        setTicket(data)
	}, [])

    return (<>
        <NavBar/>

        <h2>{ticket?.title || 'title'}</h2>
        <h6>status: {ticket?.status || 'unknown'}</h6>

        <h3>{ticket?.text || 'text'}</h3>

        <h3>{ticket?.response}</h3>
    </>)
}