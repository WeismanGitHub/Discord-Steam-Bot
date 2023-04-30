import { useNavigate } from 'react-router-dom';
import { errorToast } from '../toasts';
import { useState } from 'react'
import '../css/nav-bar.css';
import axios from 'axios';

export default function NavBar() {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [loggedIn, setLoggedIn] = useState(Boolean(userData))
    const navigate = useNavigate();

    function logout() {
        axios.post('/api/v1/auth/logout')
        .then(res => {
            setLoggedIn(false)
            localStorage.removeItem('userData')
            setUserData({})
            navigate('/')
        })
        .catch(err => errorToast('Could not log out.'))
    }

    return (<>
        <div class='navbar'>
            <a class='navbar-button' href="/">home</a>
            {['owner', 'admin'].includes(userData?.type) && <a class='navbar-button' href="/privileged">dashboard</a>}
            <a class='navbar-button' href="/account">account</a>
            {loggedIn ? <div class='navbar-button' onClick={logout}>logout</div> : <>
                {window.location.pathname !== '/auth/login' && <a class='navbar-button' href="/auth/login">login</a>}
                {window.location.pathname !== '/auth/discord' && <a class='navbar-button' href="/auth/discord">register</a>}
            </>}
        </div>
    </>)
}