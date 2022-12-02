<template>
  <div class="top-nav">
    <div class="top-nav_container">
      <img
        class="top-nav_logo"
        :src="dark ? '/images/components/bit-logo-light.png' : '/images/components/bit-logo-dark.png'"
        alt="logo"
        @click="onLinkDid"
      >
      <span class="top-nav_actions">
        <Search
          v-if="search"
          class="top-nav_search"
          :dark="dark"
        />
        <span
          class="top-nav_go-home"
          @click="goHome"
        >
          <Iconfont
            name="home"
            size="16"
            :color="dark ? '#FFFFFF' : '#5F6570'"
          />
        </span>
<!--        <LangSwitcher-->
<!--          class="top-nav_lang-switcher"-->
<!--          :dark="dark"-->
<!--        />-->
        <WalletConnectButton />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Search from '~/components/Search.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import LangSwitcher from '~/components/LangSwitcher.vue'
import config from '~~/config'
import WalletConnectButton from '~/components/WalletConnectButton.vue'

export default defineComponent({
  name: 'TopNav',
  components: {
    Search,
    Iconfont,
    LangSwitcher,
    WalletConnectButton
  },
  props: {
    search: {
      type: Boolean,
      required: false
    },
    dark: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    goHome () {
      window.location.href = `${config.dotbitApp}/me`
    },
    onLinkDid () {
      window.location.href = 'https://did.id'
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.top-nav {
  .top-nav_container {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 104px;
    max-width: $screen_xl;
  }

  .top-nav_logo {
    display: inline-block;
    height: 28px;
    cursor: pointer;
    z-index: 1;
  }

  .top-nav_search {
    margin-right: 8px;
  }

  .top-nav_lang-switcher {
    margin-right: 8px;
  }

  .top-nav_actions {
    display: flex;
    z-index: 1;
  }

  .top-nav_go-home {
    margin-right: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    background: $normal-color;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: $normal-hover-color;
    }
  }
}
</style>
