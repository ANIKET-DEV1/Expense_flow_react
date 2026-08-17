import { Outlet, Link } from 'react-router-dom';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import './style/global.css';

export default function MainLayout() {
  return (
    <div className="layout-container">
      <header className="navbar">
        <Navbar/>
      </header>

      <div className="body-container">
        <Sidebar/>

        <main className="content-area">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}