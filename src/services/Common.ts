import { BasicService } from '~/services/BasicService'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX } from '~/constant'
import { splitAccount } from '~/modules/tools'

export interface IToken {
  chain_type: number,
  contract: string,
  decimals: number,
  name: string,
  price: string,
  symbol: string,
  token_id: string,
}

export interface IConfig {
  sale_cell_capacity: number, // CKB that requires pledge for uploading account
  min_sell_price: number, // minimum price for sale
  offer_cell_capacity: number, // minimum amount of quotation
}

export interface IRegisterTxMap {
  chain_id: number,
  hash: string,
  token_id: string,
}

export interface ISearchAccount {
  status: ACCOUNT_STATUS,
  account: string,
  is_self: boolean,
  account_price: string,
  base_amount: string,
  register_tx_map: { [key: string]: IRegisterTxMap },
}

export default class Common extends BasicService {
  /**
   * get token list
   */
  tokens (): Promise<{ token_list: IToken[] }> {
    return this.axios.post('/token/list')
  }

  /**
   * get config info
   */
  config (): Promise<IConfig> {
    return this.axios.post('/config/info')
  }

  /**
   * search account
   * @param account
   * @param chain_type
   * @param address
   */
  searchAccount ({
    account,
    chain_type,
    address
  }: {
    account: string,
    chain_type?: number,
    address?: string,
  }): Promise<ISearchAccount> {
    account = account.replace(/\.bit$/, '')
    return this.axios.post('/account/search', {
      account: account + ACCOUNT_SUFFIX,
      chain_type,
      address,
      account_char_str: splitAccount(account, true)
    })
  }
}
