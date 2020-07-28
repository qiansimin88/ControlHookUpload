export const env = (() => {
  const host = window.location.host;
  if (host.indexOf('daily') > -1) {
    return `daily`
  } else if (host.indexOf('dev') > -1) {
    return `dev`
  } else if (host.indexOf('gray.') > -1) {
    return 'gray'
  } else if (host.indexOf('localhost') > -1) {
    return 'daily'
  }
  return 'prod';
})()

console.log(env)

export const href = (() => {
  const hrefs = {
    daily: `https://api.daily.xinc818.net/`,
    dev: `https://api.dev.xinc818.net/`,
    gray: `https://api.gray.xinc818.net/`,
    prod: `https://api.xinc818.net/`,
  }
  return localStorage.env || hrefs[env];
})();