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
  
  // If running on GitHub Pages (e.g., username.github.io/repo-name)
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
    const pathParts = window.location.pathname.split('/');
    // pathParts[0] is empty, pathParts[1] is the repository name (e.g., "GYM")
    const repoName = pathParts[1];
    if (repoName) {
      return `/${repoName}/${cleanPath}`;
    }
  }
  
  // Default to absolute path from root
  return `/${cleanPath}`;
}
