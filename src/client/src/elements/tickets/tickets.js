import { errorToast, successToast } from '../../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../nav-bar';
import axios, * as others from 'axios'

export default function Tickets() {
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [status, setStatus] = useState(null)
	const [tickets, setTickets] = useState([])
	const [ticketPage, setPage] = useState(0)
	const navigate = useNavigate();

	useEffect(async () => {
		if (!userData || !['admin', 'owner'].includes(userData.role)) {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		const { data } = await axios.get('/api/v1/tickets').catch(err => errorToast('Could not get tickets.'))
        setTickets(data)
    }, [])

	function getTickets(page, status) {
		if (page < 0) {
			return
		}

		if (tickets.length < 10 && ticketPage <= page) {
			return errorToast('No more tickets left.')
		}

		axios.get(`/api/v1/tickets?page=${page}${status ? `&status=${status}` : ''}`)
		.then(({ data }) => {
			setTickets(data)
			setPage(page)
		})
		.catch(err => errorToast('Could not get tickets.'))
	}

	function cycleStatus() {
		const statuses = [null, 'open', 'closed']
		const index = statuses.indexOf(status) + 1

		setStatus(index >= statuses.length ? statuses[0] : statuses[index])
		getTickets(0, index >= statuses.length ? statuses[0] : statuses[index])
	}

	return <>
		<Navbar/>

		<div style={{ 'font-size': 'medium' }}>
			<button class='generic-button' onClick={() => getTickets(ticketPage - 1, status)}>{`<`}</button>
			{ticketPage + 1}
			<button class='generic-button' onClick={() => getTickets(ticketPage + 1, status)}>{`>`}</button>
			<br/>
			<button class='generic-button' onClick={cycleStatus}>{`Status: ${status ?? 'any'}`}</button>
		</div>

		<div class=''>
			{tickets?.map(ticket => {
				return <div class='ticket' title='ticket'>
					<a href={`/tickets/${ticket._id}`}>{ticket.title}</a>
				</div>
			})}
		</div>
	</>
}