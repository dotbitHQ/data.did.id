import { Context } from '@nuxt/types'
import createPersistedState from 'vuex-persistedstate'
import { appNmae } from '~~/config'
import { COMMON_KEYS } from '~/store/common'
import { SUB_ACCOUNT_KEYS } from '~/store/subAccount'

export const VuexPersistedStateKey = appNmae + 'v3'

export default ({ store }: Context) => {
  createPersistedState({
    key: VuexPersistedStateKey,
    paths: [
      'common.version',
      'common.language',
      'common.config',
      'common.tokens',
      'common.hardwareWalletTipsShow',
      'common.torusLoginSuccessTipsShow',
      SUB_ACCOUNT_KEYS.namespace,
      'me.connectedAccount',
      'me.inviter',
      'me.channel',
      'me.reverseRecord'
    ]
  })(store)
}
