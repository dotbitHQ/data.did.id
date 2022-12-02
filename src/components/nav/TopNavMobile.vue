<template>
  <div class="top-nav-mobile">
    <div class="top-nav-mobile_container">
      <img
        class="top-nav-mobile_logo"
        src="/images/components/das-logo-mobile.png"
        alt="logo"
        @click="onLinkDid"
      >
      <span class="top-nav-mobile_actions">
        <Search
          v-if="search"
          class="top-nav-mobile_search"
          :dark="dark"
        />
        <span
          class="top-nav-mobile_go-home"
          @click="goHome"
        >
          <Iconfont
            name="home"
            size="16"
            :color="dark ? '#FFFFFF' : '#5F6570'"
          />
        </span>
<!--        <LangSwitcher-->
<!--          class="top-nav-mobile_lang-switcher"-->
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
import config from '~~/config'
import WalletConnectButton from '~/components/WalletConnectButton.vue'

export default defineComponent({
  name: 'TopNavMobile',
  components: {
    Search,
    Iconfont,
    WalletConnectButton,
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

.top-nav-mobile {
  .top-nav-mobile_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    height: 70px;
  }

  .top-nav-mobile_search {
    margin-right: 8px;
  }

  .top-nav-mobile_logo {
    height: 28px;
    z-index: 1;
  }

  .top-nav-mobile_actions {
    display: flex;
    z-index: 1;
  }

  .top-nav-mobile_lang-switcher {
    margin-right: 8px;
  }

  .top-nav-mobile_go-home {
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
