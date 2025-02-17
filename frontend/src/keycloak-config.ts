interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

const keycloakConfig: KeycloakConfig = {
  url: 'http://localhost:8180',
  realm: 'theplayerapp',
  clientId: 'frontend',
};

export default keycloakConfig;
