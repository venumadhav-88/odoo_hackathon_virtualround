import React from 'react';
import { usePageTitle } from '@/hooks';
import { AuthLayout, LoginForm } from '@/components/auth';

/**
 * Login Page Component.
 * Entry viewpoint mounting the authentication layout and credentials input.
 * @returns {JSX.Element} Login Page.
 */
const Login = () => {
  usePageTitle('Sign In');

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
