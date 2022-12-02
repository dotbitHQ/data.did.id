import { BasicService } from '~/services/BasicService'
import { DEFAULT_PAGE_SIZE } from '~/constant'
import { IAccountParsingRecord } from '~/services/Account'
import { Context } from '@nuxt/types'
import Axios from 'axios'
import { subAccountApi } from '~~/config'
import { onFulfilled, onRejected } from '~/services/interceptors'
import { ICharInfo } from '~/modules/tools'

export interface IConfigInfoRes {
  sub_account_basic_capacity: number,
  sub_account_prepared_fee_capacity: number,
  sub_account_new_sub_account_price: number,
  sub_account_renew_sub_account_price: number,
  sub_account_common_fee: number,
}

export interface IKeyInfo {
  coin_type: string,
  chain_id?: string,
  key: string,
}

export interface IPermission {
  type: string,
  key_info: IKeyInfo,
}

export interface ISubAccountInfo {
  account: string,
  owner: IPermission,
  manager: IPermission,
  registered_at: number,
  expired_at: number,
  status: number,
  enable_sub_account: number,
  renew_sub_account_price: number,
  nonce: number,
}

export interface IAccountListParams {
  page: number,
  size: number,
  type: string,
  key_info: IKeyInfo,
}

export interface IAccountDetailRes {
  account_info: ISubAccountInfo,
  records: IAccountParsingRecord[],
}

export interface IInitSubAccountParams {
  type?: string,
  key_info: IKeyInfo,
  account: string,
}

export interface IWaitSignMsgList {
  sign_type: number,
  sign_msg: string,
}

export interface IMsgToBeSignedRes {
  sign_list: IWaitSignMsgList[],
}

export interface IInitSubAccountRes {
  action: string,
  list: IMsgToBeSignedRes[],
  sign_key: string,
}

export interface ISubAccount {
  type: string,
  key_info?: IKeyInfo,
  mint_for_account?: string,
  account: string,
  register_years: number,
  status?: number,
  account_char_str?: ICharInfo[],
}

export interface ICheckSubAccountParams {
  type?: string,
  key_info: IKeyInfo,
  account: string,
  sub_account_list: ISubAccount[],
}

export interface ICheckSubAccountRes {
  result: ISubAccount[],
}

export interface ICreateSubAccountParams extends ICheckSubAccountParams {}

export interface ICreateSubAccountRes extends IInitSubAccountRes {}

export interface IEditValue {
  owner?: IPermission,
  manager?: IPermission,
  records?: IAccountParsingRecord[],
}

export interface IEditSubAccountParams {
  type?: string,
  key_info: IKeyInfo,
  account: string,
  edit_key: string,
  edit_value: IEditValue,
}

export interface IEditSubAccountRes extends IInitSubAccountRes {}

export interface ISendTransactionParams extends IInitSubAccountRes {}

export interface ITransactionStatusParams {
  type?: string,
  key_info: IKeyInfo,
  action: string,
  account: string,
}

export interface ITransactionStatusRes {
  block_number: number,
  hash: string,
  status: number,
}

export interface ISubAccountListParams {
  account: string,
  page: number,
  size?: number,
  keyword?: string,
  category?: number,
}

export interface ISubAccountOwnerProfit {
  type?: string,
  key_info: IKeyInfo,
  account: string,
}

export interface IProfitWithdraw extends ISubAccountOwnerProfit {}

export default class SubAccount extends BasicService {
  constructor (context: Context) {
    super(context)
    this.axios = Axios.create({
      baseURL: subAccountApi,
      withCredentials: true
    })
    this.axios.interceptors.response.use(onFulfilled(context), onRejected)
  }

  /**
   * get config info
   */
  configInfo (): Promise<IConfigInfoRes> {
    return this.axios.post('/config/info')
  }

