import { errorToast, successToast } from '../../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../nav-bar';
import axios, * as others from 'axios'

export default function Tickets() {
	const userData = JSON.parse(localStorage.getItem('userData'))
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

	function getTickets(page) {
		if (page < 0) {
			return
		}

		if (tickets.length < 10 && ticketPage <= page) {
			return errorToast('No more tickets left.')
		}

		axios.get(`/api/v1/tickets?page=${page}`)
		.then(({ data }) => {
			setTickets(data)
			setPage(page)
		})
		.catch(err => errorToast('Could not get tickets.'))
	}

	return <>
		<Navbar/>

		<div>
			<button class='generic-button' style={{ 'font-size': 'medium' }} onClick={() => getTickets(ticketPage - 1)}>{`<`}</button>
			{ticketPage + 1}
			<button class='generic-button' style={{ 'font-size': 'medium' }} onClick={() => getTickets(ticketPage + 1)}>{`>`}</button>
		</div>

		<div class=''>
			{tickets?.map(ticket => {
				return <div class='ticket' title='ticket'>
				</div>
			})}
		</div>
	</>
}