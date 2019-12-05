import axios from 'axios'
import { message } from 'antd'
axios.defaults.baseURL = process.env.REACT_APP_API_URL

export function isWxAgent() {
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('micromessenger') !== -1) {
    return true;
  } else {
    return false;
  }
}

function handleError(err:any, showMsg:boolean) {
  if (err.response) {
    console.log('ERROR:')
    console.log(err.response)
    if (err.response.data.message) {
      if (showMsg) message.error(`发生错误！错误内容：${err.response.data.message}`)
    } else {
      if (showMsg) message.error(`发生错误！错误内容：${JSON.stringify(err.response.data)}`)
    }
  } else {
    console.log('ERROR:')
    console.log(err)
    if (showMsg) message.error('未知错误！')
  }
}

export function fetchData(path:string, params?:object, showMsg = true) {
  console.debug(`PATH: "${path}"`)
  if (params) {
    console.debug('PARAMS:')
    console.debug(params)
  }
  return new Promise((resolve, reject) => {
    axios.get(path, {
      params: params,
      withCredentials: true
    }).then(res => {
      if (res.data) {
        console.debug('RESPOND:')
        console.debug(res.data)
      }
      resolve(res)
    }).catch(err => {
      handleError(err, showMsg)
      reject(err)
    })
  });
}

export function deleteData(path:string, params?:object, showMsg = true) {
  console.debug(`PATH: "${path}"`)
  if (params) {
    console.debug('PARAMS:')
    console.debug(params)
  }
  return new Promise((resolve, reject) => {
    axios.delete(path, {
      params: params,
      withCredentials: true
    }).then(res => {
      if (res.data) {
        console.debug('RESPOND:')
        console.debug(res.data)
      }
      resolve(res)
    }).catch(err => {
      handleError(err, showMsg)
      reject(err)
    })
  });
}

export function updateData(path:string, data?:object, showMsg = true) {
  console.debug(`PATH: "${path}"`)
  console.debug('DATA:')
  console.debug(data)
  return new Promise((resolve, reject) => {
    axios.put(path, { ...data }, {
      withCredentials: true
    }).then(res => {
      console.debug('RESPOND:')
      console.debug(res.data)
      if (showMsg) message.success('更新成功');
      resolve(res)
    }).catch(err => {
      handleError(err, showMsg)
      reject(err)
    })
  });
}

export function postData(path:string, data:object, showMsg = true) {
  console.debug(`PATH: "${path}"`)
  console.debug('DATA:')
  console.debug(data);
  return new Promise((resolve, reject) => {
    axios.post(path, { ...data }, {
      withCredentials: true
    }).then(res => {
      console.debug('RESPOND:')
      console.debug(res.data)
      if (showMsg) message.success('提交成功');
      resolve(res)
    }).catch(err => {
      handleError(err, showMsg)
      reject(err)
    })
  });
}

export function uploadData(path:string, formData:object, showMsg = true) {
  console.debug(`PATH: "${path}"`)
  return new Promise((resolve, reject) => {
    axios.post(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    }).then(res => {
      console.debug('RESPOND:')
      console.debug(res.data)
      if (showMsg) message.success('提交成功');
      resolve(res)
    }).catch(err => {
      handleError(err, showMsg)
      reject(err)
    })
  });
}