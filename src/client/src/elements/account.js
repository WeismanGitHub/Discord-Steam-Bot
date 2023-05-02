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

	console.log(type, steamData, discordData)
    return (<>
        <NavBar/>
		{/* <div class='column' style={{ width: '20%' }}>

		</div>
		<div class='column-item' title={person.name}>
			<img src={person.avatarURL} alt='person avatar' width={53} height={53} class='icon'/>
			<div class='name'>{person.name}</div>
		</div> */}
    </>)
}