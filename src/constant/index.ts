import config from '~~/config'
import { ParsingRecordProfileKey } from '~/services/Account'

export const IDENTICON_SERVE = config.identiconServer

export const DEBOUNCE_WAIT_TIME = 600

export const CYCLE_CALL_FUNCTION_TIME = 5000

export const TOAST_DURATION_TIME = 1000

// number of decimal places to keep for token amount
export const TOKEN_DECIMAL_PLACES = 8

// number of decimal places to retain the amount
export const FIAT_DECIMAL_PLACES = 2

export const TIME_FORMAT = {
  fullDateTime: 'YYYY-MM-DD HH:mm:ss',
  fullDate: 'YYYY-MM-DD',
  MMDDHHMM: 'MM-DD HH:mm'
}

export const DEFAULT_PAGE_SIZE = 20

export enum WalletProtocol {
  metaMask = 'metaMask',
  tronLink = 'tronLink',
  torus = 'torus',
  uniSign = 'uniSign',
  walletConnect = 'walletConnect'
}

export enum TRX_STATUS {
  failed = -1,
  pending,
  success,
  unpackaged,
  unknown
}

export enum ACCOUNT_STATUS {
  notOpenRegister= -1,
  registerable,
  registeringPaymentConfirm,
  registeringLockedAccount,
  registering,
  registeringIncludeProposal,
  registeringConfirmProposal,
  registered,
  reservedAccount,
  onePriceSell,
  auctionSell,
  candidateAccount,
  expired,
  othersRegistering,
  unavailableAccount,
  subAccountNotCreated,
  onCross
}

export const ACCOUNT_SUFFIX = '.bit'

export enum CHAR_TYPE {
  emoji = 0,
  number = 1,
  english = 2,
  simplifiedChinese = 3,
  traditionalChinese,
  japanese,
  korean,
  russian,
  turkish,
  thai,
  vietnamese,
  unknown = 99
}

export const SETTINGS = {
  manageData: 'manageData',
  changePermission: 'changePermission',
  renew: 'renew',
  mintSubAccounts: 'mintSubAccounts',
  superDid: 'superDid'
}

export enum ParsingRecordDwebKey {
  ipfs = 'ipfs',
  ipns = 'ipns',
  arweave = 'arweave',
  resilio = 'resilio',
  skynet = 'skynet'
}

export const DWEB_KEY_OPTIONS = [{
  text: 'IPFS',
  value: ParsingRecordDwebKey.ipfs
}, {
  text: 'IPNS',
  value: ParsingRecordDwebKey.ipns
}, {
  text: 'Arweave',
  value: ParsingRecordDwebKey.arweave
}, {
  text: 'Resilio',
  value: ParsingRecordDwebKey.resilio
}, {
  text: 'Skynet',
  value: ParsingRecordDwebKey.skynet
}]

export const PROFILE_KEY_OPTIONS = [{
  text: 'Twitter',
  value: ParsingRecordProfileKey.twitter
}, {
  text: 'Facebook',
  value: ParsingRecordProfileKey.facebook
}, {
  text: 'Instagram',
  value: ParsingRecordProfileKey.instagram
}, {
  text: 'Reddit',
  value: ParsingRecordProfileKey.reddit
}, {
  text: 'LinkedIn',
  value: ParsingRecordProfileKey.linkedin
}, {
  text: 'GitHub',
  value: ParsingRecordProfileKey.github
}, {
  text: 'Telegram',
  value: ParsingRecordProfileKey.telegram
}, {
  text: 'Discord',
  value: ParsingRecordProfileKey.discord
}, {
  text: 'Youtube',
  value: ParsingRecordProfileKey.youtube
}, {
  text: 'bilibili',
  value: ParsingRecordProfileKey.bilibili
}, {
  text: 'Medium',
  value: ParsingRecordProfileKey.medium
}, {
  text: 'TikTok',
  value: ParsingRecordProfileKey.tiktok
}, {
  text: 'Weibo',
  value: ParsingRecordProfileKey.weibo
}, {
  text: 'Jike',
  value: ParsingRecordProfileKey.jike
}, {
  text: 'NextID',
  value: ParsingRecordProfileKey.nextid
}, {
  text: 'Dribbble',
  value: ParsingRecordProfileKey.dribbble
}, {
  text: 'Behance',
  value: ParsingRecordProfileKey.behance
}, {
  text: 'Mirror',
  value: ParsingRecordProfileKey.mirror
}, {
  text: 'Avatar',
  value: ParsingRecordProfileKey.avatar
}, {
  text: 'Description',
  value: ParsingRecordProfileKey.description
}, {
  text: 'Website',
  value: ParsingRecordProfileKey.website
}]

export const ORDER_ACTION_TYPE = {
  applyRegister: 'apply_register',
  setDasReverse: 8,
  editDasReverse: 9,
  deleteDasReverse: 10,
  editRecords: 12
}

export const CrossEthContract = config.isProdData ? '0x60eB332Bd4A0E2a9eEB3212cFdD6Ef03Ce4CB3b5' : '0x7eCBEE03609f353d041942FF50CdA2A120ABddd9'

export const TwitterUserUrlRegExp = /^https:\/\/twitter\.com\/[a-zA-Z0-9_]+/

export enum DigitalEmojiUnifiedMap {
  '0⃣️' = '0️⃣',
  '1⃣️' = '1️⃣',
  '2⃣️' = '2️⃣',
  '3⃣️' = '3️⃣',
  '4⃣️' = '4️⃣',
  '5⃣️' = '5️⃣',
  '6⃣️' = '6️⃣',
  '7⃣️' = '7️⃣',
  '8⃣️' = '8️⃣',
  '9⃣️' = '9️⃣',
  '0⃣' = '0️⃣',
  '1⃣' = '1️⃣',
  '2⃣' = '2️⃣',
  '3⃣' = '3️⃣',
  '4⃣' = '4️⃣',
  '5⃣' = '5️⃣',
  '6⃣' = '6️⃣',
  '7⃣' = '7️⃣',
  '8⃣' = '8️⃣',
  '9⃣' = '9️⃣'
}
