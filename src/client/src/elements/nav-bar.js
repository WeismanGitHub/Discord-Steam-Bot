import { errorToast } from '../toasts';
import { useState } from 'react'
import '../css/nav-bar.css';
import axios from 'axios';

export default function NavBar() {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [loggedIn, setLoggedIn] = useState(Boolean(userData))

    function logout() {
        axios.post('/api/v1/auth/logout')
        .then(res => {
            setLoggedIn(false)
            localStorage.removeItem('userData')
            setUserData({})
        })
        .catch(err => errorToast('Could not log out.'))
    }

    return (<>
        <div class='navbar'>
            {['owner', 'admin'].includes(userData?.level) && <a class='navbar-button' href="/privileged">dashboard</a>}
            {loggedIn && <a class='navbar-button' href="/about">about</a>}
            {loggedIn ? <button class='navbar-button' onClick={logout}>logout</button> : <>
                <a class='navbar-button' href="/auth/login">login</a>
                <a class='navbar-button' href="/auth/discord">register</a>
            </>}
        </div>
    </>)
}