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
			Guilds: {guilds?.length}

			<hr class="divider"/>

			{guilds?.map(guild => {
				const joinedDate = new Date(Number(guild.joinedTimestamp))
				const formattedDate = joinedDate.toLocaleDateString("en-US", {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})

				const name = `${guild.name?.substring(0, 32)}${guild.name?.length > 35 ? '...' : ''}`
				return <>
					<div class='guild' title={guild.name}>
						<img src={guild.iconURL} alt='guild icon' width={60} height={60} class='guild-icon'/>
						<div class='guild-name'>{name}</div>
						<br/>
						
						<div class='guild-info'>
							joined: {formattedDate}
							<br/>
							members: {guild.memberCount}
							<br/>
							locale: {guild.preferredLocale}
						</div>
					</div>
				</>
			})}
		</div>

		{userData?.level == 'owner' &&
		<div class='process-buttons'>
			<button onClick={stopProcess}>Stop Process</button>
			<button onClick={restartProcess}>Restart Process</button>
		</div>}
	</>
}