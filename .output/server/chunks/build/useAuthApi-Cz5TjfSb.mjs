import { a as useNuxtApp } from './server.mjs';

function useAuthApi() {
  const { $api } = useNuxtApp();
  return {
    login(email, password) {
      return $api("/auth/login", { method: "POST", body: { email, password } });
    },
    register(data) {
      return $api("/auth/register", { method: "POST", body: data });
    },
    refreshToken(refreshToken) {
      return $api("/auth/refresh", { method: "POST", body: { refreshToken } });
    },
    logout() {
      return $api("/auth/logout", { method: "POST" });
    },
    forgotPassword(email) {
      return $api("/auth/forgot-password", { method: "POST", body: { email } });
    },
    resetPassword(token, newPassword) {
      return $api("/auth/reset-password", { method: "POST", body: { token, newPassword } });
    }
  };
}

export { useAuthApi as u };
//# sourceMappingURL=useAuthApi-Cz5TjfSb.mjs.map
