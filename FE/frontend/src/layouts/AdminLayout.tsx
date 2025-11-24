import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const menu = [
  { label: 'Products', path: '/products', icon: '📦' },
  { label: 'Categories', path: '/categories', icon: '🗂️' },
];

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">PM</div>
        <nav>
          {menu.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={
                'admin-menu-item' + (location.pathname.startsWith(item.path) ? ' active' : '')
              }
            >
              <span className="admin-menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
