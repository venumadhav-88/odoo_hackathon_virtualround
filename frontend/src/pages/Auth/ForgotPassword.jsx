import React from 'react';
import { usePageTitle } from '@/hooks';
import { AuthLayout, ForgotPasswordForm } from '@/components/auth';

/**
 * ForgotPassword Page Component.
 * Recovery viewpoint mounting the layout shell and email dispatch card.
 * @returns {JSX.Element} Forgot Password page.
 */
const ForgotPassword = () => {
  usePageTitle('Forgot Password');

  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;
