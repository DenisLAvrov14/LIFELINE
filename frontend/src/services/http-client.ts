import axios from 'axios';
import Keycloak from 'keycloak-js';
import keycloakConfig from '../keycloak-config';

// Создаем экземпляр Keycloak
const keycloak = new Keycloak(keycloakConfig);

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен в каждый запрос через интерсепторы
httpClient.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      const token = await keycloak.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;
