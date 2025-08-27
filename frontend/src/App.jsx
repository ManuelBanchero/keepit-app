import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import NavBar from './components/NavBar';
import DocumentExplorer from './pages/document-explorer/Document-explorer';
import DocumentViewer from './pages/document-viewer/DocumentViewer';
import Landing from './pages/landing/Landing';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing />}/>
      </Routes>
      <Routes>
        <Route path="/home" element={<Home/>} />
        <Route path="/documents" element={<DocumentExplorer/>}></Route>
        <Route path="/documents/:id" element={<DocumentViewer/>} />
        <Route path="/profile" element={<></>}></Route>
      </Routes>
    </div>
  );
}

export default App;
