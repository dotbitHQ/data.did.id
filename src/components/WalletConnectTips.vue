<template>
  <div
    v-if="connectedAccount.protocol === WalletProtocol.walletConnect"
    class="wallet-connect-tips"
  >
    {{ $tt('Working with WalletConnect') }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { WalletProtocol } from '~/constant'

export default defineComponent({
  name: 'DasTips',
  data () {
    return {
      WalletProtocol
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.wallet-connect-tips {
  font-size: $font-size-12;
  font-weight: 500;
  color: $third-font-color;
  text-align: center;
  padding: 10px 0;
}
</style>
