export default function About() {
    return (<>
        <h1>Discord Steam App</h1>
        <div style={{ width: '50%', margin: 'auto' }}>
            Use slash commands to conveniently view other users' public Steam information. Allow access to view your connected Steam account through <a href='/auth/discord'>this link</a> so others can use commands on you. Use `/unauthorize` to delete all data stored by the bot or visit <a href='/account'>the account page</a>.
        </div>

        <h4><a href={process.env.REACT_APP_BOT_INVITE_LINK}>Bot Invite</a></h4>
        <h4><a href={process.env.REACT_APP_SOURCE_CODE_LINK}>Source Code</a></h4>
        <h4><a href={process.env.REACT_APP_BUY_ME_A_COFFEE_LINK}>Buy Me a Coffee</a></h4>
    </>)
}