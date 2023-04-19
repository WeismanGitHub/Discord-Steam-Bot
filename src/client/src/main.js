import { useState } from 'react'

export default function Home() {
    const userData = localStorage.getItem('userData')
    const loggedIn = Boolean(userData)
    const level = userData?.level

    console.log(loggedIn)
    return (<>
        { loggedIn ? 'logged in!' : 'not logged in' }
    </>)
}