export const href = (() => {
    // console.log(decodeURIComponent(getPageQuery().env))
    if (localStorage.env) {
      return localStorage.env
    }
    
    // return 'https://dev-api.xinc818.com/'
    const host = window.location.host;
    if (host.indexOf('daily') > -1) {
      return `https://daily-api.xinc818.com/`
    } else if (host.indexOf('dev') > -1) {
      return `https://dev-api.xinc818.com/`
    } else if (host.indexOf('mock') > -1) {
      return 'https://mock.xinc818.com/mock/50/'
    } else if (host.indexOf('pms.') > -1) {
      return 'https://api.xinc818.com/'
    }
  
    
    return 'https://daily-api.xinc818.com/'
    let res = '';
    switch (host) {
      case 'daily-xinxuan-system.xinc818.com':
        res = 'https://daily-api.xinc818.com/';
        break;
      case 'gray-xinxuan-system.xinc818.com':
        res = 'https://gray-api.xinc818.com/';
        break;
      case 'dev-xinxuan-system.xinc818.com':
        res = 'https://dev-api.xinc818.com/';
        break;
      case 'xinxuan-system.xinc818.com':
        res = 'https://api.xinc818.com/';
        break;
      case 'test.xinc818.com:8000':
        res = 'https://dev-api.xinc818.com/';
        // res = 'http://192.168.10.112:8080/';
        break;
      default:
        return (res = '');
    }
    // return 'https://dev-api.xinc818.com/'
    return res;
  })();
