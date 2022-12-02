<template>
  <Dialog
    :showing="showing"
    :title="'💰 ' + $tt('Insufficient balance')"
    closeButton
    @close="onClose"
  >
    <div>{{ $tt('Insufficient balance. Please check your balance.') }}</div>
    <template #action>
      <Button
        shape="round"
        block
        status="success"
        @click="onManageBalance"
      >
        {{ $tt('Manage Balance') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import config from '~~/config'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { mapGetters } from 'vuex'
import { COMMON_KEYS } from '~/store/common'
import { IConnectedAccount, ME_KEYS } from '~/store/me'

export default Vue.extend({
  name: 'InsufficientBalanceDialog',
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
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile,
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onManageBalance () {
      const address = this.connectedAccount?.address
      const chainName = this.connectedAccount?.chain?.name
      const link = `${config.dotbitBalance}?originAddress=${address}&originChainName=${chainName}`
      if (this.isMobile) {
        window.location.href = link
      }
      else {
        window.open(link)
      }
      this.onClose()
    }
  }
})
</script>
