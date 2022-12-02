<template>
  <Dialog
    :showing="showing"
    :title="$tt('Address Inconsistency')"
    closeButton
    @close="onClose"
  >
    <div>{{ $tt('The address or public chain of the current connection does not match the application that jumped over.') }}</div>
    <div class="address-inconsistency-alert_address-info">
      <div>{{ $tt('Current login address and public chain:', { address: address, chainName: chainName }) }}</div>
      <div class="address-inconsistency-alert_address">
        {{ address }}
        <span class="address-inconsistency-alert_chain-name">({{ chainName }})</span>
      </div>
    </div>
    <div class="address-inconsistency-alert_address-info">
      <div>{{ $tt('The address and public chain of the jumped over application login:', { address: address, chainName: chainName }) }}</div>
      <div class="address-inconsistency-alert_address">
        {{ originAddress }}
        <span class="address-inconsistency-alert_chain-name">({{ originChainName }})</span>
      </div>
    </div>
    <template #action>
      <Button
        shape="round"
        block
        status="success"
        @click="onConnectWallet"
      >
        {{ $tt('Switch wallet') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import VueRouter from 'vue-router'

export default Vue.extend({
  name: 'AddressInconsistencyAlert',
  components: {
    Dialog,
    Button
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: true
    },
    $tt: {
      type: Function as PropType<(key: string, params?: Record<string, string| number>) => string>,
      required: true
    },
    $router: {
      type: Object as PropType<VueRouter>,
    },
    originAddress: String,
    originChainName: String,
    address: String,
    chainName: String,
    $walletSdk: Object
  },
  methods: {
    onClose () {
      this.$emit('close', false)
      this.$router.replace({
        query: {}
      })
    },
    onConnectWallet () {
      this.onClose()
      this.$walletSdk.walletsConnect()
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.address-inconsistency-alert_address-info {
  margin-top: 8px;
}

.address-inconsistency-alert_chain-name {
  color: $assist-font-color;
}

.address-inconsistency-alert_address {
  font-weight: 600;
  word-break: break-word;
}
</style>
