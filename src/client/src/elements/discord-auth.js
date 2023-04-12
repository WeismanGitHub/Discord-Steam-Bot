import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'

function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export default function DiscordAuth() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [randomString] = generateRandomString()
	const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
		const state = searchParams.get('state')
		const code = searchParams.get('code')
		setSearchParams({})

		if (!code || localStorage.getItem('oauth-state') !== atob(decodeURIComponent(state))) {
			return localStorage.setItem('oauth-state', randomString);
		}

		axios.post('/api/v1/auth/discord', { code })
		.then(res => {
			setAuthorized(true)
		})
		.catch(console.error);
    }, [])
    
	if (authorized) {
		return <h2>Authorized</h2>
	} else {
		return <a href={process.env.REACT_APP_DISCORD_OAUTH_URL + `&state=${btoa(randomString)}`} class='authorize-button'>
			Authorize
    	</a>
	}
}