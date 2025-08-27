import './Document-explorer.css';
import React, { useState, useEffect } from 'react';
import NavLeft from '../../components/NavLeft';
import NavBar from '../../components/NavBar';
import DocumentList from '../../components/DocumentList';
import DocumentForm from '../../components/DocumentForm';

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWJhbmNoZXJvQGdtYWlsLmNvbSIsImlhdCI6MTc1MTY0MjQ5NywiZXhwIjoxNzUxNzI4ODk3fQ.rYTh4axx_2-y286Sh1vdOm1f5c1QSBJvmKeORtXvG3s'

function DocumentExplorer() {
    const [filtroTipoDocumento, setFiltroTipoDocumento] = useState('');
    const [filtroFechaCarga, setFiltroFechaCarga] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [documentos, setDocumentos] = useState([]);
    const [directorios, setDirectorios] = useState([]);
    const [directorioActualId, setDirectorioActualId] = useState(null); // null = raíz
    const [documentUploaded, setDocumentUploaded] = useState(false);

    console.log(documentos)

    useEffect(() => {
        async function getArchivos() {
            const response = await fetch('http://localhost:8080/api/archivos', {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ file: errorData.message || 'Error al intentar cargar los archivos'});
            } else {
                const data = await response.json();
                setDocumentos(data);
            }
        }

        async function getDirectorios() {
            const response = await fetch('http://localhost:8080/api/directorios', {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrors({ directories: errorData.message || 'Error al intentar cargar los directorios'});
            } else {
                const data = await response.json();
                setDirectorios(data);
            }
        }

        getArchivos();
        getDirectorios();
    }, [documentUploaded]);

    const tipoDocumento = [
        "Comprobante",
        "Documento",
        "Factura"
    ];

    const estados = [
        "PENDIENTE",
        "PAGO",
        "VENCIDO",
        "CANCELADO"
    ];

    // Filtrar directorios del directorio actual
    const directoriosActuales = directorios.filter(dir => dir.id_directorio_padre === directorioActualId);

    // Filtrar documentos del directorio actual
    const documentosDelDirectorio = documentos.filter(doc => {
        return doc.directorioId == directorioActualId
    });

    // Aplicar filtros adicionales a los documentos
    const documentosFiltrados = documentosDelDirectorio.filter(doc => {
        const coincideTipo = filtroTipoDocumento === '' || doc.tipoArchivo.toUpperCase() === filtroTipoDocumento.toUpperCase();
        const coincideFecha = filtroFechaCarga === '' || doc.fechaSubida === filtroFechaCarga;
        const coincideEstado = filtroEstado === '' || doc.estado === filtroEstado;
        const coincideBusqueda = busqueda === '' || doc.nombre.toLowerCase().includes(busqueda.toLowerCase());

        return coincideTipo && coincideFecha && coincideEstado && coincideBusqueda;
    });

    // Generar breadcrumbs
    const generarBreadcrumbs = () => {
        const breadcrumbs = [];
        let currentId = directorioActualId;
        
        while (currentId !== null) {
            const directorio = directorios.find(dir => dir.id_directorio === currentId);
            if (directorio) {
                breadcrumbs.unshift(directorio);
                currentId = directorio.id_directorio_padre;
            } else {
                break;
            }
        }
        
        return breadcrumbs;
    };

    const handleShowForm = () => {
        setShowForm(true);
    };

    const handleHideForm = () => {
        setShowForm(false);
    };

    const handleNavegacionDirectorio = (directorioId) => {
        setDirectorioActualId(directorioId);
    };

    const handleVolverRaiz = () => {
        setDirectorioActualId(null);
    };

    return (
        <>
            <NavBar />
            <div className="document-explorer">
                <NavLeft
                    busqueda={busqueda}
                    setBusqueda={setBusqueda}
                    filtroTipoDocumento={filtroTipoDocumento}
                    setFiltroTipoDocumento={setFiltroTipoDocumento}
                    filtroEstado={filtroEstado}
                    setFiltroEstado={setFiltroEstado}
                    tipoDocumento={tipoDocumento}
                    estados={estados}
                />

                <DocumentList
                    documentosFiltrados={documentosFiltrados}
                    directoriosActuales={directoriosActuales}
                    breadcrumbs={generarBreadcrumbs()}
                    directorioActualId={directorioActualId}
                    onShowForm={handleShowForm}
                    onNavegacionDirectorio={handleNavegacionDirectorio}
                    onVolverRaiz={handleVolverRaiz}
                />

                <DocumentForm
                    isVisible={showForm}
                    onHide={handleHideForm}
                    setDocumentUploaded={setDocumentUploaded}
                />
            </div>
        </>
    );
}

export default DocumentExplorer;