<template>
  <div :class="['sub-accounts', {'sub-accounts_mobile': isMobile}]">
    <div class="sub-accounts_header">
      <BackToHome v-if="!hideOtherTool" />
      <span
        class="sub-accounts_tools"
        :class="{ 'search': hideOtherTool }"
      >
        <SubAccountSearch
          @search="onSearch"
          @focus="onHideOtherTool"
        />
        <span
          v-if="!hideOtherTool"
          class="sub-accounts_divider"
        />
        <a
          v-if="!hideOtherTool"
          class="sub-accounts_faq"
          href="https://talk.did.id/t/bit-subdids-are-live/435#what-are-subdids-1"
          target="_blank"
        >
          <Iconfont
            name="help"
            color="#B0B8BF"
            :size="isMobile ? 20 : 16"
          />
          <template v-if="!isMobile">{{ $tt('Learn more') }}</template>
        </a>
      </span>
    </div>
    <SubAccountGains />
    <div class="sub-accounts_container">
      <div class="sub-accounts_count">
        <Iconfont
          name="sub-account"
          size="26"
        />
        <i18n
          tag="span"
          path="子账户数"
          :i18nkey="$tt('子账户数')">
          <template slot="account">
            <span class="sub-accounts_count_account">{{ accountName }}</span>
          </template>
          <template slot="count">{{ acountTotal }}</template>
        </i18n>
      </div>
      <div
        v-if="loading"
        class="sub-accounts_list"
      >
        <Skeleton
          v-for="i in 6"
          :key="i"
        />
      </div>
      <template v-else>
        <div
          v-if="accountList.length > 0 || createSubAccountsLoading"
          class="sub-accounts_list"
        >
          <MintSubAccounts
            @click="mintSubAccounts"
          />
          <span
            v-if="createSubAccountsLoading"
            class="sub-accounts_item sub-accounts_item_create-loading"
          >
            <span class="sub-accounts_item_create-loading_icon-container">
              <Iconfont
                name="loading"
                size="32"
                color="#22C493"
              />
            </span>
            <span class="sub-accounts_item_create-loading_context">
              <span>{{ $tt('Processing ({total})', { total: createSubAccountsTotal }) }}</span>
              <span class="sub-accounts_item_create-loading_desc">{{ $tt('Estimated time: 3 minutes') }}</span>
            </span>
          </span>
          <a v-for="(item, index) in accountList"
             :key="index"
             class="sub-accounts_item"
             :href="`/${item.account}`"
          >
            <IconImage
              :url="`${IDENTICON_SERVE}${item.account}`"
              :alt="item.account"
              :size="32"
              rounded
            />
<!--            <span class="sub-accounts_item_content">-->
<!--              {{ accountName.split('.')[0] }}<span class="sub-accounts_item_content_sub-account">#{{ item.account && item.account.replace('.' + accountName, '') }}</span>.{{ accountName.split('.')[1] }}-->
<!--            </span>-->
            <span class="sub-accounts_item_content">
              {{ item.account && item.account }}
            </span>
          </a>
          <span
            v-if="showLoadMore"
            class="sub-accounts_item sub-accounts_item_load-more"
            @click="getSubAccountList"
          >
            {{ $tt('Load more') }}
          </span>
        </div>
        <span
          v-else
          class="sub-accounts_placeholder"
        >
          <img
            class="sub-accounts_placeholder_img"
            src="/images/no-sub-accounts-placeholder.svg"
          >
          <div class="sub-accounts_placeholder_desc">{{ $tt('No SubDIDs') }}</div>
          <Button
            class="sub-accounts_placeholder_button"
            shape="round"
            status="primary"
            size="small"
            @click="mintSubAccounts"
          >
            {{ $tt('Mint Manually') }}
          </Button>
        </span>
      </template>
    </div>
    <CreateSubAccount
      v-model="createSubAccountShowing"
      :accountInfo="accountInfo"
      @submitted="onCreateSubAccountsSubmitted"
    />
    <NotManagerTips v-model="notManagerTipsShowing" />
    <SetCustomScriptTips
      v-model="customScriptSetDialogShowing"
      :account="accountName"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import Iconfont from '~/components/icon/Iconfont.vue'
