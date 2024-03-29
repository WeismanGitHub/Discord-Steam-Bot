import { useNavigate } from 'react-router-dom';
import { errorToast } from '../toasts';
import { useState } from 'react'
import '../css/nav-bar.css';
import axios from 'axios';

export default function NavBar() {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [loggedIn, setLoggedIn] = useState(Boolean(userData))
    const navigate = useNavigate();
    const userIsPrivileged = ['owner', 'admin'].includes(userData?.role)

    function logout() {
        if (!window.confirm('Are you sure you want to logout?')) {
            return
        }

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
            {userIsPrivileged && <a class='navbar-button' href="/privileged">dashboard</a>}
            {userIsPrivileged && <a class='navbar-button' href='/tickets'>tickets</a>}
            <a class='navbar-button' href='/posts'>posts</a>
            {loggedIn && <a class='navbar-button' href="/account">account</a>}
            {loggedIn ? <div class='navbar-button' onClick={logout}>logout</div> : <>
                <a class='navbar-button' href="/auth/login">login</a>
                <a class='navbar-button' href="/auth/discord">register</a>
            </>}
        </div>
    </>)
}