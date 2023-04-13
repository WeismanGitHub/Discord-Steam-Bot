import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import { errorToast } from './toasts'

export default function Admin() {
	const [authorized, setAuthorized] = useState(false)

    useEffect(async () => {
		const [guilds, users] = await Promise.all([
			axios.get('/api/v1/admin/guilds'),
			axios.get('/api/v1/admin/users')
		])
		.then(res => {
			setAuthorized(true)
		})
		.catch(err => {
			setAuthorized(false)
			errorToast(err.response.data.error || err.message)
		});

		console.log(guilds, users)
    }, [])
    
	if (!authorized) {
		return <h2>You're not allowed here!</h2>
	} else {
		return <h2>Authorized</h2>
	}
}