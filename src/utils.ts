/**
 * Helper to dynamically resolve the correct asset path in Vite.
 * Supports:
 * 1. Local development (localhost:3000)
 * 2. AI Studio development and preview environments (*.run.app)
 * 3. GitHub Pages sub-directories (username.github.io/repo-name) with or without trailing slash
 * 4. GitHub Pages with custom domains
 */
export function getAssetPath(path: string): string {
  if (!path) return '';
  
  // If it's already a full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Normalize path by removing leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Use Vite's built-in BASE_URL which is handled during build time
  // and correctly set in vite.config.ts
  const baseUrl = import.meta.env.BASE_URL || '/';
  
  // Ensure baseUrl ends with a slash and combine with cleanPath
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${normalizedBase}${cleanPath}`;
}
