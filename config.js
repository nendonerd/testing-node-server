function getConfig(env) {
  switch(env) {
    case 'production':
      return {
        http: {port: 80},
        https: {port: 443}
      }
      break;
    default:
      return {
        http: {port: 3003},
        https: {port: 3004}
      }
      break;
  }
}

module.exports = getConfig
