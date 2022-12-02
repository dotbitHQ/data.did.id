<template>
  <div :class="['layout-default', {'layout-default_mobile': isMobile}]">
    <div class="layout-default_background" />
    <TopNavMobile
      v-if="isMobile"
      dark
      search
    />
    <TopNav
      v-else
      dark
      search
    />
    <div class="layout-default__container">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import TopNav from '~/components/nav/TopNav.vue'
import TopNavMobile from '~/components/nav/TopNavMobile.vue'
import Footer from '~/components/Footer.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    TopNav,
    TopNavMobile,
    Footer
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.layout-default {
  min-height: 100vh;
  background: $background;

  .layout-default_background {
    width: 100%;
    height: 426px;
    background: $assist-color;
    position: absolute;
  }

  .layout-default__container {
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: $screen_xl;
    min-height: $pc-layout-container-min-height;
  }

  &.layout-default_mobile {
    margin-bottom: constant(safe-area-inset-bottom);
    margin-bottom: env(safe-area-inset-bottom);

    .layout-default_background {
      height: 316px;
      border-radius: 0 0 16px 16px;
    }

    .layout-default__container {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 70px);
    }
  }
}
</style>
