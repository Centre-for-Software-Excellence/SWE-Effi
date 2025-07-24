/**
 * Utility function to construct paths with the base URL from Vite config
 */
export function getBasePath(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  // Ensure baseUrl ends with slash
  const baseUrlWithSlash = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${baseUrlWithSlash}${cleanPath}`;
}
