import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import { errorToast } from '../toasts'
import NavBar from './nav-bar';

function generateRandomString() {
	let randomString = '';
	const randomNumber = Math.floor(Math.random() * 10);

	for (let i = 0; i < 20 + randomNumber; i++) {
		randomString += String.fromCharCode(33 + Math.floor(Math.random() * 94));
	}

	return randomString;
}

export default function Login() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [randomString] = useState(generateRandomString())
	const navigate = useNavigate();

    useEffect(() => {
		const state = searchParams.get('state')
		const code = searchParams.get('code')
		setSearchParams({})

		if (!code || localStorage.getItem('login-state') !== atob(decodeURIComponent(state))) {
			return localStorage.setItem('login-state', randomString);
		}

		axios.post('/api/v1/auth/login', { code })
		.then(res => {
			localStorage.setItem('userData', JSON.stringify(res.data))
			navigate('/')
		})
		.catch((err) => {
			errorToast(err.response.data.error || err.message)
		});
    }, [])
    
	return <>
		<NavBar/>
		<a href={process.env.REACT_APP_LOGIN_OAUTH_URL + `&state=${btoa(randomString)}`} class='large-button'>
			Login
		</a>
	</>
}