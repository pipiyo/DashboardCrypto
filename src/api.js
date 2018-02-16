import fetch from 'isomorphic-fetch';

const baseURL = 'http://localhost:3000';

const API = {
  get: {
    async currency(filtro, currency) {
      try {
        const response = await fetch(`${baseURL}/api/${currency}/${filtro}`);
        const data = response.json();
        return data;
      } catch (error) {
        return [];
      }
    },
  },
};
export default API;