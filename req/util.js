import request from './request';

export const CurryingRequest = (p1, fp2, door=50) => {
    let p1c = p1;
    // let proxyUrl = REACT_APP_ENV === 'prd' ? '' : '/api' 
    let proxyUrl = ''
    if (fp2 === 'mock') {
      proxyUrl = `https://mock.xinc818.com/mock/${door}`
    } else {
      // proxyUrl = 'https://dev-api.xinc818.com'
    }
    // handlerUrl 处理 url
    return async (p2, handlerUrl) => {
      const { method, ...other } = p2
      let lastUrl = ''
      if (!p2.method) throw new Error('必须制定请求方法')
      if (p2.method === 'GET') {
        p2.params = other
      } else {
        p2.data = other
      }
  
      if(typeof handlerUrl === 'function') {
        lastUrl = handlerUrl(proxyUrl + p1c)
      }else {
        lastUrl = proxyUrl + p1c
      }
  
      return request.apply(null, [lastUrl, p2])
    }
}