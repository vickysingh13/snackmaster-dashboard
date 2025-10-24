export const setToken = (token) => localStorage.setItem("sm_token", token);
export const getToken = () => localStorage.getItem("sm_token");
export const clearToken = () => localStorage.removeItem("sm_token");
export const isLoggedIn = () => !!getToken();