<template>
  <Dialog
    :showing="showing"
    :title="$tt('Details')"
    closeButton
    enableCloseAction
    @close="onClose"
  >
    <div class="record-details_item">
      <div class="record-details_item_label">{{ $tt('Custom Key') }}</div>
      <div class="record-details_value">{{ recordDetails.key }}</div>
    </div>
    <div class="record-details_item">
      <div class="record-details_item_label">{{ $tt('Custom Value') }}</div>
      <a
        v-if="/^https?:\/\/.+/.test(recordDetails.value)"
        class="record-details_item_link record-details_value"
        :href="recordDetails.value"
        target="_blank"
      >
        {{ recordDetails.value }}
      </a>
      <div
        v-else
        class="record-details_value"
      >
        {{ recordDetails.value }}
      </div>
    </div>
    <div
      v-if="recordDetails.label"
      class="record-details_item record-details_margin-bottom-0"
    >
      <div class="record-details_item_label">{{ $tt('Label') }}</div>
      <div class="record-details_value">{{ recordDetails.label }}</div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Dialog from '~/components/Dialog.vue'
import { IAccountParsingRecord } from '~/services/Account'
import { mapGetters } from 'vuex'
import { COMMON_KEYS } from '~/store/common'

export default Vue.extend({
  name: 'RecordDetails',
  components: {
    Dialog,
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    recordDetails: {
      type: Object as PropType<IAccountParsingRecord>,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  },
  methods: {
    onClose () {
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.record-details_item {
  margin-bottom: 32px;
}

.record-details_item_label {
  margin-bottom: 8px;
  font-size: $font-size-14;
  font-weight: 800;
  color: $primary-font-color;
  line-height: 16px;
  text-transform: capitalize;
  word-break: break-word;
  hyphens: auto;
}

.record-details_value {
  word-wrap: break-word;
  hyphens: auto;
  font-size: $font-size-14;
  font-weight: 500;
  color: $tips-font-color;
  line-height: 16px;
}

.record-details_margin-bottom-0 {
  margin-bottom: 0;
}
</style>
