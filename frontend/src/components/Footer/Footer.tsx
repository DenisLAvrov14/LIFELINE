import { FaSignOutAlt } from 'react-icons/fa';
import { useKeycloak } from '@react-keycloak/web';

const Footer: React.FC = () => {
  const { keycloak } = useKeycloak();

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin + '/login' }); // Перенаправление на /login после выхода
  };

  return (
    <footer className="bg-gray-800 text-white py-4 flex justify-end px-4">
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-md flex items-center justify-center transition-transform transform hover:scale-105"
        aria-label="Logout"
      >
        <FaSignOutAlt size={20} />
      </button>
    </footer>
  );
};

export default Footer;
