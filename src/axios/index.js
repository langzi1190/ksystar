import axios from 'axios';

const baseURL = '';//'http://192.168.0.100/';

let http = axios.create({
  baseURL: baseURL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  // transformRequest: [function (data) {
  //   let newData = '';
  //   for (let k in data) {
  //     if (data.hasOwnProperty(k) === true) {
  //       newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
  //     }
  //   }
  //   return newData;
  // }]
});

function apiAxios(method, url, params, response) {
  if(baseURL==''){
      //todo delete
    let urlTrans={
        "syncScrInfoRd.cgi":"/screen_info.json",
        // "syncScrInfoRd.cgi":"/screen_info41.json",
        "syncWinInfoRd.cgi":"/window_items.json",
        "syncOutputInfoRd.cgi":"/out_put_list.json",
        "syncInputInfoRd.cgi":"/signal_list.json",
        // "syncCommonInfoRd.cgi":"/common_param.json",
        "syncCommonInfoRd.cgi":"/common_param_enable.json",
        "scenePollingRd.cgi":"/scene_polling.json",
        "srcGroupRd.cgi":"/src_group_list.json",
        "winOpr.cgi":"/new_win.json",
        "switchWinScr.cgi":"/new_win.json",
        "closeWin.cgi":"/new_win.json",
        "closeAllWin.cgi":"/new_win.json",
        "winLayerWr.cgi":"/new_win.json",
        "ipCfgRd.cgi":"ip_config.json",
        "monitorIpWr.cgi":"ip_config.json",
        "fpgaTempRd.cgi":"temperature.json",
        "KfsWr.cgi":"temperature.json",
        "verInfoRd.cgi":"version.json",
        "devCfgStaRd.cgi":"status.json",
        "srcGroupWr.cgi":"write_back.json",
        "extCtrlRd.cgi":"screen_ctrl.json",
        "srcEdidRd.cgi":"edid_data.json",
        "syncInputInfoRd_t.cgi":"usemodeltest_singal.json",
        "syncWinInfoRd_t.cgi":"usemodel_test_windows.json",
    };
      url=urlTrans[url];
      method='GET';
  }


    http({
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null
    }).then(function (res) {
        response(res);
    }).catch(function (err) {
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
