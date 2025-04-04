export const jwtUtil = {
  setToken: (token: string, rememberMe: boolean) => {
    if (rememberMe) {
      sessionStorage.setItem('token', token);
    }
    else {
      localStorage.setItem('token', token);
    }
  },
  
  getToken: () => {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  },
  
  clearToken: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  
  isTokenExpired: (token: string) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  },
};