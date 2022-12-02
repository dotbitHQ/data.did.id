<template>
  <div :class="['not-created', {'not-created_mobile': isMobile}]">
    <img
      class="not-created_search-results-logo"
      src="/images/search-results-placeholder.png"
    />
    <i18n
      tag="h1"
      class="not-created_title"
      path="子账户不存在"
      :i18nkey="$tt('子账户不存在')">
      <template slot="account">
        <span class="not-created_title_account">{{ account }}</span>
      </template>
    </i18n>
    <div class="not-created_actions">
      <Button
        class="not-created_button"
        shape="round"
        size="small"
        @click="onBack"
      >
        {{ $tt('Back') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Button from '~/components/Button.vue'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX } from '~/constant'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'NotCreated',
  layout: 'empty',
  components: {
    Button
  },
  data () {
    return {
      account: this.$route.params.account,
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      isMobile: COMMON_KEYS.isMobile,
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    }
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    onBack () {
      window.history.back()
    },
    async onSearch () {
      let query = this.account.replace(/\s+/g, '')
      query = query.replace(/\.bit$/, '')
      query = query + ACCOUNT_SUFFIX

      if (!query) {
        return
      }

      try {
        const res = await this.$services.account.accountInfo(query)

        if (res) {
          if (res.status === ACCOUNT_STATUS.subAccountNotCreated) {}
          else if (res.status === ACCOUNT_STATUS.onCross) {
            this.$router.replace(`/on-cross/${query}`)
          }
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {
            this.$router.replace(`/error/${query}`)
          }
          else if (![ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.expired].includes(res.status)) {
            this.$router.replace(`/registerable/${query}`)
          }
          else {
            this.$router.push(`/${query}`)
          }
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeAccountNotExist) {
          this.$router.push(`/registerable/${query}`)
        }
        else {
          this.$router.push(`/error/${query}`)
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.not-created {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: $white;
  border-radius: 18px;
  width: 1168px;
  height: 520px;
  box-shadow: $container-outer-box-shadow;
  border: $container-border;

  .not-created_title {
    padding: 0 200px;
    margin-bottom: 24px;
    font-size: $font-size-36;
    color: $third-font-color;
    line-height: 42px;
    word-break: break-word;
    text-align: center;
    hyphens: auto;
    font-weight: 800;
  }

  .not-created_title_account {
    color: $primary-font-color;
  }

  .not-created_button {
    width: 150px;
  }

  .not-created_search-results-logo {
    margin-bottom: 24px;
    width: 152px;
  }

  &.not-created_mobile {
    position: unset;
    height: 72vh;
    width: unset;
    margin: 16px;
    text-align: center;

    .not-created_title {
      padding: 0 32px;
      font-size: $font-size-24;
      line-height: 28px;
    }

    .not-created_actions {
      margin: 0 32px;
      width: calc(100% - 64px);
    }

    .not-created_button {
      width: 100%;
    }

    .not-created_search-results-logo {
      width: 96px;
    }
  }
}
</style>
