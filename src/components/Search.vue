<template>
  <div
    :class="[
      'search',
      { 'search_mobile': isMobile }
    ]"
    v-click-outside="onClickOutside"
  >
    <transition name="search-container">
      <div
        v-show="active"
        class="search_container"
      >
        <Iconfont
          class="search_icon"
          name="search"
          size="17"
          color="#B0B8BF"
        />
        <input ref="input"
               class="search_input"
               type="text"
               :placeholder="$tt('Search another account')"
               v-model="query"
               @input="onInput"
               @keydown="onKeydown">
        <span
          class="search_appendix"
        >.bit</span>
        <Button
          :loading="searchLoading"
          class="search_button"
          size="small"
          shape="round"
          status="success"
          @click="onSearch">
          {{ $tt('View') }}
        </Button>
      </div>
    </transition>
    <transition name="search-search-mask">
      <div
        v-if="active"
        class="search_mask"
        @click="onClickOutside"
      />
    </transition>
    <span
      class="search_placeholder"
      :class="{ 'search_placeholder_dark': dark }"
      @click="onClickInput"
    >
      <input class="search_placeholder_input">
      <Iconfont
        name="search"
        size="16"
        :color="dark ? '#FFFFFF' : '#5F6570'"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { digitalEmojiUnifiedHandle, toDottedStyle } from '~/modules/tools'
import debounce from 'lodash.debounce'
import Iconfont from '~/components/icon/Iconfont.vue'
// @ts-ignore
import vClickOutside from 'v-click-outside'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, DEBOUNCE_WAIT_TIME } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'Search',
  components: {
    Iconfont,
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  props: {
    dark: {
      type: Boolean,
      required: false
    }
  },
  data () {
    return {
      active: false,
      query: '',
      searchLoading: false
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile,
      computedChainType: ME_KEYS.computedChainType
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
  },
  methods: {
    onClickOutside () {
      this.active = false
    },
    onClickInput () {
      if (!this.active) {
        this.active = true
      }
      window.setTimeout(() => {
        ;(this.$refs.input as HTMLInputElement).focus()
      })
    },
    onInput () {
      this.query = digitalEmojiUnifiedHandle(this.query.toLowerCase())
    },
    onSearch: debounce(async function (this: any) {
      this.searchLoading = true
      let account = this.query
      console.log(account)
      account = account.replace(/\s+/g, '')
      account = account.toLowerCase()
      account = account.replace(/\.bit$/, '')
      account = account + ACCOUNT_SUFFIX
      account = toDottedStyle(account)

      if (!account) {
        this.searchLoading = false
        return
      }
      this.$gtag('event', 'click', {
        event_category: 'search',
        event_label: 'search account',
        value: 1
      })

      try {
        const res = await this.$services.account.accountInfo(account)

        if (res) {
          if ([ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.expired].includes(res.status)) {
            this.$router.push(`/${account}`)
            this.active = false
            this.query = ''
          }
          else if (res.status === ACCOUNT_STATUS.onCross) {
            this.$router.push(`/on-cross/${account}`)
            this.active = false
            this.query = ''
          }
          else if (res.status === ACCOUNT_STATUS.subAccountNotCreated) {
            this.$router.push(`/not-created/${account}`)
            this.active = false
            this.query = ''
          }
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {
            this.$router.push(`/error/${account}`)
            this.active = false
            this.query = ''
          }
          else {
            this.$router.push(`/registerable/${account}`)
            this.active = false
            this.query = ''
          }
        }
        this.searchLoading = false
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeAccountNotExist) {
          this.$router.push(`/registerable/${account}`)
        }
        else {
          this.$router.push(`/error/${account}`)
        }
        this.active = false
        this.query = ''
        this.searchLoading = false
      }
    }, DEBOUNCE_WAIT_TIME),
    onKeydown (event: KeyboardEvent) {
      const keyCode = event.keyCode || event.which
      if (keyCode === 13) {
        this.onSearch()
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.search {
  display: inline-block;

  .search_container {
    display: inline-flex;
    align-items: center;
    border-radius: 42px;
    position: absolute;
    width: max-content;
    left: 0;
    right: 0;
    top: 26px;
    margin: auto;
    padding: 6px 6px 6px 16px;
    background: $input-bg-color;
    z-index: 6;
  }

  .search_icon {
    margin-right: 8px;
  }

  .search_input {
    width: 160px;
    border: 0;
    background: unset;
    outline: 0;
    caret-color: $success-font-color;
    font-size: $font-size-14;

    &::placeholder {
      color: $third-font-color;
    }
  }

  .search_placeholder {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    background: $normal-color;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: $normal-hover-color;
    }
  }

  .search_placeholder_input {
    display: inline-block;
    width: 38px;
    height: 38px;
    border: none;
    opacity: 0;
    position: absolute;
    cursor: pointer;
  }

  .search_appendix {
    margin-left: 16px;
    font-size: $font-size-14;
    font-weight: 400;
    color: $primary-font-color;
    padding: 0 16px 0 8px;
    border-left: 1px solid $normal-color;
  }

  .search_mask {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
    background: rgba(27, 29, 33, 0.7);
    z-index: 5;
  }

  .search_button {
    width: 80px;
  }

  .search-container-enter-active {
    animation: fadeInUp 0.15s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .search-container-leave-active {
    animation: fadeOutDown 0.15s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .search-search-mask-enter-active {
    animation: fadeIn 0.15s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .search-search-mask-leave-active {
    animation: fadeOut 0.15s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  &.search_mobile {
    .search_container {
      top: 16px;
    }

    .search_input {
      width: calc(100vw - 216px);
    }
  }
}
</style>
