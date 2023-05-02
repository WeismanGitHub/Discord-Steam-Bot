import { errorToast, successToast } from '../toasts'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios, * as others from 'axios'
import NavBar from './nav-bar';
import '../css/account.css';

export default function Account() {
    const userData = JSON.parse(localStorage.getItem('userData'))
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
			console.log(selfRes?.data)
		})
		.catch(err => {
			errorToast(err?.response?.data?.error || err.message)
		});
    }, [])
    
    return (<>
        <NavBar/>
    </>)
}