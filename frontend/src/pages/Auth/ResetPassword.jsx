import React from 'react';
import { usePageTitle } from '@/hooks';
import { AuthLayout, ResetPasswordForm } from '@/components/auth';

/**
 * ResetPassword Page Component.
 * Reset viewpoint mounting the split screen layout and password matches card.
 * @returns {JSX.Element} Reset Password page.
 */
const ResetPassword = () => {
  usePageTitle('Reset Password');

  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
