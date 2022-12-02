<template>
  <div :class="['footer', {'footer_mobile': isMobile}]">
    <div>
      <a
        class="footer_link"
        href="https://docs.did.id/projects/data.did.id"
        target="_blank"
      >{{ $tt('Developer Guide') }}</a>
      •
      <a
        class="footer_link"
        :href="dotbitApp"
        :target="isMobile ? '_self' : '_blank'"
      >{{ $tt('Register .bit') }}</a>
    </div>
    <div class="footer_tips">{{ $tt('Take your data sovereignty back with .bit') }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { dotbitApp } from '~~/config'
import { mapGetters } from 'vuex'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'Footer',
  data () {
    return {
      dotbitApp
    }
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

.footer {
  padding: 40px 38px 44px 38px;
  text-align: center;
  color: $assist-font-color;

  .footer_link {
    font-size: $font-size-14;
    font-weight: bold;
    color: $assist-font-color;
    line-height: 16px;

    &:hover {
      opacity: 0.7;
    }
  }

  .footer_tips {
    margin-top: 12px;
    font-weight: 400;
    font-size: $font-size-14;
    line-height: 17px;
    color: $assist-font-color;
  }

  &.footer_mobile {
    padding: 40px 38px 44px 38px;
  }
}
</style>
