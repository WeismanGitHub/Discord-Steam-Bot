import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../elements/nav-bar';
import axios, * as others from 'axios'
import '../css/privileged.css';

export default function Privileged() {
	const [personType, setPersonType] = useState(localStorage.getItem('personType') || 'users')
	const userData = JSON.parse(localStorage.getItem('userData'))
	const [inputtedUserID, setInputtedUserID] = useState('')
	const [searchedUser, setSearchedUser] = useState(null)
	const [peoplePage, setPeoplePage] = useState(0)
	const [activity, setActivity] = useState({})
	const [guilds, setGuilds] = useState([])
	const [people, setPeople] = useState([])
	const [bot, setBot] = useState(null)
	const navigate = useNavigate();

	useEffect(() => {
		if (!userData || userData.type == 'user') {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get(`/api/v1/${personType === 'users' ? 'admin' : 'owner'}/${personType}`),
			axios.get('/api/v1/admin/bot'),
		])
		.then(([guildsRes, usersRes, botRes]) => {
			setGuilds(guildsRes.data)
			setPeople(usersRes.data)
			setBot(botRes.data)
			setActivity(botRes.data.activity)
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

	function fetchPeople(page) {
		if (page < 0) {
			return errorToast('Cannot go below 1.')
		}

		if (people.length < 10) {
			return errorToast('No more people left.')
		}

		axios.get(`/api/v1/${personType === 'users' ? 'admin' : 'owner'}/${personType}`)
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
		
		axios.get(`/api/v1/${type === 'users' ? 'admin' : 'owner'}/${type}`)
		.then(res => {
			if (!res?.data) {
				return errorToast('Something went wrong getting more people.')
			}
			
			setPeoplePage(0)
			setPeople(res.data)
		})
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}

	function formatTimestamp(timestamp) {
		const date = new Date(Number(timestamp))

		return date.toLocaleDateString("en-US", {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	function updateActivity() {
		if (activity.name <= 0) {
			return errorToast('Activity name must be greater than 0.')
		}
		
		const ActivityTypes = {
			'Playing': 0,
			'Streaming': 1,
			'Listening': 2,
			'Watching': 3,
			'Competing': 5,
		}

		axios.post('/api/v1/owner/activity', {
			name: activity.name,
			type: ActivityTypes[activity.type]
		})
		.then(res => successToast(`Set activity to: ${activity.type} ${activity.name}`))
		.catch(err => errorToast(err?.response?.data?.error || err.message));
	}

	async function searchUser() {
		try {
			const user = (await axios.get('/api/v1/admin/users/' + inputtedUserID))?.data
			setSearchedUser(user)
		} catch(err) {
			errorToast(err?.response?.data?.error || err.message)
		}
	}

	function promote() {

	}
	
	function demote() {

	}

	function ban() {
		
	}

	return <>
		<Navbar/>

		{ /* Guilds */ }
		<div class='column' style={{ width: '20%' }}>
			Guilds: {guilds?.length}
			<hr class="divider"/>

			{guilds?.map(guild => {
				const name = `${guild.name?.substring(0, 32)}${guild.name?.length > 35 ? '...' : ''}`
				const formattedDate = formatTimestamp(guild.joinedTimestamp)

				return <div class='column-item' title={guild.name}>
					<img src={guild.iconURL} alt='guild icon' width={60} height={60} class='icon'/>
					<div class='name'>{name}</div>
					
					<div class='item-info'>
						joined: {formattedDate}
						<br/>
						members: {guild.memberCount}
						<br/>
						locale: {guild.preferredLocale}
					</div>
				</div>
			})}
		</div>

		{ /* Users */ }
		<div class='column' style={{ width: '20%' }}>
				{userData?.type == 'admin' ? 'Users' :
				<div>
					<button
						class={`generic-button ${personType == 'users' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('users')}
					>Users</button>
					<button
						class={`generic-button ${personType == 'admins' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('admins')}
					>Admins</button>
					<button
						class={`generic-button ${personType == 'owners' ? 'highlighted' : 'unhighlighted'}`}
						onClick={() => personTypeClick('owners')}
					>Owners</button>
				</div>}
			<div>
				<button class='generic-button' style={{ 'font-size': 'medium' }} onClick={() => fetchPeople(peoplePage - 1)}>{`<`}</button>
				{peoplePage + 1}
				<button class='generic-button' style={{ 'font-size': 'medium' }} onClick={() => fetchPeople(peoplePage + 1)}>{`>`}</button>
			</div>
			<hr class="divider"/>

			{people?.map(person => {
				return <div class='column-item' title={person.name}>
					<img src={person.avatarURL} alt='person avatar' width={53} height={53} class='icon'/>
					<div class='name'>{person.name}</div>
				</div>
			})}
		</div>

		{ /* Bot */ }
		<div class='column' style={{ width: '20%' }}>
			Bot:
			<hr class="divider"/>
			
			<div class='column-item' title={bot?.name}>
				<img src={bot?.avatarURL} alt='bot avatar' width={53} height={53} class='icon'/>
				<div class='name'>{bot?.name}</div>
				<br/>

				<div class='item-info'>
					created: {formatTimestamp(bot?.createdTimestamp)}
					<br/>
					online: {formatTimestamp(bot?.readyTimestamp)}
					<br/>
					activity: {`${activity?.type} ${activity?.name}`}
				</div>
			</div>

			<hr class="divider"/>

			{userData?.type == 'owner' &&
				<div>
					<button onClick={stopProcess} class='generic-button'>Stop Process</button>

					<hr class="divider"/>

					<div>
						<button onClick={() => setActivity({ type: 'Playing', name: activity?.name})} class={`generic-button ${activity.type == 'Playing' ? 'highlighted' : 'unhighlighted'}`}>Playing</button>

						<button onClick={() => setActivity({ type: 'Streaming', name: activity?.name})} class={`generic-button ${activity.type == 'Streaming' ? 'highlighted' : 'unhighlighted'}`}>Streaming</button>

						<button onClick={() => setActivity({ type: 'Listening', name: activity?.name})} class={`generic-button ${activity.type == 'Listening' ? 'highlighted' : 'unhighlighted'}`}>Listening</button>

						<button onClick={() => setActivity({ type: 'Watching', name: activity?.name})} class={`generic-button ${activity.type == 'Watching' ? 'highlighted' : 'unhighlighted'}`}>Watching</button>

						<button onClick={() => setActivity({ type: 'Competing', name: activity?.name})} class={`generic-button ${activity.type == 'Competing' ? 'highlighted' : 'unhighlighted'}`}>Competing</button>

						<input
							type='text'
							class='activity-input'
							value={activity.name}
							onChange={ (e)=> {
								if (e.target.value.length > 50) {
									return errorToast('Must be less than 100.')
								}

								setActivity({ type: activity.type, name: e.target.value })
							} }
							onKeyPress={ (e) => e.key === 'Enter' && updateActivity()}
						/>
						<br/>
						<button class='generic-button' onClick={updateActivity}>Update</button>
					</div>

					<hr class="divider"/>
				</div>
			}
		</div>

		{ /* User */ }
		{userData?.type == 'owner' &&
			<div class='column' style={{ width: '20%' }}>
				<div>
					<input
						type='text'
						class='user-input'
						value={inputtedUserID}
						placeholder='enter a user ID'
						onChange={(e)=> {
							if (e.target.value.length > 25) {
								return
							}

							setInputtedUserID(e.target.value)
						}}
						onKeyPress={ (e) => e.key === 'Enter' && searchUser()}
					/>
					<br/>

					<button class='generic-button' onClick={searchUser}>Search</button>
					
					<hr class="divider"/>

					{searchedUser && <>
						<div class='column-item' title={searchedUser?.name}>
							<img src={searchedUser?.avatarURL} alt='user avatar' width={53} height={53} class='icon'/>
							<div class='name'>{searchedUser?.name}</div>

							<div class='item-info' style={{ 'padding-top': '5px' }}>
								discriminator: {`#${searchedUser?.discriminator}`}
								<br/>
								joined: {formatTimestamp(searchedUser?.createdTimestamp)}
								<br/>
								id: {searchedUser?.ID}
							</div>
						</div>
						
						<br/>

						<div>
							{userData?.type === 'owner' && <>
								<button onClick={() => promote()} class='generic-button'>Promote</button>
								<button onClick={() => demote()} class='generic-button'>Demote</button>
							</>}
							<button style={{width: '50px' }} onClick={() => ban() } class='generic-button'>Ban</button>
						</div>
						<hr class="divider"/>
					</>}

				</div>
			</div>
		}
	</>
}