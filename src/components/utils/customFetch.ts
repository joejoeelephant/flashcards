interface FetchOptions extends Omit<RequestInit, 'body'> {
    body?: any;
  }
  
  async function customFetch(url: string, options: FetchOptions = {}): Promise<any> {
    // Check if the method is defined in the options, if not, set as GET
    options.method = options.method || 'GET';
  
    // Check if headers are defined, if not, set as application/json
    options.headers = options.headers || {
      'Content-Type': 'application/json',
    };
  
    // If there's a body object in the options, stringify it
    if (options.body && typeof options.body === "object" && !(options.body instanceof FormData)) {
      options.body = JSON.stringify(options.body);
    }
  
    const fetchOptions: RequestInit = { ...options, body: options.body };
  
    let response: Response | null = null;
  
    try {
      response = await fetch(url, fetchOptions);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fetch request failed: ${error.message}`);
            throw new Error(error.message);
        } else {
            // handle any other exceptions that could occur
            console.error(`An unexpected error occurred during the fetch request: ${String(error)}`);
            throw new Error('An unexpected error occurred during the fetch request');
        }
    }
  
    // Check if the request was successful
    if (response && !response.ok) {
      let errorMessage = `Fetch request failed with status ${response.status}`;
  
      try {
        const responseBody = await response.json();
        errorMessage = responseBody.message || errorMessage;
      } catch (e) {
        console.error('Could not parse error response body as JSON', e);
      }
  
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  
    let data: any;
    // Decode the JSON response body
    try {
      if(response) {
        data = await response.json();
      }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fetch request failed: ${error.message}`);
            throw new Error(error.message);
        } else {
            // handle any other exceptions that could occur
            console.error(`An unexpected error occurred during the fetch request: ${String(error)}`);
            throw new Error('An unexpected error occurred during the fetch request');
        }
    }
  
    return data;
  }
  
  export default customFetch;
  