import request from 'axios';
import qs from 'query-string';
import cfg from './config';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl === undefined ? cfg.API_URL : baseUrl;

    const methods = ['get', 'post', 'put', 'patch', 'delete'];
    for (let i = 0; i < methods.length; i += 1) {
      this[methods[i]] = async (
        url,
        config,
        headers = {},
        timeout = 60000,
      ) => {
        const setHeaders = { ... headers };

        if (config) {
          if (config.constructor.name === 'FormData') {
          } else if (config.constructor.name === 'Object') {
            setHeaders['content-type'] = 'application/json';
          }
        }

        try {
          // https://www.chromium.org/throttling/
          const response = await request({
            method: methods[i],
            url: this.baseUrl + url + ((methods[i] === 'get' && !url.includes('?')) ? ('?' + qs.stringify(config)) : ''),
            data: config,
            headers: setHeaders,
            timeout,
          });
          return response.data;
        } catch (e) {
          console.error(e)
          throw e;
        }
      }
    }
  }
}

export default ApiClient;
