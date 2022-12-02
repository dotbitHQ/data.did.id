import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'
import { IConfigInfoRes } from '~/services/SubAccount'

const keys = {
  namespace: 'subAccount',
  // mutations
  setConfig: 'setConfig',
  // actions
  fetchConfig: 'fetchConfig',
  // getters
}

export const state = () => ({
  config: {
    sub_account_basic_capacity: 0,
    sub_account_prepared_fee_capacity: 0,
    sub_account_new_sub_account_price: 0,
    sub_account_renew_sub_account_price: 0,
    sub_account_common_fee: 0
  } as IConfigInfoRes,
})

export type SubAccountState = ReturnType<typeof state>

export const mutations: MutationTree<SubAccountState> = {
  [keys.setConfig]: (state, config: IConfigInfoRes) => {
    state.config = config
  }
}

export const actions: ActionTree<SubAccountState, SubAccountState> = {
  async [keys.fetchConfig] ({ commit }) {
    try {
      const res = await this.$services.subAccount.configInfo()
      if (res) {
        commit(keys.setConfig, res)
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  }
}

export const SUB_ACCOUNT_KEYS = augmentKeys(keys, keys.namespace)
