const packageJson = require('./package.json')
const isProdData = false
const hostname = isProdData ? '127.0.0.1:10500' : '127.0.0.1:10500'

module.exports = {
  isProdData,
  appNmae: packageJson.name,
  description: packageJson.description,
  hostname,
  domain: `https://${hostname}/`,
  servicesApi: isProdData ? '' : '',
  subAccountApi: isProdData ? '' : '',
  identiconServer: '',
  dotbitApp: 'https://app.did.id',
  dotbitBalance: 'https://balance.did.id',
  superDid: 'https://superdid.id',
  ckbNode: isProdData ? '' : ''
}
