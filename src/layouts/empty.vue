<template>
  <div :class="['layout-empty', {'layout-empty_mobile': isMobile}]">
    <TopNavMobile
      v-if="isMobile"
      search
    />
    <TopNav
      v-else
      search
    />
    <div
      class="layout-empty_container"
    >
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TopNav from '~/components/nav/TopNav.vue'
import TopNavMobile from '~/components/nav/TopNavMobile.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'LayoutEmpty',
  components: {
    TopNav,
    TopNavMobile
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    })
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.layout-empty {
  min-height: 100vh;
  background: $background;

  .layout-empty_container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: $screen_xl;
    min-height: $pc-layout-container-min-height;
    overflow: hidden;
  }

  &.layout-empty_mobile {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);

    .layout-empty_container {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 70px);
    }
  }
}
</style>
