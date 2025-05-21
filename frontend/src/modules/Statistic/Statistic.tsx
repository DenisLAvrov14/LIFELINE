import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import TaskStatisticsBlock from '../../components/TaskStatisticsBlock/TaskStatisticsBlock';

const Statistics: React.FC = () => {
  const { keycloak } = useKeycloak();

  const firstName = keycloak.tokenParsed?.given_name || '';
  const lastName = keycloak.tokenParsed?.family_name || '';
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    keycloak.tokenParsed?.preferred_username ||
    'Anonymous';

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg">
      {/* Блок с аватаром */}
      {/* <div className="flex items-center justify-center my-6">
        <AvatarBlock imageUrl="/path-to-avatar.jpg" />
      </div> */}

      {/* Заголовок страницы */}
      <h1 className="text-4xl font-extrabold text-center mb-8">{fullName}</h1>

      {/* Блок статистики задач */}
      <div className="mt-8">
        <TaskStatisticsBlock />
      </div>
    </div>
  );
};

export default Statistics;
