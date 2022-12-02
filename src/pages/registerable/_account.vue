<template>
  <div :class="['account-registerable', {'account-registerable_mobile': isMobile}]">
    <img
      class="account-registerable_search-results-logo"
      src="/images/search-results-placeholder.png"
    />
    <i18n
      tag="h1"
      class="account-registerable_title"
      path="可注册标题"
      :i18nkey="$tt('可注册标题')">
      <template slot="account">
        <span class="account-registerable_title_account">{{ account }}</span>
      </template>
    </i18n>
    <div class="account-registerable_actions">
      <Button
        class="account-registerable_actions_button"
        size="small"
        shape="round"
        @click="onBack"
      >
        {{ $tt('Back') }}
      </Button>
      <Button
        class="account-registerable_actions_button"
        size="small"
        shape="round"
        status="success"
        @click="onRegister"
      >
        {{ $tt('Register') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Button from '~/components/Button.vue'
import config from '~~/config'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX } from '~/constant'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'AccountRegisterable',
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
    onRegister () {
      window.location.href = `${config.dotbitApp}/account/register/${this.account}`
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
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {
            this.$router.replace(`/error/${query}`)
          }
          else if (![ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.expired].includes(res.status)) {}
          else {
            this.$router.push(`/${query}`)
          }
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code !== errno.apiErrorCodeAccountNotExist) {
          this.$router.replace(`/error/${query}`)
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.account-registerable {
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

  .account-registerable_title {
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

  .account-registerable_title_account {
    color: $primary-font-color;
  }

  .account-registerable_actions {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
  }

  .account-registerable_actions_button {
    width: 150px;
  }

  .account-registerable_search-results-logo {
    margin-bottom: 24px;
    width: 152px;
  }

  &.account-registerable_mobile {
    position: unset;
    height: 72vh;
    width: unset;
    margin: 16px;
    text-align: center;

    .account-registerable_title {
      padding: 0 32px;
      font-size: $font-size-24;
      line-height: 28px;
    }

    .account-registerable_actions {
      grid-row-gap: 8px;
      grid-auto-flow: dense;
    }

    .account-registerable_search-results-logo {
      width: 96px;
    }
  }
}
</style>
