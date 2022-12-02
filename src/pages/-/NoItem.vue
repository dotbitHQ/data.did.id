<template>
  <span :class="['no-item', {'no-item_mobile': isMobile}]">
    <img
      v-if="recordType === ParsingRecordType.address"
      class="no-item_img"
      src="/images/no-addresses.svg"
    >
    <img
      v-else-if="recordType === ParsingRecordType.customKey"
      class="no-item_img"
      src="/images/no-custom.svg"
    >
    <img
      v-else-if="recordType === ParsingRecordType.dweb"
      class="no-item_img"
      src="/images/no-dweb.svg"
    >
    <img
      v-else-if="recordType === ParsingRecordType.profile"
      class="no-item_img"
      src="/images/no-profile.svg"
    >
    <div
      class="no-item_action"
      @click="addNewRecord"
    >
      {{ $tt('No items yet.') }}
      <span class="no-item_action_add">{{ $tt('Add') }}</span>
    </div>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { ParsingRecordType } from '~/services/Account'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'NoItem',
  props: {
    recordType: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      ParsingRecordType
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  },
  methods: {
    addNewRecord () {
      this.$emit('click', this.recordType)
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.no-item {
  font-size: $font-size-16;
  font-weight: 500;
  color: $primary-font-color;
  text-align: center;

  .no-item_img {
    width: 114px;
  }

  .no-item_action {
    margin-top: 20px;
    cursor: pointer;
  }

  .no-item_action_add {
    color: $primary-color;

    &:hover {
      opacity: 0.7;
    }
  }

  &.no-item_mobile {
  }
}
</style>
