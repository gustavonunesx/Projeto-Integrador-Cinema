export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  // Remove ../ or ./ prefix
  const cleanPath = path.replace(/^(\.\.\/|\.\/)+/, '');

  // Ensure it starts with /
  return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
};
