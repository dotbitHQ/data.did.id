<template>
  <Dialog
    :showing="showing"
    :title="$tt('Tips')"
    closeButton
    @close="onClose"
  >
    {{ $tt('You have set up a pricing plan for your SubDIDs on SuperDID, please go to SuperDID to register SubDIDs. You can also come back to this page to mint SubDIDs after you have cancelled the pricing plan on SuperDID.') }}
    <template #action>
      <Button
        shape="round"
        block
        status="success"
        @click="goToSuperDID"
      >
        {{ $tt('Go to SuperDID') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import config from '~~/config'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'SetCustomScriptTips',
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
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    goToSuperDID () {
      const link = `${config.superDid}/manage/sub-account/?nav=${this.account}&tab=PricingScheme`
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
