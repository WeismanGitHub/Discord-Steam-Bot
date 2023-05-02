import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import NavBar from './nav-bar';
import '../css/account.css';

export default function Account() {
    const userData = JSON.parse(localStorage.getItem('userData'))
	const navigate = useNavigate();

    useEffect(() => {
		if (!userData || userData.type == 'user') {
			errorToast('Please login first.')
			return navigate('/')
		}

		Promise.all([
		])
		.then(([]) => {
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
    }, [])
    
    return (<>
        <NavBar/>
    </>)
}