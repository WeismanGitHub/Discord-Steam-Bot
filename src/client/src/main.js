import './css/main.css';

import NavBar from './elements/nav-bar';
import About from './elements/about';

export default function Home() {
    return (<>
        <NavBar/>
        {loggedIn || <About/>}
    </>)
}