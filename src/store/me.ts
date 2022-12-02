import { ActionTree, MutationTree, GetterTree } from 'vuex'
import { augmentKeys } from '~/modules/tools'
import {
  ChainType,
  CoinType,
  CoinTypeToChainIdMap,
  EvmCoinTypes,
  IMainChain,
} from '~/constant/chain'
import { IReverseLatestRes } from '~/services/Account'
import { WalletProtocol } from '~/constant'

export interface IConnectedAccount {
  address: string,
  chain: IMainChain,
  protocol: WalletProtocol,
}

const keys = {
  namespace: 'me',
  // mutations
  setInviter: 'setInviter',
  setChannel: 'setChannel',
  setConnectedAccount: 'setConnectedAccount',
  setReverseRecord: 'setReverseRecord',
  // actions
  fetchReverseRecord: 'fetchReverseRecord',
  // getters
  computedChainType: 'computedChainType',
  computedChainId: 'computedChainId'
}

export const state = () => ({
  inviter: '',
  channel: '',
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  connectedAccount: {
    address: ''
  } as IConnectedAccount,
  reverseRecord: {
    account: '',
    is_valid: false
  }
})

export type MeState = ReturnType<typeof state>

export const mutations: MutationTree<MeState> = {
  [keys.setInviter]: (state, inviter: string) => {
    state.inviter = inviter
  },
  [keys.setChannel]: (state, channel: string) => {
    state.channel = channel
  },
  [keys.setConnectedAccount]: (state, connectedAccount: IConnectedAccount) => {
    state.connectedAccount = {
      ...state.connectedAccount,
      ...connectedAccount
    }
  },
  [keys.setReverseRecord]: (state, reverseRecord: IReverseLatestRes) => {
    state.reverseRecord = reverseRecord
  }
}

export const actions: ActionTree<MeState, MeState> = {
  async [keys.fetchReverseRecord] ({ commit, state, getters }) {
    const connectedAccount = state.connectedAccount
    const chainType = getters[keys.computedChainType]
    if (!connectedAccount.address || !chainType) {
      return
    }
    try {
      const res = await this.$services.account.reverseLatest({
        chainType,
        address: connectedAccount.address
      })
      if (res) {
        commit(keys.setReverseRecord, res)
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  },
}

export const getters: GetterTree<MeState, MeState> = {
  [keys.computedChainType] (state): number | undefined {
    const coinType = state.connectedAccount.chain?.coinType
    let value
    if (EvmCoinTypes.includes(coinType)) {
      value = ChainType.eth
    }
    else if ([CoinType.trx].includes(coinType)) {
      value = ChainType.tron
    }
    return value
  },
  [keys.computedChainId] (state): number | undefined {
    const coinType = state.connectedAccount.chain?.coinType
    return CoinTypeToChainIdMap[coinType]
  }
}

export const ME_KEYS = augmentKeys(keys, keys.namespace)
