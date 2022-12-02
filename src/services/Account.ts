import { BasicService } from '~/services/BasicService'
import { ACCOUNT_STATUS, DEFAULT_PAGE_SIZE, ParsingRecordDwebKey, TRX_STATUS } from '~/constant'
import { ChainType } from '~/constant/chain'
import { TypedMessage } from '@metamask/eth-sig-util'

export interface IWaitSignMsgList {
  sign_type: number,
  sign_msg: string,
}

export interface IMsgToBeSignedRes {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
  mm_json?: TypedMessage<any>,
}

export interface IReverseLatestParams {
  chainType: number,
  address: string,
}

export interface IReverseLatestRes {
  account: string,
  is_valid: boolean,
}

export interface IAccountInfo {
  account: string,
  owner: string,
  manager: string,
  registered_at: number,
  expired_at: number,
  status: ACCOUNT_STATUS,
  account_price: string,
  base_amount: string,
  owner_chain_type: ChainType,
  manager_chain_type: ChainType,
  confirm_proposal_hash: string,
  enable_sub_account: number,
}

export interface ITrxStatusParam {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  actions: Array<string | number>,
}

export interface ISendTrxParams {
  sign_key: string,
  sign_list: IWaitSignMsgList[],
}

export enum ParsingRecordType {
  address = 'address',
  profile = 'profile',
  dweb = 'dweb',
  customKey = 'custom_key'
}

export enum ParsingRecordProfileKey {
  twitter = 'twitter',
  facebook = 'facebook',
  reddit = 'reddit',
  linkedin = 'linkedin',
  github = 'github',
  telegram = 'telegram',
  description = 'description',
  avatar = 'avatar',
  instagram = 'instagram',
  weibo = 'weibo',
  discord = 'discord',
  website = 'website',
  youtube = 'youtube',
  bilibili = 'bilibili',
  tiktok = 'tiktok',
  jike = 'jike',
  nextid = 'nextid',
  dribbble = 'dribbble',
  behance = 'behance',
  mirror = 'mirror',
  medium = 'medium'
}

export enum ParsingRecordProfileLink {
  twitter = 'https://twitter.com/'
}

export enum ParsingRecordAction {
  delete = 'delete',
  change = 'change',
  add = 'add'
}

export interface IAccountParsingRecord {
  type: ParsingRecordType | string,
  key: ParsingRecordProfileKey | ParsingRecordDwebKey | string,
  label: string,
  value: string,
  ttl: string,
  action?: ParsingRecordAction | string,
}

export interface IAccountParsingRecords {
  records: IAccountParsingRecord[],
}

interface IEditRecordsParams {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  account: string,
  raw_param: {
    records: IAccountParsingRecord[],
  },
}

interface IOrderDetailParams {
  account: string,
  chain_type: number,
  address: string,
  action: string,
}

export interface IOrderDetailRes {
  order_id: string,
  account: number,
  action: string,
  status: string,
  timestamp: number,
  pay_token_id: string,
  pay_amount: string,
  inviter_account: string,
  register_years: number,
  receipt_address: string,
  code_url: string,
  pay_type: string,
  channel_account: string,
}

export interface ITrxStatusRes {
  block_number: number,
  hash: string,
  status: TRX_STATUS,
}

interface ISubmitRenewOrderParams {
  chain_type: number,
  address: string,
  account: string,
  pay_chain_type: number,
  pay_token_id: string,
  pay_address: string,
  pay_type: string,
  renew_years: number,
}

interface ISubmitRenewOrderRes {
  order_id: string,
  chain_type?: number,
  receipt_address: string,
  amount: string,
  code_url: string,
  token_id: string,
  pay_type?: string,
}

interface IEditOwnerParams {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  account: string,
  raw_param: {
    receiver_chain_type: number,
    receiver_address: string,
  },
}

interface IEditManagerParams {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  account: string,
  raw_param: {
    manager_chain_type: number,
    manager_address: string,
  },
}

interface IDasBalancePayParams {
  evm_chain_id: number,
  chain_type: number,
  address: string,
  order_id: string,
}

export default class Account extends BasicService {
  /**
   * Get account information
   * @param accountName
   */
  accountInfo (accountName: string): Promise<IAccountInfo> {
    return this.axios.post('/account/detail', {
      account: accountName
    })
  }

