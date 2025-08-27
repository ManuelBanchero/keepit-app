import './Home.css';

function Home(){

    const accesos = [
        {descripcion: "Documentos", href: "/documents", icono: "library_books"},
        {descripcion: "Perfil", href: "/" , icono: "person"},
    ]
    const proximosVencimientos = [
        {nombre: "Seguro La Caja", fecha_vencimiento: "01/07/2025"},
        {nombre: "Licencia de conducir 1B", fecha_vencimiento: "03/07/2025"},
        {nombre: "Certificado IGA", fecha_vencimiento: "19/10/2025"},
    ]

    return(
        <div className="home">
            <div className='hero-img'>
                <div className='hero-placeholder-text'>Organiza tus seguros y documentos en un solo lugar</div>
                <a href='/documents' className='hero-placeholder-button'>Comenzar</a>
            </div>
            <div className='main-container'>
                <div className='listado-accesos'>
                    <div className='listado-accesos-placeholder'>
                        <div className='titulo-forma'></div>
                        <div className='listado-accesos-texto'>Mis Accesos</div>
                    </div>
                    <div className='listado-accesos-container'>
                        {
                        accesos.map(acceso => (
                                <a className='acceso' href={acceso.href}>
                                    <div className='acceso-icono'><span class="material-symbols-outlined">{acceso.icono}</span></div>
                                    <div className='acceso-descripcion'>{acceso.descripcion}</div>
                                </a>
                        ))
                        }
                    </div>
                </div>
                <div className='proximos-vencimientos'>
                    <div className='proximos-vencimientos-placeholder'>
                        <div className='titulo-forma'></div>
                        <div className='proximos-vecimientos-texto'>Proximos Vencimientos</div>
                    </div>
                    <div className='proximos-vencimientos-container'>
                        {
                            proximosVencimientos.map(documento => (
                                <div className='documento-vencer'>
                                    <div className='documento-vencer-forma'></div>
                                    <div className='documento-vencer-nombre'>{documento.nombre}</div>
                                    <div className='documento-vencer-fecha'>{documento.fecha_vencimiento}</div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;