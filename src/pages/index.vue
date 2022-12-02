<template>
  <div :class="['index', {'index_mobile': isMobile}]">
    <div class="index_search-tips">
      <i18n
        class="index_search-tips_title"
        tag="div"
        path="首页标题"
        :i18nkey="$tt('首页标题')">
        <template slot="web3">
          <span class="index_search-tips_title_tag">Web3</span>
        </template>
      </i18n>
      <HomeSearch />
      <div class="index_commend">
        e.g.
        <NuxtLink
          v-for="item in commendList"
          :key="item.account"
          class="index_commend_item"
          :to="`/${item.account}`"
          :style="{ background: item.background }">
          {{ item.account }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import HomeSearch from '~/pages/-/HomeSearch.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'Index',
  layout: 'index',
  components: {
    HomeSearch,
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    commendList (): any {
      const listMobile = [{
        account: 'bestcase.bit',
        background: '#9CEAEC'
      }, {
        account: 'web3club.bit',
        background: '#9CECB2'
      }]

      const list = [{
        account: 'bestcase.bit',
        background: '#9CEAEC'
      }, {
        account: 'web3club.bit',
        background: '#9CECB2'
      }]

      return this.isMobile ? listMobile : list
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.index {
  .index_search-tips {
    position: absolute;
    top: 24vh;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 686px;
    z-index: 1;
  }

  .index_search-tips_title {
    width: 605px;
    margin-bottom: 68px;
    font-size: 48px;
    font-weight: 800;
    color: $primary-font-color;
    line-height: 56px;
    text-align: center;
  }

  .index_search-tips_title_tag {
    color: $success-font-color;
  }

  .index_commend {
    margin-top: 16px;
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    color: $third-font-color;
    align-items: center;
  }

  .index_commend_item {
    display: inline-block;
    border-radius: 18px;
    padding: 4px 12px;
    font-weight: 500;
    color: $primary-font-color;

    &:hover {
      opacity: 0.7;
    }
  }

  &.index_mobile {

    .index_search-tips {
      margin-top: 46px;
      position: unset;
      width: unset;
    }

    .index_search-tips_title {
      margin-bottom: 32px;
      font-size: 20px;
      line-height: 23px;
      width: 279px;
    }
  }
}
</style>
