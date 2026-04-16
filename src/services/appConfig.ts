export const appConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() ?? "",
  baseUrl: import.meta.env.BASE_URL,
};

export function hasBackendConfigured() {
  return appConfig.apiBaseUrl.length > 0;
}

export function resolveAppPath(path: string) {
  const normalizedBase = appConfig.baseUrl.endsWith("/")
    ? appConfig.baseUrl
    : `${appConfig.baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${normalizedBase}${normalizedPath}`;
}
