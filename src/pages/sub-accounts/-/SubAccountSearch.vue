<template>
  <div
    v-click-outside="onClickOutside"
    :class="[
      'sub-account-search',
      { '_active': active || !!query }
    ]"
    @click="onClickInput"
  >
    <div class="sub-account-search_container">
      <Iconfont
        class="sub-account-search_icon"
        name="search"
        size="14"
        color="#B0B8BF"
      />
      <input
        ref="input"
        v-model="query"
        :placeholder="$tt('Search')"
        class="sub-account-search_input"
        type="text"
        @keydown="onKeydown"
        @input="onSearch"
      >
      <span
        v-if="active"
        class="sub-account-search_cancel"
        @click.stop="onCancel"
      >{{ $tt('Cancel') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from 'lodash.debounce'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import { digitalEmojiUnifiedHandle, toDottedStyle } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import { ACCOUNT_SUFFIX, DEBOUNCE_WAIT_TIME } from '~/constant'

export default Vue.extend({
  name: 'Search',
  components: {
    Iconfont
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  data () {
    return {
      active: false,
      query: ''
    }
  },
  methods: {
    onClickOutside () {
      this.active = false
      this.$emit('focus', this.active)
    },
    onClickInput () {
      if (!this.active) {
        this.active = true
      }
      window.setTimeout(() => {
        ;(this.$refs.input as HTMLInputElement).focus()
      })
      this.$emit('focus', this.active)
    },
    onSearch () {
      this.query = digitalEmojiUnifiedHandle(this.query)
      this.onDebounceSearch()
    },
    onDebounceSearch: debounce(function (this: any) {
      let account = this.query
      account = account.replace(/\s+/g, '')
      account = account.toLowerCase()
      if (!/\.bit$/.test(account) || account.includes('#')) {
        account = account.replace(/\.bit$/, '')
        account = account + ACCOUNT_SUFFIX
        account = toDottedStyle(account)
        account = account.replace(/\.bit$/, '')
      }
      this.$emit('search', account)
    }, DEBOUNCE_WAIT_TIME),
    onKeydown (event: KeyboardEvent) {
      const keyCode = event.keyCode || event.which
      if (keyCode === 13) {
        this.onSearch()
      }
    },
    onCancel () {
      this.query = ''
      this.$emit('search', '')
      this.active = false
      this.$emit('focus', this.active)
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.sub-account-search {
  display: inline-block;

  .sub-account-search_container {
    position: relative;
    padding: 10px 12px;
    display: inline-flex;
    align-items: center;
    height: 24px;
    color: $third-font-color;
    border-radius: 22px;
  }

  .sub-account-search_icon {
    margin-right: 8px;
  }

  .sub-account-search_input {
    flex: 1;
    width: 50px;
    border: 0;
    background: unset;
    outline: 0;
    font-weight: 600;
    caret-color: $success-font-color;

    &::placeholder {
      color: $third-font-color;
      font-weight: 600;
    }
  }

  .sub-account-search_cancel {
    margin-left: 10px;
    padding: 4px 7px;
    font-size: $font-size-14;
    background: #D2D6D9;
    cursor: pointer;
    border-radius: 12px;
    color: $assist-font-color;
    font-weight: 500;
  }

  &._active {
    flex: 1;

    .sub-account-search_container {
      padding: 10px 12px 10px 12px;
      display: flex;
      background: $normal-color;
    }

    .sub-account-search_input {
      width: unset;
    }
  }
}
</style>
