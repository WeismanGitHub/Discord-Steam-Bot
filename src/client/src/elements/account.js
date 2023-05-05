import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from './nav-bar';
import '../css/account.css';

export default function Account() {
    const userData = JSON.parse(localStorage.getItem('userData'))
	const [discordData, setDiscordData] = useState(null)
	const [steamData, setSteamData] = useState(null)
	const [type, setType] = useState(null)
	const navigate = useNavigate();
	
	useEffect(() => {
		if (!userData) {
			errorToast('Please login.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/user/self')
		])
		.then(([selfRes]) => {
			setDiscordData(selfRes?.data.discord)
			setSteamData(selfRes?.data.steam)
			setType(selfRes?.data.type)
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
	}, [])

	function deleteAccount() {

	}
	
	return (<>
		<NavBar/>

		<div class='account-area'>
			Discord
			<div class='user-guild' title={discordData?.name}>
				<img src={discordData?.avatarURL} alt='discord avatar' width={53} height={53} class='icon'/>
				<div class='name'>{discordData?.name}</div>

				<div class='user-guild-info' style={{ 'padding-top': '5px' }}>
					discriminator: sdfsfsfaf
					<br/>
					joined: asdfasfasfsa
					<br/>
					id: sdfsfa
				</div>
			</div>

			<hr class='divider' style={{ backGroundColor: '#41454b' }}/>

			Steam
			<div class='user-guild' title={steamData?.name}>
				<img src={steamData?.avatarURL} alt='discord avatar' width={53} height={53} class='icon'/>
				<div class='name'>{steamData?.name}</div>

				<div class='user-guild-info' style={{ 'padding-top': '5px' }}>
					discriminator: dsfsfgsd
					<br/>
					joined: sfafdasfd
					<br/>
					id: adsfsafsasadf
				</div>
			</div>

			<hr class='divider' style={{ backGroundColor: '#41454b' }}/>

			<button onClick={() => deleteAccount()} class='generic-button'>Delete Data</button>
			<div style={{ fontSize: 'small' }}>
				*The Discord IDs of banned users will be stored.
			</div>
		</div>
	</>)
}