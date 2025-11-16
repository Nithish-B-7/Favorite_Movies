export const saveAuth = (token: string, user: any) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getAuth = () => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  return { token, user: userJson ? JSON.parse(userJson) : null };
};

export const logoutLocal = () => clearAuth();
