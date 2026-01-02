export const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback logic for demo
  if (typeof window !== 'undefined') {
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return 'http://localhost:8787/api/v1';
    }
  }

  // Default to production worker for demo
  return 'https://havys-erp-worker-production.lowshinsheng.workers.dev/api/v1';
};

export const API_URL = getApiUrl();
