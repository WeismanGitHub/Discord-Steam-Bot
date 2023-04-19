import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import { errorToast } from './toasts'

export default function Privileged() {
	const userData = localStorage.getItem('userData')
	const [guilds, setGuilds] = useState([])
	const [users, setUsers] = useState([])
	const navigate = useNavigate();

    useEffect(() => {
		if (!userData || userData.level == 'user') {
			errorToast('You must be an admin or owner.')
			return navigate('/')
		}

		Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get('/api/v1/admin/users')
		])
		.then(([guildsRes, usersRes]) => {
			console.log(guildsRes, usersRes)
			setGuilds(guildsRes)
			setUsers(usersRes)
		})
		.catch(err => {
			errorToast(err.response.data.error || err.message)
		});
    }, [])
    
	return <>
		<h1>Guilds: {guilds.length} Users: {users.length}</h1>
		{ guilds.map(guild => {
			return <h3>{guild.name}</h3>
		})}
	</>
}