import BackToHome from '~/pages/sub-accounts/-/BackToHome.vue'
import { SUB_ACCOUNT_ACTIONS, SUB_ACCOUNT_ENABLE_STATUS } from '~/constant/subAccount'
import { ISubAccountInfo } from '~/services/SubAccount'
import MintSubAccounts from '~/pages/sub-accounts/-/MintSubAccounts.vue'
import CreateSubAccount from '~/pages/sub-accounts/-/CreateSubAccount.vue'
import { CYCLE_CALL_FUNCTION_TIME, TRX_STATUS, IDENTICON_SERVE } from '~/constant'
import errno from '~/constant/errno'
import NotManagerTips from '~/pages/-/NotManagerTips.vue'
import { IAccountInfo } from '~/services/Account'
import IconImage from '~/components/icon/IconImage.vue'
import SubAccountSearch from '~/pages/sub-accounts/-/SubAccountSearch.vue'
import SubAccountGains from '~/pages/sub-accounts/-/SubAccountGains.vue'
import SetCustomScriptTips from '~/pages/-/SetCustomScriptTips.vue'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'SubAccounts',
  layout: 'empty',
  components: {
    Iconfont,
    BackToHome,
    MintSubAccounts,
    CreateSubAccount,
    NotManagerTips,
    IconImage,
    SubAccountSearch,
    SubAccountGains,
    SetCustomScriptTips
  },
  data () {
    return {
      IDENTICON_SERVE,
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as IAccountInfo,
      enableSecondConfirmation: false,
      enableLoading: false,
      enableConfirmLoading: false,
      page: 0,
      accountList: [] as ISubAccountInfo[],
      acountTotal: 0,
      createSubAccountsLoading: false,
      createSubAccountShowing: false,
      createSubAccountsTotal: 0,
      showLoadMore: false,
      notManagerTipsShowing: false,
      loading: true,
      searchWord: '',
      hideOtherTool: false,
      isSetCustomScript: false,
      customScriptSetDialogShowing: false
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    ...mapState({
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    isManager (): boolean {
      return !!this.accountInfo.manager && this.connectedAccount.address.toUpperCase() === this.accountInfo.manager.toUpperCase()
    },
  },
  async mounted () {
    this.getAccountDetail()
    this.getCustomScriptInfo()
    await this.getSubAccountList()
    this.loading = false
  },
  methods: {
    async getCustomScriptInfo () {
      try {
        const res = await this.$services.subAccount.customScriptInfo(this.accountName)
        if (res) {
          this.isSetCustomScript = !!res.custom_script_args
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    onHideOtherTool (value: boolean) {
      if (this.isMobile) {
        this.hideOtherTool = value
      }
    },
    onSearch (value: string) {
      this.page = 0
      this.searchWord = value
      this.getSubAccountList()
    },
    onCreateSubAccountsSubmitted (total: number) {
      this.createSubAccountsTotal = total
      this.createSubAccountsLoading = true
      this.checkOrderStatus()
    },
    async getAccountDetail () {
      try {
        const res = await this.$services.account.accountInfo(this.accountName)
        if (res) {
          this.accountInfo = res
          const enableSubAccount = res.enable_sub_account
          if (enableSubAccount === SUB_ACCOUNT_ENABLE_STATUS.off) {
            this.$router.push(`/sub-accounts/enable/${this.accountName}`)
          }
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    async getSubAccountList () {
      try {
        this.page += 1
        const res = await this.$services.subAccount.subAccountList({
          account: this.accountName,
          page: this.page,
          keyword: this.searchWord
        })

        if (res && res.list) {
          if (this.page === 1) {
            this.accountList = res.list
          }
          else {
            this.accountList.push(...res.list)
          }

          if (!this.searchWord) {
            this.acountTotal = res.total
          }

          const length = res.list.length
          if (length < 50) {
            this.showLoadMore = false
          }
          else {
            this.showLoadMore = true
          }
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    async mintSubAccounts () {
      if (!this.loggedIn) {
        this.$walletSdk.walletsConnect()
        return
      }

      if (!this.isManager) {
        this.notManagerTipsShowing = true
        return
      }

      if (this.isSetCustomScript) {
        this.customScriptSetDialogShowing = true
        return
      }

      this.createSubAccountShowing = true
    },
    async checkOrderStatus () {
      try {
        const res = await this.$services.subAccount.transactionStatus({
          account: this.accountName,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          action: SUB_ACCOUNT_ACTIONS.createSubAccount
        })
        if (res && res.status === TRX_STATUS.pending) {
          window.setTimeout(() => {
            this.checkOrderStatus()
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeNotExitsTrx) {
          window.location.reload()
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.sub-accounts {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;

  .sub-accounts_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .sub-accounts_container {
    position: relative;
    margin-top: 16px;
    margin-bottom: 32px;
    min-height: 56vh;
    box-shadow: $container-outer-box-shadow;
    border-radius: 24px;
    border: $container-border;
    background: $white;
    overflow: hidden;
  }

  .sub-accounts_list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 16px;
    grid-row-gap: 8px;
    padding: 12px 16px;
  }

  .sub-accounts_count {
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    align-items: center;
    grid-column-gap: 16px;
    line-height: 26px;
    padding: 17px 30px;
    background: rgba(236, 214, 156, 0.2);
    font-size: 20px;
    font-weight: 800;
  }

  .sub-accounts_count_account {
    color: #E4B169;
  }

  .sub-accounts_item {
    height: 50px;
    padding: 0 10px;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 32px auto;
    grid-column-gap: 8px;
    align-items: center;
    border-radius: 25px;
    font-size: $font-size-16;
    font-weight: 900;
    color: $primary-font-color;
    cursor: pointer;
    background: #EDF0F2;

    &:hover {
      background: rgba(237, 240, 242, 0.6);
    }
  }

  .sub-accounts_item_create-loading {
    background: #D6EFE7 !important;
    cursor: default;
  }

  .sub-accounts_item_create-loading_context {
    display: flex;
    flex-direction: column;
    font-size: $font-size-16;
    font-weight: bold;
    color: $success-font-color;
  }

  .sub-accounts_item_create-loading_desc {
    font-size: $font-size-12;
    font-weight: 400;
    color: $success-font-color;
    line-height: 14px;
  }

  .sub-accounts_item_create-loading_icon-container {
    display: inline-block;
    margin-right: 6px;
    width: 32px;

    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .sub-accounts_item_content {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sub-accounts_item_load-more {
    display: flex;
    justify-content: center;
    font-weight: 700;
    color: $tips-font-color;
  }

  .sub-accounts_faq {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    align-items: center;
    font-size: $font-size-14;
    font-weight: 500;
    color: $tips-font-color;
    padding: 12px;

    &:hover {
      opacity: 0.7;
    }
  }

  .sub-accounts_placeholder_img {
    width: 114px;
  }

  .sub-accounts_placeholder {
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    width: max-content;
    height: max-content;
    text-align: center;
    word-break: break-word;
    hyphens: auto;
  }

  .sub-accounts_placeholder_desc {
    margin: 20px 0;
    font-size: $font-size-16;
    font-weight: 500;
    color: #121314;
    line-height: 19px;
  }

  .sub-accounts_placeholder_button {
    width: 128px;
  }

  .sub-accounts_item_content_sub-account {
    color: #E4B169;
  }

  .sub-accounts_tools {
    display: flex;
    align-items: center;

    &.search {
      flex: 1;
    }
  }

  .sub-accounts_divider {
    margin: 0 8px;
    width: 1px;
    height: 16px;
    background: rgba(182, 196, 217, 0.4);
  }

  &.sub-accounts_mobile {
    width: unset;
    margin: 16px;

    .sub-accounts_container {
      margin-bottom: 0;
      min-height: 58vh;
    }

    .sub-accounts_list {
      margin-bottom: 0;
      width: unset;
      grid-template-columns: 1fr;
      grid-row-gap: 8px;
      border-radius: 24px;
      padding: 16px;
    }

    .sub-accounts_count {
      align-items: unset;
    }

    .sub-accounts_placeholder {
      width: 280px;
    }
  }
}
</style>
