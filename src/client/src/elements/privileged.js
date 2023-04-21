import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../elements/nav-bar';
import axios, * as others from 'axios'
import { errorToast, successToast } from '../toasts'
import '../css/Privileged.css';

export default function Privileged() {
	const userData = localStorage.getItem('userData')
	const [botData, setBotData] = useState(null)
	const [guilds, setGuilds] = useState([])
	const [users, setUsers] = useState([])
	const navigate = useNavigate();

	const [admins, setAdmins] = useState([])
	const [owners, setOwners] = useState([])

	function stopProcess() {
		axios.post('/api/v1/owner/process/kill')
		.then(res => successToast('Request was acknowledged.'))
		.catch(err => {
			errorToast(err.response.data.error || err.message)
		});
	}

	function restartProcess() {
		axios.post('/api/v1/owner/process/restart')
		.then(res => successToast('Request was acknowledged.'))
		.catch(err => errorToast(err.response.data.error || err.message));
	}

    useEffect(() => {
		if (!userData || userData.level == 'user') {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get('/api/v1/admin/users'),
			axios.get('/api/v1/admin/bot'),
			userData.level == 'owner' ? axios.get('/api/v1/owner/admins') : null,
			userData.level == 'owner' ? axios.get('/api/v1/owner/owners') : null,
		])
		.then(([guildsRes, usersRes, botRes, adminsRes, ownersRes]) => {
			setGuilds(guildsRes.data.guilds)
			setUsers(usersRes.data.users)
			setBotData(botRes.data)
			setAdmins(adminsRes.admins)
			setOwners(ownersRes.owners)
		})
		.catch(err => {
			errorToast(err.response.data.error || err.message)
		});
    }, [])
    
	return <>
		<Navbar/>

		<div class='guilds'>
			<h3>Guilds: {guilds?.length}</h3>

			<hr class="divider"/>

			{guilds?.map(guild => {
				return <div class='guild'>
					{guild.name}
				</div>
			})}

		</div>

		{userData.level == 'owner' &&
		<div class='process-buttons'>
			<button onClick={stopProcess}>Stop Process</button>
			<button onClick={restartProcess}>Restart Process</button>
		</div>}
		
	</>
}