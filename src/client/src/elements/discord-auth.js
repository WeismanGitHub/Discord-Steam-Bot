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
	const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
		const code = searchParams.get('code')
		const state = searchParams.get('state')
		setSearchParams({})

		if (!code || localStorage.getItem('oauth-state') !== state) {
			const randomString = generateRandomString();
			
			localStorage.setItem('oauth-state', randomString);
			return setSearchParams({ state: randomString })
		}

		axios.post('/api/v1/auth/discord', { code })
		.then(res => {
			setAuthorized(true)
			console.log(res)
		})
		.catch(console.error);
    }, [])
    
	if (authorized) {
		return <div>Authorized</div>
	} else {
		return <a href={process.env.REACT_APP_DISCORD_OAUTH_URL}>
			<button>Authorize</button>
    	</a>
	}
}