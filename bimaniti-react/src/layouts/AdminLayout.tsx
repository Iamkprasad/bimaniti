import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Newspaper, Mail, Settings, Sparkles, LogOut } from 'lucide-react';
import './AdminLayout.css';

export const AdminLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate('/admin/login');
    } catch {
      navigate('/admin/login');
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>BimaNiti Admin</h2>
        <nav>
          <NavLink to="/admin/blogs" end>
            <FileText size={18} /> Blogs
          </NavLink>
          <NavLink to="/admin/news" end>
            <Newspaper size={18} /> News
          </NavLink>
          <NavLink to="/admin/contacts" end>
            <Mail size={18} /> Contacts
          </NavLink>
          <NavLink to="/admin/generate" end>
            <Sparkles size={18} /> Generate
          </NavLink>
          <NavLink to="/admin/settings" end>
            <Settings size={18} /> Settings
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-user">{user?.email ?? 'User'}</span>
          <button className="sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};
