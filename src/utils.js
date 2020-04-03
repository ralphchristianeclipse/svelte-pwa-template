export const isProd = process.env.NODE_ENV === 'production';
export const redirectToHTTPS = () =>
  window.location.protocol === 'http:' &&
  (window.location = `https://${window.location.host}`);
