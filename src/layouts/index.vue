<template>
  <div :class="['layout-index', {'layout-index_mobile': isMobile}]">
    <TopNavMobile v-if="isMobile" />
    <TopNav v-else />
    <div class="layout-index_container">
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TopNav from '~/components/nav/TopNav.vue'
import TopNavMobile from '~/components/nav/TopNavMobile.vue'
import { mapGetters } from 'vuex'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'LayoutIndex',
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

.layout-index {
  min-height: 100vh;
  background: $background;

  .layout-index_container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: $screen_xl;
    min-height: $pc-layout-container-min-height;
    overflow: hidden;
  }

  &.layout-index_mobile {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);

    .layout-index_container {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 70px);
    }
  }
}
</style>
