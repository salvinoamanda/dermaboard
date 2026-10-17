import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboards from '../pages/Dashboards';
import About from '../pages/About';
import Login from '../pages/Login';
import Register from '../pages/Register';
import User from '../pages/User';
import Queries from '../pages/Queries';
import Admin from '../pages/Admin';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboards" element={<Dashboards />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/user" element={<User />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/users" element={<Admin />} />
        </Routes>
    );
}