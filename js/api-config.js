const API_CONFIG = {
  production: 'https://maid-to-clean-backend.onrender.com/api',
  development: 'http://localhost:3000/api'
};

const isLocal = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '';

const API_BASE = isLocal ? API_CONFIG.development : API_CONFIG.production;
window.API_BASE = API_BASE;

console.log('Environment:', isLocal ? 'Development' : 'Production');
console.log('API Base URL:', API_BASE);
