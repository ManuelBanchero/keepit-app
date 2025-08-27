import './NavBar.css';

function NavBar(){

    const accesos = [
        {descripcion: "Documentos", href: "/documents"},
        {descripcion: "Perfil", href: "/"},
    ]

    return(
        <div className='nav-bar'>
                <a href='/' className='nav-keepit-logo'>KeepIt</a>
                <div className='nav-buttons'>
                    {
                    accesos.map(acceso => (
                        <a href={acceso.href} className='nav-link-button'>{acceso.descripcion}</a>
                    ))
                    }
                    <div className='user-img'></div>
                </div>
        </div>
    );
}

export default NavBar;