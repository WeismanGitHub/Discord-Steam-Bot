
export default function DiscordAuth() {
  return (
    <div>
        <title>Discord auth</title>
        <meta name="og:title" content="Discord auth"/>
        <meta name="theme-color" content="#39e66a" />
            <h2>Discord auth</h2>
            <h3>Lol my discord auth thing idk</h3>
            <div style={{ marginTop: '8px'}}>
            <button
                href={`http://localhost:3001/auth/discord/login`}
                type="primary"
                block
                size="large"
                style={{
                    marginTop: '10px',
                    backgroundColor: '#7289DA',
                    border: 'none',
                }}
            >

            Login with Discord 
            </button>
        </div>
    </div>
  );
}