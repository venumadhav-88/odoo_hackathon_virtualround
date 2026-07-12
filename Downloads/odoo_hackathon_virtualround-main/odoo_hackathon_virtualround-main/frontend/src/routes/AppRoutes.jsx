import React from 'react';
import { useRoutes } from 'react-router-dom';
import { routesConfig } from '@/routes/routesConfig';

export const AppRoutes = () => {
  return useRoutes(routesConfig);
};
