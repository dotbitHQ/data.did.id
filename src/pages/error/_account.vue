<template>
  <div :class="['account-error', {'account-error_mobile': isMobile}]">
    <img
      class="account-error_search-results-logo"
      src="/images/search-results-placeholder.png"
    />
    <i18n
      tag="h1"
      class="account-error_title"
      path="错误标题"
      :i18nkey="$tt('错误标题')">
      <template slot="account">
        <span class="account-error_title_account">{{ account }}</span>
      </template>
    </i18n>
    <i18n
      tag="div"
      class="account-error_desc"
      path="开放规则"
      :i18nkey="$tt('开放规则')">
      <template slot="link">
        <a
          href="https://docs.did.id/register-das/open-registration-rules"
          target="_blank"
          class="account-error_desc_link"
        >{{ $tt('here') }}</a>
      </template>
    </i18n>
    <div class="account-error_actions">
      <Button
        class="account-error_button"
        :block="isMobile"
        size="small"
        shape="round"
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
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX } from '~/constant'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'AccountError',
  layout: 'empty',
  components: {
    Button
  },
  data () {
    return {
      account: this.$route.params.account
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
          if (res.status === ACCOUNT_STATUS.subAccountNotCreated) {
            this.$router.replace(`/not-created/${query}`)
          }
          else if (res.status === ACCOUNT_STATUS.onCross) {
            this.$router.replace(`/on-cross/${query}`)
          }
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {}
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

.account-error {
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

  .account-error_title {
    padding: 0 200px;
    margin-bottom: 12px;
    font-size: $font-size-36;
    color: $third-font-color;
    line-height: 42px;
    word-break: break-word;
    text-align: center;
    hyphens: auto;
    font-weight: 800;
  }

  .account-error_title_account {
    color: $primary-font-color;
  }

  .account-error_desc {
    text-align: center;
    padding: 0 200px;
    margin-bottom: 24px;
    font-size: $font-size-14;
    line-height: 16px;
    font-weight: 500;
    color: $assist-font-color;
  }

  .account-error_button {
    width: 158px;
  }

  .account-error_desc_link {
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  .account-error_search-results-logo {
    margin-bottom: 24px;
    width: 152px;
  }

  &.account-error_mobile {
    position: unset;
    height: 72vh;
    width: unset;
    margin: 16px;
    text-align: center;

    .account-error_title {
      padding: 0 32px;
      font-size: $font-size-24;
      line-height: 28px;
    }

    .account-error_desc {
      padding: 0 32px;
      line-height: 16px;
    }

    .account-error_actions {
      text-align: center;
    }

    .account-error_button {
      width: 150px;
    }

    .account-error_search-results-logo {
      width: 96px;
    }
  }
}
</style>
