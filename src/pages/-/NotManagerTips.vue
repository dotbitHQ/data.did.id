<template>
  <Dialog
    :showing="showing"
    :title="$tt('Tips')"
    closeButton
    @close="onClose"
  >
    <div>
      {{ $tt("You are not the manager.") }}
    </div>
    <div
      v-if="connectedAccount.address"
      class="not-manager-tips__address"
    >
      {{ $tt("Currently connected wallet:") }}
      <span class="not-manager-tips__connected-address">{{ connectedAccount.address }}</span>
    </div>
    <template #action>
      <div class="not-manager-tips__buttons">
        <Button
          shape="round"
          status="primary"
          @click="onConnectWallet"
        >
          {{ connectedAccount.address ? $tt('Switch wallet') : $tt('Connect wallet') }}
        </Button>
        <Button
          shape="round"
          status="success"
          @click="onClose"
        >
          {{ $tt('OK') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'NotManagerTips',
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
    account: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onConnectWallet () {
      this.$walletSdk.walletsConnect()
    },
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.not-manager-tips__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 8px;
}

.not-manager-tips__address {
  margin-top: 4px;
  word-break: break-word;
}

.not-manager-tips__connected-address {
  color: $assist-font-color;
}
</style>
