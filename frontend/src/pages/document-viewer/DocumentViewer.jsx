import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DocumentViewer.css'

const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYWJhbmNoZXJvQGdtYWlsLmNvbSIsImlhdCI6MTc1MTY0MjQ5NywiZXhwIjoxNzUxNzI4ODk3fQ.rYTh4axx_2-y286Sh1vdOm1f5c1QSBJvmKeORtXvG3s'

function DocumentViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [documento, setDocumento] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    console.log(showDeleteConfirm)

    // Fetch document details
    useEffect(() => {
        const fetchDocumento = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/archivos/${id}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Error al cargar el documento');
                }
                
                const data = await response.json();
                setDocumento(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDocumento();
        }
    }, [id]);

    // Fetch document preview
    useEffect(() => {
        const fetchPreview = async () => {
            if (!documento) return;
            
            try {
                setPreviewLoading(true);
                const response = await fetch(`http://localhost:8080/api/archivos/${id}/download`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setPreviewUrl(url);
                }
            } catch (err) {
                console.error('Error loading preview:', err);
            } finally {
                setPreviewLoading(false);
            }
        };

        fetchPreview();

        // Cleanup URL object
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [documento, id]);

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/archivos/${id}/download`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = documento.nombre || 'archivo';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error('Error downloading file:', err);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleteLoading(true);
            const response = await fetch(`http://localhost:8080/api/archivos/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('No se pudo eliminar el archivo');
            }

            // Ocultar modal de confirmación y mostrar mensaje de éxito
            setShowDeleteConfirm(false);
            setShowDeleteSuccess(true);
        } catch (error) {
            console.error('Se produjo un error tratando de eliminar el archivo:', error);
            setError('Error al eliminar el documento');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteConfirm(false);
    };

    const handleGoToDocuments = () => {
        navigate('/documents');
    };

    const getFileIcon = (tipoArchivo) => {
        switch (tipoArchivo?.toLowerCase()) {
            case 'documento':
                return 'description';
            case 'factura':
                return 'receipt_long';
            case 'comprobante':
                return 'receipt';
            default:
                return 'insert_drive_file';
        }
    };

    const getFileType = (nombre) => {
        if (!nombre) return 'unknown';
        const extension = nombre.split('.').pop()?.toLowerCase();
        return extension || 'unknown';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No especificada';
        try {
            return new Date(dateString).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    const formatMonto = (monto) => {
        if (!monto && monto !== 0) return 'No especificado';
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(monto);
    };

    const isImageFile = (nombre) => {
        if (!nombre) return false;
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const extension = nombre.split('.').pop()?.toLowerCase();
        return imageExtensions.includes(extension);
    };

    const isPdfFile = (nombre) => {
        if (!nombre) return false;
        const extension = nombre.split('.').pop()?.toLowerCase();
        return extension === 'pdf';
    };

    if (loading) {
        return (
            <div className="document-viewer">
                <div className="document-viewer-loading">
                    <div className="loading-spinner"></div>
                    <p>Cargando documento...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="document-viewer">
                <div className="document-viewer-error">
                    <span className="material-symbols-outlined">error</span>
                    <h2>Error al cargar el documento</h2>
                    <p>{error}</p>
                    <button className="btn-back" onClick={() => navigate('/documents')}>
                        Volver a documentos
                    </button>
                </div>
            </div>
        );
    }

    if (!documento) {
        return (
            <div className="document-viewer">
                <div className="document-viewer-error">
                    <span className="material-symbols-outlined">description_off</span>
                    <h2>Documento no encontrado</h2>
                    <button className="btn-back" onClick={() => navigate('/documents')}>
                        Volver a documentos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="document-viewer">
            {/* Header */}
            <div className="document-viewer-header">
                <button className="btn-back-header" onClick={() => navigate('/documents')}>
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="document-header-info">
                    <div className="document-icon">
                        <span className="material-symbols-outlined">
                            {getFileIcon(documento.tipoArchivo)}
                        </span>
                    </div>
                    <div className="document-title-section">
                        <h1 className="document-title">{documento.nombre}</h1>
                        <span className="document-file-type">{getFileType(documento.nombre).toUpperCase()}</span>
                    </div>
                </div>
                <button className="btn-download" onClick={handleDownload}>
                    <span className="material-symbols-outlined">download</span>
                    Descargar
                </button>
            </div>

            <div className="document-viewer-content">
                {/* Preview Section */}
                <div className="document-preview-section">
                    <div className="preview-header">
                        <h2>Vista Previa</h2>
                    </div>
                    <div className="document-preview">
                        {previewLoading ? (
                            <div className="preview-loading">
                                <div className="loading-spinner small"></div>
                                <p>Cargando vista previa...</p>
                            </div>
                        ) : previewUrl ? (
                            <div className="preview-container">
                                {isImageFile(documento.nombre) ? (
                                    <img 
                                        src={previewUrl} 
                                        alt={documento.nombre}
                                        className="preview-image"
                                    />
                                ) : isPdfFile(documento.nombre) ? (
                                    <iframe
                                        src={previewUrl}
                                        className="preview-pdf"
                                        title={documento.nombre}
                                    />
                                ) : (
                                    <div className="preview-placeholder">
                                        <span className="material-symbols-outlined">
                                            {getFileIcon(documento.tipoArchivo)}
                                        </span>
                                        <p>Vista previa no disponible</p>
                                        <button className="btn-open-file" onClick={handleDownload}>
                                            Descargar para ver
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="preview-placeholder">
                                <span className="material-symbols-outlined">visibility_off</span>
                                <p>No se pudo cargar la vista previa</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="document-details-section">
                    <div className="details-header">
                        <h2>Información del Documento</h2>
                    </div>
                    
                    <div className="document-details">
                        <div className="detail-group">
                            <div className="detail-item">
                                <label>Nombre del Archivo</label>
                                <span className="detail-value">{documento.nombre}</span>
                            </div>
                            
                            <div className="detail-item">
                                <label>Tipo de Documento</label>
                                <span className="detail-value type-badge">
                                    <span className="material-symbols-outlined">
                                        {getFileIcon(documento.tipoArchivo)}
                                    </span>
                                    {documento.tipoArchivo}
                                </span>
                            </div>
                            
                            <div className="detail-item">
                                <label>Nombre del Titular</label>
                                <span className="detail-value">{documento.nombreTitular || 'No especificado'}</span>
                            </div>
                            
                            <div className="detail-item">
                                <label>Emisor</label>
                                <span className="detail-value">{documento.emisor || 'No especificado'}</span>
                            </div>
                        </div>

                        {/* Highlighted Important Info */}
                        <div className="detail-group important-info">
                            <h3>Información Importante</h3>
                            
                            <div className="detail-item-highlight monto">
                                <div className="highlight-icon">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <div className="highlight-content">
                                    <label>Monto</label>
                                    <span className="detail-value-highlight">
                                        {formatMonto(documento.monto)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="detail-item-highlight vencimiento">
                                <div className="highlight-icon">
                                    <span className="material-symbols-outlined">schedule</span>
                                </div>
                                <div className="highlight-content">
                                    <label>Fecha de Vencimiento</label>
                                    <span className="detail-value-highlight">
                                        {formatDate(documento.fechaVencimiento)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Additional Actions */}
                        <div className="document-actions">
                            <button className="btn-action primary" onClick={handleDownload}>
                                <span className="material-symbols-outlined">download</span>
                                Descargar Archivo
                            </button>
                            <button className="btn-action secondary" onClick={() => navigate('/documents')}>
                                <span className="material-symbols-outlined">list</span>
                                Volver a la Lista
                            </button>
                        </div>

                        <button 
                            className='btn-action delete'
                            onClick={handleDeleteClick}
                        >Eliminar de tus documentos</button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            {showDeleteConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <span className="material-symbols-outlined warning-icon">warning</span>
                            <h3>¿Estás seguro?</h3>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que quieres eliminar el documento <strong>"{documento.nombre}"</strong>?</p>
                            <p>Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="btn-modal cancel" 
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-modal delete" 
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="loading-spinner small"></div>
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">delete</span>
                                        Sí, eliminar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de éxito de eliminación */}
            {showDeleteSuccess && (
                <div className="modal-overlay">
                    <div className="modal-content success">
                        <div className="modal-header">
                            <span className="material-symbols-outlined success-icon">check_circle</span>
                            <h3>Documento eliminado</h3>
                        </div>
                        <div className="modal-body">
                            <p>El documento <strong>"{documento.nombre}"</strong> se ha eliminado correctamente.</p>
                        </div>
                        <div className="modal-actions">
                            <button 
                                className="btn-modal primary" 
                                onClick={handleGoToDocuments}
                            >
                                <span className="material-symbols-outlined">list</span>
                                Ir a Documentos
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentViewer;