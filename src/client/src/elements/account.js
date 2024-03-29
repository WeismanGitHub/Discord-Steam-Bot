import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from './nav-bar';
import '../css/index.css';

export default function Account() {
    const userData = JSON.parse(localStorage.getItem('userData'))
	const [discordData, setDiscordData] = useState(null)
	const [steamData, setSteamData] = useState(null)
	const [role, setRole] = useState(null)
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!userData) {
			errorToast('Please login.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/users/self')
		])
		.then(([selfRes]) => {
			setDiscordData(selfRes?.data.discord)
			setSteamData(selfRes?.data.steam)
			setRole(selfRes?.data.role)
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
	}, [])

	function formatTimestamp(timestamp) {
		const date = new Date(Number(timestamp))

		return date.toLocaleDateString("en-US", {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	}

	function deleteAccount() {
		if (!window.confirm('Are you sure you want to delete your account?')) {
            return
        }

		axios.delete('/api/v1/users/self')
		.then((res) => {
			localStorage.removeItem('userData')
			navigate('/')
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
	}
	
	return (<>
		<NavBar/>

		<div class='account-area'>
			Discord
			<div class='user-guild' title={discordData?.name}>
				<img src={discordData?.avatarURL} alt='discord avatar' width={53} height={53} class='icon'/>
				<div class='name'>{discordData?.name}</div>

				<div class='user-guild-info' style={{ 'padding-top': '5px' }}>
					discriminator: {discordData?.discriminator}
					<br/>
					joined: {formatTimestamp(discordData?.createdTimestamp)}
					<br/>
					id: {discordData?.ID}
				</div>
			</div>

			<hr class='divider' style={{ backGroundColor: '#41454b' }}/>

			Steam
			<div class='user-guild' title={steamData?.name}>
				<img src={steamData?.avatarURL} alt='discord avatar' width={53} height={53} class='icon'/>
				<div class='name'>{steamData?.name}</div>

				<div class='user-guild-info' style={{ 'padding-top': '5px' }}>
					level: {steamData?.level}
					<br/>
					joined: {formatTimestamp(steamData?.createdTimestamp)}
					<br/>
					id: {steamData?.ID}
				</div>
			</div>

			<hr class='divider' style={{ backGroundColor: '#41454b' }}/>

			role: {role}

			<hr class='divider' style={{ backGroundColor: '#41454b' }}/>

			<button onClick={() => deleteAccount()} class='generic-button'>Delete Data</button>
			<div style={{ fontSize: 'small' }}>
				*The Discord IDs of banned users will be stored.
			</div>
		</div>
	</>)
}