  /**
   * order detail
   * @param chain_type
   * @param address
   * @param account
   * @param action
   */
  orderDetail ({
    chain_type,
    address,
    account,
    action
  }: IOrderDetailParams): Promise<IOrderDetailRes> {
    return this.axios.post('/account/order/detail', {
      chain_type,
      address,
      account,
      action
    })
  }

  /**
   * transaction status
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param actions
   */
  trxStatus ({
    evm_chain_id,
    chain_type,
    address,
    actions
  }: ITrxStatusParam): Promise<ITrxStatusRes> {
    return this.axios.post('/transaction/status', {
      evm_chain_id,
      chain_type,
      address,
      actions
    })
  }

  /**
   * get my accounts
   * @param chain_type
   * @param address
   * @param page
   * @param size
   */
  myAccounts ({
    chain_type,
    address,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: { chain_type: number, address: string, page?: number, size?: number }): Promise<{ list: IAccountInfo[] }> {
    return this.axios.post('/account/mine', {
      chain_type,
      address,
      page,
      size
    })
  }

  /**
   * edit parsing records
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param account
   * @param records
   */
  editRecords ({
    evm_chain_id,
    chain_type,
    address,
    account,
    raw_param: {
      records
    }
  }: IEditRecordsParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/records', {
      evm_chain_id,
      chain_type,
      address,
      account,
      raw_param: {
        records
      }
    })
  }

  /**
   * send transaction
   * @param sign_key
   * @param sign_list
   */
  sendTrx ({
    sign_key,
    sign_list
  }: ISendTrxParams): Promise<{ hash: string }> {
    return this.axios.post('/transaction/send', {
      sign_key,
      sign_list
    })
  }

  /**
   * Get account parsing records
   * @param accountName
   */
  accountParsingRecords (accountName: string): Promise<IAccountParsingRecords> {
    return this.axios.post('/account/records', {
      account: accountName
    })
  }

  /**
   * submit renew order
   * @param chain_type
   * @param address
   * @param account
   * @param pay_chain_type
   * @param pay_token_id
   * @param pay_type
   * @param pay_address
   * @param renew_years
   */
  submitRenewOrder ({
    chain_type,
    address,
    account,
    pay_chain_type,
    pay_token_id,
    pay_type,
    pay_address,
    renew_years
  }: ISubmitRenewOrderParams): Promise<ISubmitRenewOrderRes> {
    return this.axios.post('/account/order/renew', {
      chain_type,
      address,
      account,
      pay_chain_type,
      pay_token_id,
      pay_type,
      pay_address,
      renew_years
    })
  }

  /**
   * edit account owner
   * @param chain_type
   * @param evm_chain_id
   * @param address
   * @param pay_chain_type
   * @param account
   * @param receiver_chain_type
   * @param receiver_address
   */
  editOwner ({
    chain_type,
    evm_chain_id,
    address,
    account,
    raw_param: {
      receiver_chain_type,
      receiver_address
    }
  }: IEditOwnerParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/owner', {
      chain_type,
      evm_chain_id,
      address,
      account,
      raw_param: {
        receiver_chain_type,
        receiver_address
      }
    })
  }

  /**
   * edit account manager
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param pay_chain_type
   * @param account
   * @param manager_chain_type
   * @param manager_address
   */
  editManager ({
    evm_chain_id,
    chain_type,
    address,
    account,
    raw_param: {
      manager_chain_type,
      manager_address
    }
  }: IEditManagerParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/account/edit/manager', {
      evm_chain_id,
      chain_type,
      address,
      account,
      raw_param: {
        manager_chain_type,
        manager_address
      }
    })
  }

  /**
   * DAS Balance payment
   * @param evm_chain_id
   * @param chain_type
   * @param address
   * @param order_id
   */
  dasBalancePay ({
    evm_chain_id,
    chain_type,
    address,
    order_id
  }: IDasBalancePayParams): Promise<IMsgToBeSignedRes> {
    return this.axios.post('/balance/pay', {
      evm_chain_id,
      chain_type,
      address,
      order_id
    })
  }

  /**
   * reverse latest
   * @param chainType
   * @param address
   */
  reverseLatest ({
    chainType,
    address
  }: IReverseLatestParams): Promise<IReverseLatestRes> {
    return this.axios.post('/reverse/latest', {
      chain_type: chainType,
      address
    })
  }
}
