import { useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak.authenticated) {
      console.log('🆔 User ID:', keycloak.tokenParsed?.sub);
      navigate('/todo'); // Перенаправление на /todo после успешного входа
    }
  }, [keycloak.authenticated, navigate]);

  const handleLogin = () => {
    keycloak.login().then(() => {
      console.log('Access Token:', keycloak.token);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 leading-snug">
        Know <span className="text-green-500">everything</span> about your time
      </h1>

      <button
        onClick={handleLogin}
        className="px-5 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Sign in
      </button>
    </div>
  );
};

export default Login;