  /**
   * get account list
   * @param type
   * @param key_info
   * @param page
   * @param size
   */
  accountList ({
    type,
    key_info,
    page = 1,
    size = DEFAULT_PAGE_SIZE
  }: IAccountListParams): Promise<{ list: ISubAccountInfo[] }> {
    return this.axios.post('/account/list', {
      page,
      size,
      type,
      key_info
    })
  }

  /**
   * get sub account list
   * @param account
   * @param page
   * @param size
   * @param keyword
   * @param category
   */
  subAccountList ({
    account,
    page = 1,
    size = 50,
    keyword,
    category
  }: ISubAccountListParams): Promise<{ list: ISubAccountInfo[], total: number }> {
    return this.axios.post('/sub/account/list', {
      account,
      page,
      size,
      keyword,
      category
    })
  }

  /**
   * init sub account
   * @param type
   * @param key_info
   * @param account
   */
  initSubAccount ({
    type = 'blockchain',
    key_info,
    account
  }: IInitSubAccountParams): Promise<IInitSubAccountRes> {
    return this.axios.post('/sub/account/init', {
      type,
      key_info,
      account
    })
  }

  /**
   * check sub account
   * @param type
   * @param key_info
   * @param account
   * @param sub_account_list
   */
  checkSubAccount ({
    type = 'blockchain',
    key_info,
    account,
    sub_account_list
  }: ICheckSubAccountParams): Promise<ICheckSubAccountRes> {
    return this.axios.post('/sub/account/check', {
      type,
      key_info,
      account,
      sub_account_list
    })
  }

  /**
   * create sub account
   * @param type
   * @param key_info
   * @param account
   * @param sub_account_list
   */
  createSubAccount ({
    type = 'blockchain',
    key_info,
    account,
    sub_account_list
  }: ICreateSubAccountParams): Promise<ICreateSubAccountRes> {
    return this.axios.post('/sub/account/create', {
      type,
      key_info,
      account,
      sub_account_list
    })
  }

  /**
   * edit sub account
   * @param type
   * @param key_info
   * @param account
   * @param edit_key
   * @param edit_value
   */
  editSubAccount ({
    type = 'blockchain',
    key_info,
    account,
    edit_key,
    edit_value
  }: IEditSubAccountParams): Promise<IEditSubAccountRes> {
    return this.axios.post('/sub/account/edit', {
      type,
      key_info,
      account,
      edit_key,
      edit_value
    })
  }

  /**
   * send transaction
   * @param action
   * @param list
   */
  sendTransaction ({
    action,
    list,
    sign_key
  }: ISendTransactionParams): Promise<{ hash: string, hash_list: string[] }> {
    return this.axios.post('/transaction/send', {
      action,
      list,
      sign_key
    })
  }

  /**
   * transaction status
   * @param type
   * @param key_info
   * @param action
   * @param account
   */
  transactionStatus ({
    type = 'blockchain',
    key_info,
    action,
    account
  }: ITransactionStatusParams): Promise<ITransactionStatusRes> {
    return this.axios.post('/transaction/status', {
      type,
      key_info,
      action,
      account
    })
  }

  /**
   * subAccount owner profit
   * @param type
   * @param key_info
   * @param account
   */
  subAccountOwnerProfit ({
    type = 'blockchain',
    key_info,
    account
  }: ISubAccountOwnerProfit): Promise<{ owner_profit: string }> {
    return this.axios.post('/owner/profit', {
      type,
      key_info,
      account
    })
  }

  /**
   * profit withdraw
   * @param type
   * @param key_info
   * @param account
   */
  profitWithdraw ({
    type = 'blockchain',
    key_info,
    account
  }: IProfitWithdraw): Promise<{ hash: string, action: string }> {
    return this.axios.post('/profit/withdraw', {
      type,
      key_info,
      account
    })
  }

  /**
   * custom script info
   * @param account
   */
  customScriptInfo (account: string): Promise<{ custom_script_args: string }> {
    return this.axios.post('/custom/script/info', {
      account
    })
  }
}
