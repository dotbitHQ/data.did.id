import { ActionTree, GetterTree, MutationTree } from 'vuex'
import cookie from 'js-cookie'
import { augmentKeys } from '~/modules/tools'
import { IConfig, IToken } from '~/services/Common'
import { matchLanguage } from '~/plugins/i18n'
import { LANGUAGE, LanguageOptions } from '~/constant/language'
import { CKB, DASBalanceTokenId } from '~/constant/chain'

const keys = {
  namespace: 'common',
  // mutations
  setConfig: 'setConfig',
  setLanguage: 'setLanguage',
  setTokens: 'setTokens',
  setHardwareWalletTipsShow: 'setHardwareWalletTipsShow',
  setTorusLoginSuccessTipsShow: 'setTorusLoginSuccessTipsShow',
  setMobile: 'setMobile',
  // actions
  fetchConfig: 'fetchConfig',
  fetchTokens: 'fetchTokens',
  // getters
  computedLanguage: 'computedLanguage',
  isMobile: 'isMobile'
}

export const state = () => ({
  version: '0.0.1',
  language: '',
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  config: {
    sale_cell_capacity: 0,
    min_sell_price: 0,
    offer_cell_capacity: 0,
  } as IConfig,
  tokens: [] as IToken[],
  hardwareWalletTipsShow: true,
  torusLoginSuccessTipsShow: undefined,
  isMobile: false
})

export type CommonState = ReturnType<typeof state>

export const mutations: MutationTree<CommonState> = {
  [keys.setTokens]: (state, tokens: IToken[]) => {
    state.tokens = tokens
  },
  [keys.setConfig]: (state, config: IConfig) => {
    state.config = config
  },
  [keys.setHardwareWalletTipsShow]: (state, value: boolean) => {
    state.hardwareWalletTipsShow = value
  },
  [keys.setTorusLoginSuccessTipsShow]: (state, value: boolean) => {
    // @ts-ignore
    state.torusLoginSuccessTipsShow = value
  },
  [keys.setMobile]: (state, value: boolean) => {
    state.isMobile = value
  }
}

export const actions: ActionTree<CommonState, CommonState> = {
  async [keys.fetchTokens] ({ commit }) {
    try {
      const res = await this.$services.common.tokens()
      if (res && res.token_list && res.token_list.length > 0) {
        let portalWalletCkb = res.token_list.find((option: IToken) => {
          return option.token_id === CKB.tokenId
        })

        const otherToken = res.token_list.filter((option: IToken) => {
          return option.token_id !== CKB.tokenId
        })

        // @ts-ignore
        portalWalletCkb = {
          ...portalWalletCkb,
          name: 'Portal Wallet'
        }

        commit(keys.setTokens, res && [...otherToken, {
          ...portalWalletCkb,
          logo: '/images/components/das-balance.svg',
          name: '.bit Balance',
          token_id: DASBalanceTokenId
        }, portalWalletCkb])
      }
    }
    catch (err) {
      console.error(err)
      throw err
    }
  },
  async [keys.fetchConfig] ({ commit }) {
    try {
      const res = await this.$services.common.config()
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

export const getters: GetterTree<CommonState, CommonState> = {
  [keys.computedLanguage] (state) {
    const ua = window.navigator.userAgent.match(/Language\/([a-zA-Z-_]+)/)
    const query = window.location.search.match(/[&?]lang=([a-zA-Z-_]+)/)
    const uaLanguage = ua?.[1]
    const queryLanguage = query?.[1]

    return matchLanguage(
      localStorage.getItem('lang') || cookie.get('lang') || state.language || queryLanguage || uaLanguage || window.navigator.language,
      LanguageOptions,
      LANGUAGE.en
    )
  },
  [keys.isMobile] (state): boolean {
    return state.isMobile
  }
}

export const COMMON_KEYS = augmentKeys(keys, keys.namespace)
