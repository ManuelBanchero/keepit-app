import { Link } from "react-router-dom";
import NavBar from "./NavBar";

function DocumentList({ 
    documentosFiltrados, 
    directoriosActuales, 
    breadcrumbs, 
    directorioActualId,
    onShowForm, 
    onNavegacionDirectorio,
    onVolverRaiz 
}) {

    const handleDirectorioClick = (directorioId) => {
        onNavegacionDirectorio(directorioId);
    };

    const handleBreadcrumbClick = (directorioId) => {
        onNavegacionDirectorio(directorioId);
    };

    return (
        <div className="document-explorer-content">
            <div className='document-explorer-menu-bar'>
                <div className="document-explorer-content-titulo">
                    <div className="document-explorer-content-barra"></div>
                    <div className="document-explorer-titulo">Mis Documentos</div>
                </div>
                <a
                    className='boton-agregar'
                    href='#'
                    onClick={(e) => {
                        e.preventDefault();
                        onShowForm();
                    }}
                >
                    <span className="material-symbols-outlined">add</span>
                </a>
            </div>

            {/* Breadcrumbs */}
            <div className="breadcrumbs">
                <button 
                    className="breadcrumb-item root"
                    onClick={onVolverRaiz}
                >
                    <span className="material-symbols-outlined">home</span>
                    Raíz
                </button>
                {breadcrumbs.map((directorio, index) => (
                    <div key={directorio.id_directorio} className="breadcrumb-separator">
                        <span className="material-symbols-outlined">chevron_right</span>
                        <button 
                            className="breadcrumb-item"
                            onClick={() => handleBreadcrumbClick(directorio.id_directorio)}
                        >
                            {directorio.nombre}
                        </button>
                    </div>
                ))}
            </div>

            <div className="document-explorer-columns">
                <div className='columna'>Nombre</div>
                <div className='columna'>Tipo</div>
                <div className='columna'>Fecha de Carga</div>
                <div className='columna'>Fecha de Vencimiento</div>
                <div className='columna'>Monto</div>
                <div className='columna'>Estado</div>
            </div>

            <div className="document-explorer-list">
                {/* Mostrar directorios primero */}
                {directoriosActuales.map((directorio, index) => (
                    <div 
                        key={`dir-${directorio.id}`} 
                        className="document directorio"
                        onClick={() => handleDirectorioClick(directorio.id_directorio)}
                    >
                        <div className='document-barra directorio-barra'></div>
                        <div className='columna directorio-nombre'>
                            <span className="material-symbols-outlined directorio-icon">folder</span>
                            {directorio.nombre}
                        </div>
                        <div className='columna'>Carpeta</div>
                        <div className='columna'>{directorio.fechaCreacion || '---'}</div>
                        <div className='columna'>---</div>
                        <div className='columna'>---</div>
                        <div className='columna'>---</div>
                    </div>
                ))}

                {/* Mostrar archivos después */}
                {documentosFiltrados.map((documento, index) => (
                    <Link key={`doc-${documento.id}`} to={`./${documento.id}`}>
                        <div className="document archivo">
                            <div className='document-barra'></div>
                            <div className='columna archivo-nombre'>
                                <span className="material-symbols-outlined archivo-icon">description</span>
                                {documento.nombre}
                            </div>
                            <div className='columna'>{documento.tipoArchivo}</div>
                            <div className='columna'>{documento.fechaCreacion}</div>
                            <div className='columna'>{documento.fechaVencimiento || 'Sin vencimiento'}</div>
                            <div className='columna'>{documento.monto && `$${documento.monto}` || 'Sin monto'}</div>
                            <div className='columna'>{documento.estado || 'Pendiente'}</div>
                        </div>
                    </Link>
                ))}

                {/* Mensaje cuando no hay contenido */}
                {directoriosActuales.length === 0 && documentosFiltrados.length === 0 && (
                    <div className="empty-directory">
                        <span className="material-symbols-outlined">folder_open</span>
                        <p>Esta carpeta está vacía</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentList;