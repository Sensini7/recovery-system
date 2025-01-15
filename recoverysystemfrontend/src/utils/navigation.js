export const handleRoleBasedRedirect = (role, navigate) => {
  // Redirect all users to /dashboard regardless of role
  navigate('/dashboard');
}; 