export const useHttp = () => {
  const request = async (
    url: string,
    method: string = 'GET',
    isResponsible: boolean = true,
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
        // if (response.status === 401 || response.status === 403)
        if (response.status === 401)
         window.location.href = `/preview?error=${response.status}`;

        throw new Error(`Could not fetch ${url}, status: ${response.status}`);
      }
      // console.log(response);
      if (isResponsible && response.status !== 204) return await response.json();
      else return null;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { request };
};
