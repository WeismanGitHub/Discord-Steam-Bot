import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../elements/nav-bar';
import axios, * as others from 'axios'

export default function Privileged() {
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [tickets, setTickets] = useState([])
	const navigate = useNavigate();

	useEffect(async () => {
		if (!userData || userData.role == 'user') {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		const { data } = axios.get('/api/v1/tickets').catch(err => errorToast('Could not get guilds.'))

        setTickets(data)
    }, [])

	return <>
		<Navbar/>

		<div class=''>
			{tickets?.map(ticket => {
                console.log(ticket)
				return <div class='' title='ticket'>
				</div>
			})}
		</div>
	</>
}