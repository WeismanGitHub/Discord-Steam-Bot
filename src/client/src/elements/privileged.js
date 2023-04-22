import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../elements/nav-bar';
import axios, * as others from 'axios'
import '../css/privileged.css';

export default function Privileged() {
	const [personType, setPersonType] = useState(localStorage.getItem('personType') || 'users')
	const userData = localStorage.getItem('userData')
	const [peoplePage, setPeoplePage] = useState(0)
	const [botData, setBotData] = useState(null)
	const [guilds, setGuilds] = useState([])
	const [people, setPeople] = useState([])
	const navigate = useNavigate();

	const [admins, setAdmins] = useState([])
	const [owners, setOwners] = useState([])
	
	useEffect(() => {
		if (!userData || userData.level == 'user') {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get(`/api/v1/${personType === 'users' ? 'admin' : 'owner'}/${personType}`),
			axios.get('/api/v1/admin/bot'),
			userData.level == 'owner' ? axios.get('/api/v1/owner/admins') : null,
			userData.level == 'owner' ? axios.get('/api/v1/owner/owners') : null,
		])
		.then(([guildsRes, usersRes, botRes, adminsRes, ownersRes]) => {
			setGuilds(guildsRes.data.guilds)
			setPeople(usersRes.data)
			setBotData(botRes.data)
			setAdmins(adminsRes?.admins)
			setOwners(ownersRes?.owners)
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
    }, [])

	function stopProcess() {
		axios.post('/api/v1/owner/process/kill')
		.then(res => successToast('Request was acknowledged.'))
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}

	function restartProcess() {
		axios.post('/api/v1/owner/process/restart')
		.then(res => successToast('Request was acknowledged.'))
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}

	function fetchPeople(page, type=personType) {
		if (page < 0) {
			return errorToast('Cannot go below 1.')
		}

		if (people.length < 10) {
			return errorToast('No more people left.')
		}

		axios.get(`/api/v1/${type === 'users' ? 'admin' : 'owner'}/${type}`)
		.then(res => {
			if (!res?.data) {
				return errorToast('Something went wrong getting more people.')
			}
			
			setPeoplePage(page)
			setPeople(res.data)
		})
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}

	function personTypeClick(type) {
		localStorage.setItem('personType', type)
		setPersonType(type)
		fetchPeople(0, type)
	}

	return <>
		<Navbar/>

		<div class='column' style={{ width: '25%' }}>
			Guilds: {guilds?.length}
			<hr class="divider"/>

			{guilds?.map(guild => {
				const name = `${guild.name?.substring(0, 32)}${guild.name?.length > 35 ? '...' : ''}`

				const joinedDate = new Date(Number(guild.joinedTimestamp))
				const formattedDate = joinedDate.toLocaleDateString("en-US", {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})

				return <div class='column-item' title={guild.name}>
					<img src={guild.iconURL} alt='guild icon' width={60} height={60} class='icon'/>
					<div class='name'>{name}</div>
					<br/>
					
					<div class='guild-info'>
						joined: {formattedDate}
						<br/>
						members: {guild.memberCount}
						<br/>
						locale: {guild.preferredLocale}
					</div>
				</div>
			})}
		</div>
		
		<div class='column' style={{ width: '20%' }}>
				{userData?.level == 'admin' ? 'Users' :
				<div>
					<button
						class={`people-type-button ${personType == 'users' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('users')}
					>Users</button>
					<button
						class={`people-type-button ${personType == 'admins' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('admins')}
					>Admins</button>
					<button
						class={`people-type-button ${personType == 'owners' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('owners')}
					>Owners</button>
				</div>}
			<div>
				<button class='pagination-button' onClick={() => fetchPeople(peoplePage - 1)}>{`<`}</button>
				{peoplePage + 1}
				<button class='pagination-button' onClick={() => fetchPeople(peoplePage + 1)}>{`>`}</button>
			</div>
			<hr class="divider"/>

			{people?.map(person => {
				return <div class='column-item' title={person.name}>
					<img src={person.avatarURL} alt='person avatar' width={53} height={53} class='icon'/>
					<div class='name'>{person.name}</div>
				</div>
			})}
		</div>

		{userData?.level == 'owner' &&
		<div class='process-buttons'>
			<button onClick={stopProcess}>Stop Process</button>
			<button onClick={restartProcess}>Restart Process</button>
		</div>}
	</>
}