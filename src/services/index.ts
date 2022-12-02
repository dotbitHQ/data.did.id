import { Context } from '@nuxt/types'
import Common from '~/services/Common'
import Account from '~/services/Account'
import SubAccount from '~/services/SubAccount'

export class Services {
  common: Common
  account: Account
  subAccount: SubAccount

  constructor (context: Context) {
    this.common = new Common(context)
    this.account = new Account(context)
    this.subAccount = new SubAccount(context)
  }
}
