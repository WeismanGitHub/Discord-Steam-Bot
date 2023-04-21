import { useState } from 'react'

import NavBar from './elements/nav-bar';
import About from './elements/about';

export default function Home() {
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('userData')))
    const [loggedIn, setLoggedIn] = useState(Boolean(userData))
    
    return (<>
        <NavBar/>
        {loggedIn || <About/>}
    </>)
}