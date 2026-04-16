export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
};

export function hasBackendConfigured() {
  return appConfig.apiBaseUrl.length > 0;
}
