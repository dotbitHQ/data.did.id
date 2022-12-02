<template>
  <Button
    status="primary"
    size="small"
    class="wallet-connect-button"
    @click="onConnectWallet"
  >
    <client-only>
      <span
        v-if="loggedIn"
        class="wallet-connect-button__address"
      >
        <Iconfont
          class="wallet-connect-button__address__icon"
          :name="connectedAccount.chain && connectedAccount.chain.icon"
          size="24"
        />
        <div v-if="reverseRecord.account && reverseRecord.is_valid">
          {{ reverseRecord.account && reverseRecord.account.length > 16 ? collapseString(toHashedStyle(reverseRecord.account), 6, 9) : toHashedStyle(reverseRecord.account) }}
          <div class="wallet-connect-button__reverse-record__address">
            {{ collapseString(connectedAccount.address, 6, 6) }}
          </div>
        </div>
        <template v-else>{{ collapseString(connectedAccount.address, 6, 6) }}</template>
      </span>
      <span
        v-else
        class="wallet-connect-button__connect-wallet"
      >{{ $tt('Connect Wallet') }}</span>
    </client-only>
  </Button>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { collapseString, toHashedStyle } from '~/modules/tools'
import { IReverseLatestRes } from '~/services/Account'
import Button from '~/components/Button.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'WalletConnectButton',
  components: {
    Button,
    Iconfont
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    ...mapState({
      me: ME_KEYS.namespace
    }),
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    reverseRecord (): IReverseLatestRes {
      return this.me.reverseRecord
    }
  },
  mounted () {
    this.$store.dispatch(ME_KEYS.fetchReverseRecord)
  },
  methods: {
    toHashedStyle,
    collapseString,
    onConnectWallet () {
      this.$walletSdk.walletsConnect()
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.wallet-connect-button {

  .wallet-connect-button__address {
    display: flex;
    align-items: center;
    font-size: $font-size-14;
    font-weight: 500;
    color: $white;
    line-height: 16px;
    text-align: left;
  }

  .wallet-connect-button__address__icon {
    margin-right: 8px;
  }

  .wallet-connect-button__reverse-record__address {
    font-size: $font-size-12;
    color: rgba(237, 240, 242, 0.6);
    line-height: 14px;
    font-weight: 500;
    text-align: left;
  }

  .wallet-connect-button__connect-wallet {
    font-weight: 500;
  }
}
</style>
