export const useHttp = () => {
  const request = async (
    url: string,
    method: string = 'GET',
    body: any = null,
    headers: Record<string, string> = {'Content-Type': 'application/json'}
  ) => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers = { ...headers, Authorization: `Bearer ${token}` };
      }

      const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : null,
        headers,
      });

      if (!response.ok) {
        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }

      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { request };
};
