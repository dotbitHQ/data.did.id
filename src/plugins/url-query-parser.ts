import { Context } from '@nuxt/types'
import AddressInconsistencyAlert from '~/components/AddressInconsistencyAlert.vue'
import { sleep } from '~/modules/tools'

export default function ({ app, store, query }: Context) {
  const { originAddress, originChainName } = query
  const address = store.state.me.connectedAccount?.address
  const chainName = store.state.me.connectedAccount?.chain?.name
  if (originAddress && originChainName && address && chainName) {
    if (originAddress !== address || originChainName !== chainName) {
      const _instance = new AddressInconsistencyAlert({
        propsData: {
          showing: false,
          $tt: app.$tt,
          $walletSdk: app.$walletSdk,
          $router: store.$router,
          originAddress: originAddress,
          originChainName: originChainName,
          address: address,
          chainName: chainName
        }
      })
      const _vm = _instance.$mount()
      _instance.$on('close', async () => {
        _instance.showing = false
        await sleep(200)
        document.body.removeChild(_vm.$el)
      })
      document.body.appendChild(_vm.$el)
      _instance.showing = true
    }
  }
}
