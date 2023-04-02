import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'

export default function DiscordAuth() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
		const code = searchParams.get('code')
		const state = searchParams.get('state')
		setSearchParams({})

		if (!code) {
			return
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