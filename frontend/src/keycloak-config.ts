interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8080',
  realm: 'theplayerapp',
  clientId: 'frontend-client',
};

export default keycloakConfig;
