'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBook, FaRegBookmark, FaPencilAlt, FaCog, FaQuestionCircle, FaSignOutAlt, FaSearch } from 'react-icons/fa';
import './Sidebar.css';
import { useUser } from '@/src/UserContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
    const { user, openModal, logout } = useUser();
    const pathname = usePathname();
    
    const handleAuthAction = () => {
        if (user) {
            logout();
        } else {
            openModal();
        }
        closeSidebar();
    };

    const handleLinkClick = () => {
        closeSidebar();
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
            <Link href="/" className="sidebar__logo-link" onClick={handleLinkClick}>
                <figure className="sidebar__logo">
                    <img src="/logo.jpeg" alt="Logo" />
                </figure>
            </Link>
            
            <div className="sidebar__links">
                <Link href="/for-you" className={`sidebar__link ${pathname.includes('/for-you') ? 'sidebar__link--active' : ''}`}>
                    <FaHome /> <span>For You</span>
                </Link>
                <Link href="/library" className={`sidebar__link ${pathname.includes('/library') ? 'sidebar__link--active' : ''}`}>
                    <FaRegBookmark /> <span>My Library</span>
                </Link>
                <div className="sidebar__link sidebar__link--disabled">
                    <FaPencilAlt /> <span>Highlights</span>
                </div>
                <div className="sidebar__link sidebar__link--disabled">
                    <FaSearch /> <span>Search</span>
                </div>
            </div>

            <div className="sidebar__footer">
                <Link href="/settings" className={`sidebar__link ${pathname.includes('/settings') ? 'sidebar__link--active' : ''}`} onClick={handleLinkClick}>
                    <FaCog /> <span>Settings</span>
                </Link>
                <div className="sidebar__link sidebar__link--disabled">
                    <FaQuestionCircle /> <span>Help & Support</span>
                </div>
                <div className="sidebar__link" onClick={handleAuthAction}>
                    <FaSignOutAlt /> <span>{user ? 'Logout' : 'Login'}</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
