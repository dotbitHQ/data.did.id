<template>
  <div :class="['account-on-cross', {'account-on-cross_mobile': isMobile}]">
    <img
      class="account-on-cross_search-results-logo"
      src="/images/search-results-placeholder.png"
    />
    <i18n
      tag="h1"
      class="account-on-cross_title"
      path="跨链中标题"
      :i18nkey="$tt('跨链中标题')">
      <template slot="account">
        <span class="account-on-cross_title_account">{{ account }}</span>
      </template>
    </i18n>
    <div class="account-on-cross_desc">
      {{ $tt('{account} has been converted to an NFT on Ethereum and the data stored in it has been cleared. If you are the owner of {account}, you can manage the data after converting it to a normal .bit. ', { account: account }) }}
      <a
        href="https://talk.did.id/t/convert-your-bit-to-nft-on-ethereum-now/481"
        target="_blank"
        class="account-on-cross_desc_link"
      >{{ $tt('How to convert a .bit NFT on Ethereum to a normal .bit?') }}</a>
    </div>
    <div class="account-on-cross_actions">
      <Button
        class="account-on-cross_button"
        size="small"
        shape="round"
        @click="onBack"
      >
        {{ $tt('Back') }}
      </Button>
      <Button
        class="account-on-cross_button"
        size="small"
        shape="round"
        status="success"
        @click="viewOnOpensea"
      >
        {{ $tt('View on OpenSea') }}
      </Button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { nftTokenId } from '~/modules/tools'
import { ACCOUNT_STATUS, ACCOUNT_SUFFIX, CrossEthContract } from '~/constant'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'AccountOnCross',
  layout: 'empty',
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
    viewOnOpensea () {
      const tokenId = nftTokenId(this.account)
      if (this.isMobile) {
        window.location.href = `https://opensea.io/assets/ethereum/${CrossEthContract}/${tokenId}`
      }
      else {
        window.open(`https://opensea.io/assets/ethereum/${CrossEthContract}/${tokenId}`)
      }
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
          else if (res.status === ACCOUNT_STATUS.onCross) {}
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

.account-on-cross {
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

  .account-on-cross_title {
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

  .account-on-cross_title_account {
    color: $primary-font-color;
  }

  .account-on-cross_desc {
    text-align: center;
    padding: 0 200px;
    margin-bottom: 24px;
    font-size: $font-size-14;
    line-height: 16px;
    font-weight: 500;
    color: $assist-font-color;
  }

  .account-on-cross_actions {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
  }

  .account-on-cross_button {
    width: 150px;
  }

  .account-on-cross_desc_link {
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  .account-on-cross_search-results-logo {
    margin-bottom: 24px;
    width: 152px;
  }

  &.account-on-cross_mobile {
    position: unset;
    height: 72vh;
    width: unset;
    margin: 16px;
    text-align: center;

    .account-on-cross_title {
      padding: 0 32px;
      font-size: $font-size-24;
      line-height: 28px;
    }

    .account-on-cross_desc {
      padding: 0 32px;
      line-height: 16px;
    }

    .account-on-cross_actions {
      grid-row-gap: 8px;
      grid-auto-flow: dense;
    }

    .account-on-cross_search-results-logo {
      width: 96px;
    }
  }
}
</style>
