<template>
  <div :class="['warning-alert', {'warning-alert_mobile': isMobile}]">
    <Iconfont
      name="tips"
      size="16"
      color="#E05656"
    />
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'WarningAlert',
  components: {
    Iconfont,
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    })
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.warning-alert {
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  padding: 8px;
  background: #FCECEC;
  border-radius: 8px;
  font-size: $font-size-14;
  font-weight: 400;
  color: $error-font-color;
  line-height: 14px;
  word-break: break-word;
  hyphens: auto;

  &.warning-alert_mobile {

  }
}
</style>
