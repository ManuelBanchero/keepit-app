import './Login.css';

function Login(){
    return(
        <div className="login">
            <div className="login-container">
                <div className='login-container-data'>
                    <div className="keeipit-logo">KeepIt</div>
                    <div className="login-user">
                        <div className="login-input-placeholder">Usuario</div>
                        <input  type="text" className="login-input"></input>
                    </div>
                    <div className="login-password">
                        <div className="login-input-placeholder">Contraseña</div>
                        <input  type="password" className="login-input"></input>
                    </div>
                    <a href='/' className="login-button">Acceder</a>
                    <div className="login-signup">
                        <div className="login-signup-text">No tienes usuario?</div>
                        <a href="#" className="login-signup-link">Crear Usuario</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;