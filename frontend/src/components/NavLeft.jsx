import React from 'react';

function NavLeft({
    busqueda,
    setBusqueda,
    filtroTipoDocumento,
    setFiltroTipoDocumento,
    filtroEstado,
    setFiltroEstado,
    tipoDocumento,
    estados
}) {
    return (
        <div className="document-explorer-filters">
            <div className='filtros-titulo'>Filtros</div>
            <div className="document-explorer-filters-content">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    className='input-fecha-carga'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="document-filter-tipo">
                    <div className='filtro-titulo'>Tipo de documento</div>
                    <select
                        name=""
                        id="select-tipo-documento"
                        className='select-tipo-documento'
                        value={filtroTipoDocumento}
                        onChange={(e) => setFiltroTipoDocumento(e.target.value)}
                    >
                        <option value="">Seleccione una opción</option>
                        {tipoDocumento.map((tipo, index) => (
                            <option key={index} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>

                <div className="document-filter-estado">
                    <div className='filtro-titulo'>Estado</div>
                    <select
                        name=""
                        id="select-estado"
                        className='select-estado'
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="">Seleccione una opción</option>
                        {estados.map((estado, index) => (
                            <option key={index} value={estado}>{estado}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}

export default NavLeft;