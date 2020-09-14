import axios from 'axios';

const baseURL = '/api'; // 跨域情况下使用

let http = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  transformRequest: [function (data) {
    let newData = '';
    for (let k in data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(k) === true) {
        newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
      }
    }
    return newData;
  }]
});

function apiAxios(method, url, params, response) {
  http({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  }).then(function (res) {
    response(res);
  }).catch(function (err) {
    alert(err);
    response(err);
  });
}

export default {
  get: function (url, params, response) {
    return apiAxios('GET', url, params, response);
  },
  post: function (url, params, response) {
    return apiAxios('POST', url, params, response);
  },
  put: function (url, params, response) {
    return apiAxios('PUT', url, params, response);
  },
  delete: function (url, params, response) {
    return apiAxios('DELETE', url, params, response);
  }
};
