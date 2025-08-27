import './Landing.css';
import landing from './landing-img.png';
import { Link } from 'react-router-dom';

function Landing(){
    return(
        <div className="landing">
            <img className='landing-img' src={landing} alt="" />
            <div className='keepit-logo'>KeepIt</div>
            <div className='landing-cont'>
                <div className='landing-titulo'>Gestioná y controlá <br></br> tus <span className='violeta'>documentos</span> de forma simple y segura</div>
                <div className='landing-subtitulo'>Cargá, visualizá y recibí notificaciones de vencimientos de tus archivos y comprobantes en un solo lugar.</div>
                <Link to='/documents' className='landing-boton'>Comenzar <div className='circulo-boton'><span class="material-symbols-outlined">arrow_forward_ios</span></div></Link>
            </div>
        </div>
    );
}

export default Landing;