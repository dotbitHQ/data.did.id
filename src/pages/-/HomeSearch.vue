<template>
  <div
    :class="['home-search', {'home-search_mobile': isMobile}]"
    @click="onClickInput"
  >
    <div
      class="home-search_container"
    >
      <Iconfont
        v-show="!isMobile"
        class="home-search_icon"
        name="search"
        size="17"
        color="#B0B8BF"
      />
      <input
        ref="input"
        v-model="query"
        class="home-search_input"
        :placeholder="$tt('Enter dotbit account')"
        type="text"
        @input="onInput"
        @keydown="onKeydown">
      <span
        v-show="!isMobile"
        class="home-search_appendix"
      >.bit</span>
      <Button
        :loading="searchLoading"
        class="home-search_button"
        shape="round"
        size="middle"
        status="success"
        @click="onSearch">
        {{ $tt('View') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { digitalEmojiUnifiedHandle, toDottedStyle } from '~/modules/tools'
import debounce from 'lodash.debounce'
import Iconfont from '~/components/icon/Iconfont.vue'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, DEBOUNCE_WAIT_TIME } from '~/constant'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'HomeSearch',
  components: {
    Iconfont,
  },
  data () {
    return {
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
    onClickInput () {
      window.setTimeout(() => {
        ;(this.$refs.input as HTMLInputElement).focus()
      })
    },
    onInput () {
      this.query = digitalEmojiUnifiedHandle(this.query.toLowerCase())
    },
    onSearch: debounce(async function (this: any) {
      this.searchLoading = true
      console.log(this.query)
      let account = this.query
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
            this.query = ''
          }
          else if (res.status === ACCOUNT_STATUS.onCross) {
            this.$router.push(`/on-cross/${account}`)
            this.query = ''
          }
          else if (res.status === ACCOUNT_STATUS.subAccountNotCreated) {
            this.$router.push(`/not-created/${account}`)
            this.query = ''
          }
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {
            this.$router.push(`/error/${account}`)
            this.query = ''
          }
          else {
            this.$router.push(`/registerable/${account}`)
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

.home-search {
  display: inline-block;

  .home-search_container {
    display: flex;
    align-items: center;
    padding: 8px 8px 8px 20px;
    background: $white;
    box-shadow: $container-outer-box-shadow;
    border-radius: 30px;
    border: $container-border;
  }

  .home-search_icon {
    margin-right: 12px;
  }

  .home-search_input {
    width: 444px;
    border: 0;
    background: unset;
    outline: 0;
    caret-color: $success-font-color;
    font-size: 20px;

    &::placeholder {
      color: $third-font-color;
    }
  }

  .home-search_appendix {
    margin-left: 16px;
    color: $primary-font-color;
    padding: 0 24px 0 8px;
    border-left: 1px solid $normal-color;
    font-size: $font-size-24;
    font-weight: 500;
  }

  .home-search_button {
    width: 102px;
  }

  &.home-search_mobile {
    .home-search_input {
      width: 212px;
    }
  }
}
</style>
