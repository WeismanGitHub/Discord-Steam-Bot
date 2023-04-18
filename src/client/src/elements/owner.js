import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import { errorToast } from './toasts'

export default function Owner() {
	const [guilds, setGuilds] = useState([])
	const [admins, setAdmins] = useState([])
	const [owners, setOwners] = useState([])
	const [users, setUsers] = useState([])

    useEffect(() => {
		Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get('/api/v1/admin/users'),
			axios.get('/api/v1/owner/admins'),
			axios.get('/api/v1/owner/owners'),
		])
		.then(([guildsRes, usersRes, adminsRes, ownersRes]) => {
			console.log(guildsRes, usersRes)
			setGuilds(guildsRes)
			setUsers(usersRes)
			setAdmins(adminsRes)
			setOwners(ownersRes)
		})
		.catch(err => {
			errorToast(err.response.data.error || err.message)
		});
    }, [])

    console.log(guilds, users, admins, owners)
	return <>
		<h1>Guilds: {guilds.length} Users: {users.length}</h1>
		{ guilds.map(guild => {
			return <h3>{guild.name}</h3>
		})}
	</>
}