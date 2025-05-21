import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from 'keycloak-js';
import keycloakConfig from './keycloak-config';
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider';
import { setKeycloakInstance } from './services/todos.service';
import { PostHogProvider } from 'posthog-js/react';

// Создаём инстанс Keycloak
const keycloak = new Keycloak(keycloakConfig);

// Передаём Keycloak в сервисы
setKeycloakInstance(keycloak);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ReactKeycloakProvider authClient={keycloak}>
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PostHogProvider
            apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
            options={{
              api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
              debug: import.meta.env.MODE === 'development',
            }}
          >
            <App />
          </PostHogProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  </ReactKeycloakProvider>
);
