<template>
  <div :class="['enable-sub-accounts', {'enable-sub-accounts_mobile': isMobile}]">
    <div class="enable-sub-accounts_header">
      <BackToHome />
      <a
        class="enable-sub-accounts_faq"
        href="https://talk.did.id/t/bit-subdids-are-live/435#what-are-subdids-1"
        target="_blank"
      >
        <Iconfont
          name="help"
          color="#B0B8BF"
          size="16"
        />
        <template v-if="!isMobile">{{ $tt('Learn more') }}</template>
      </a>
    </div>
    <div class="enable-sub-accounts_container">
      <h3 class="enable-sub-accounts_title">{{ $tt('Enable SubDIDs') }}</h3>
      <i18n
        class="enable-sub-accounts_for-account"
        tag="div"
        path="开启子账户"
        :i18nkey="$tt('开启子账户')"
      >
        <span
          slot="account"
          class="enable-sub-accounts_account"
        >
          {{ accountName }}
        </span>
      </i18n>
      <div class="enable-sub-accounts_rule">
        <div class="enable-sub-accounts_rule_item">
          <span>1.</span>
          <span>{{ $tt("The SubDIDs feature can't be disabled once enabled;") }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>2.</span>
          <span>{{ $tt('Only the Manager of a parent account can mint SubDIDs. When a SubDID is being minted, the owner of the SubDID must be specified;') }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>3.</span>
          <span>{{ $tt('The cost of each SubDID is 1 CKB/year, and the total cost is deducted from the balance of parent account at the time of minting;') }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>4.</span>
          <span>{{ $tt('The SubDID is a completely independent account which shares the same features as the parent account;') }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>5.</span>
          <span>{{ $tt("The SubDIDs can be minted without total number limitation, but the maximum number minted each time is 100;") }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>6.</span>
          <span>{{ $tt("Like an ordinary parent account, a SubDID that expires will enter a grace period and will be recalled if it's not renewed within the grace period. The recalled SubDID may be re-minted by the parent account;") }}</span>
        </div>
        <div class="enable-sub-accounts_rule_item">
          <span>7.</span>
          <i18n
            tag="span"
            path="子账户押金"
            :i18nkey="$tt('子账户押金')">
            <template slot="cashPledge">
              <span class="enable-sub-accounts_rule_item_cash-pledge">220 CKB</span>
            </template>
          </i18n>
        </div>
      </div>
      <div>
        <Checkbox
          v-model="enableSecondConfirmation"
          :disabled="enableLoading"
        >
          {{ $tt("I am aware of the above terms.") }}
        </Checkbox>
      </div>
      <div>
        <span
          v-if="enableLoading"
          class="enable-sub-accounts_enable-loading"
        >
          <span class="enable-sub-accounts_enable-loading_icon">
            <Iconfont
              name="loading"
              size="38"
              color="#22C493"
            />
          </span>
          <span class="enable-sub-accounts_enable-loading_container">
            <span class="enable-sub-accounts_enable-loading_title">{{ $tt('Processing') }}</span>
            <span>{{ $tt('Estimated time: 3 minutes') }}</span>
          </span>
        </span>
        <Button
          v-else
          class="enable-sub-accounts_button"
          status="success"
          shape="round"
          :disabled="!enableSecondConfirmation"
          :loading="enableConfirmLoading"
          @click="onEnableSubAccounts"
        >
          {{ $tt('Enable') }}
        </Button>
      </div>
    </div>
    <DasBalanceInsufficientDialog
      v-model="dasBalanceInsufficientDialogShowing"
      :registrationFees="paidTokenAmount"
    />
    <NotOwnerTips
      v-model="notOwnerTipsShowing"
      :message="$tt('Only the owner of this .bit account can enable SubDIDs. You are not the owner.')"
    />
    <Dialog
      v-model="noPermissionsMintSubAccountsDialogShowing"
      :title="$tt('Tips')"
      closeButton
      enableCloseAction
    >
      <i18n
        tag="span"
        path="子账户白名单"
        :i18nkey="$tt('子账户白名单')"
      >
        <template slot="email">
          <a
            class="enable-sub-accounts_no-permissions-mint-subaccounts_faq"
            href="mailto:supermancy@did.id"
          >supermancy@did.id</a>
        </template>
      </i18n>
      <a
        class="enable-sub-accounts_no-permissions-mint-subaccounts_faq"
        target="_blank"
        href="https://talk.did.id/t/bit-subdids-are-live/435#h-11-why-cant-i-enable-subdids-21"
      >
        {{ $tt('Learn more') }}
      </a>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { sleep } from '~/modules/tools'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { CYCLE_CALL_FUNCTION_TIME, TOKEN_DECIMAL_PLACES, TRX_STATUS } from '~/constant'
import Iconfont from '~/components/icon/Iconfont.vue'
import BackToHome from '~/pages/sub-accounts/-/BackToHome.vue'
import Checkbox from '~/components/form/Checkbox.vue'
import Button from '~/components/Button.vue'
import { SUB_ACCOUNT_ACTIONS, SUB_ACCOUNT_ENABLE_STATUS } from '~/constant/subAccount'
import { CKB } from '~/constant/chain'
import errno from '~/constant/errno'
import DasBalanceInsufficientDialog from '~/components/DasBalanceInsufficientDialog.vue'
import { SUB_ACCOUNT_KEYS } from '~/store/subAccount'
import Decimal from 'decimal.js'
import NotOwnerTips from '~/pages/-/NotOwnerTips.vue'
import { IAccountInfo } from '~/services/Account'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'EnableSubAccounts',
  layout: 'empty',
  components: {
    Iconfont,
    BackToHome,
    Checkbox,
    Button,
    DasBalanceInsufficientDialog,
    NotOwnerTips
  },
  data () {
    return {
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as IAccountInfo,
      enableSecondConfirmation: false,
      enableLoading: false,
      enableConfirmLoading: false,
      dasBalanceInsufficientDialogShowing: false,
      notOwnerTipsShowing: false,
      noPermissionsMintSubAccountsDialogShowing: false
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    ...mapState({
      me: ME_KEYS.namespace,
      subAccount: SUB_ACCOUNT_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    paidTokenAmount (): string {
      return new Decimal(this.subAccount.config.sub_account_basic_capacity)
        .add(this.subAccount.config.sub_account_prepared_fee_capacity)
        .div(10 ** CKB.decimals)
        .toFixed(TOKEN_DECIMAL_PLACES)
    },
    isOwner (): boolean {
      return !!this.accountInfo.owner && this.connectedAccount.address.toUpperCase() === this.accountInfo.owner.toUpperCase()
    }
  },
  mounted () {
    this.$store.dispatch(SUB_ACCOUNT_KEYS.fetchConfig)
    this.getAccountDetail()
  },
  methods: {
    async getAccountDetail () {
      try {
        const res = await this.$services.account.accountInfo(this.accountName)
        if (res) {
          this.accountInfo = res
          const enableSubAccount = res.enable_sub_account
          if (enableSubAccount === SUB_ACCOUNT_ENABLE_STATUS.on) {
            this.$router.push(`/sub-accounts/${this.accountName}`)
          }
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    async onEnableSubAccounts () {
      if (!this.loggedIn) {
        this.$walletSdk.walletsConnect()
        return
      }

      if (!this.isOwner) {
        this.notOwnerTipsShowing = true
        return
      }

      this.enableConfirmLoading = true
      try {
        const res = await this.$services.subAccount.initSubAccount({
          account: this.accountName,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          }
        })

        if (!res || !res.list) {
          return
        }

        for (const list of res.list) {
          for (const item of list.sign_list) {
            if (item.sign_msg) {
              const signDataRes = await this.$walletSdk.signData(item.sign_msg)
              item.sign_msg = (signDataRes as string)
              // sometimes metamask need a duration to receive next signing request
              await sleep(1000)
            }
          }
        }

        const { hash_list } = await this.$services.subAccount.sendTransaction(res)
        this.enableLoading = true
        this.checkOrderStatus()
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 }),
          txHash: hash_list[0],
          txHashLink: `${CKB.explorerTrx}${hash_list[0]}`
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: 5 })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err === errno.tronLinkInsufficientBalance || (err.message && err.message.includes(errno.walletConnectInsufficientFundsForTransfer))) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Insufficient balance')
            })
          }
          else if (err.message && err.message.includes(errno.tronLinkTypeErrorAddUpdateDataNotFunction)) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The current wallet environment does not support payments using TRX, please upgrade your wallet version or register with another wallet.')
            })
          }
          else if (err.message && err.message.includes(errno.portalWalletValidationFailure)) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The wallet environment does not support {token} payments', { token: CKB.symbol })
            })
          }
          else if (err.code === errno.apiErrorCodeInsufficientBalance) {
            this.dasBalanceInsufficientDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeNotEnoughChange) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('dotbit is a smart contract that runs on the Nervos. Due to the underlying logic of the contract, the remaining amount is too low (less than 116 CKB) to send a transaction.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeAccountOnSaleOrAuction) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Your account is on sale on DIDTop or has been converted to Ethereum NFT. You can\'t mint SubDIDs for it.')
            })
          }
          else if (err.code === errno.apiErrorCodeNoPermissionsMintSubAccounts) {
            this.noPermissionsMintSubAccountsDialogShowing = true
          }
          else if (err.code === errno.apiErrorCodeAccountIsExpired) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The account has expired. If you need to continue using it, please renew it.')
            })
          }
          else if (err.code === errno.apiErrorCodeNotHaveOwnerPermission) {
            this.notOwnerTipsShowing = true
          }
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.enableConfirmLoading = false
      }
    },
    async checkOrderStatus () {
      try {
        const res = await this.$services.subAccount.transactionStatus({
          account: this.accountName,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          action: SUB_ACCOUNT_ACTIONS.enableSubAccount
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
          this.enableLoading = false
          window.location.href = `/sub-accounts/${this.accountName}`
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.enable-sub-accounts {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;

  .enable-sub-accounts_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .enable-sub-accounts_container {
    margin-top: 16px;
    padding: 50px;
    box-shadow: $container-outer-box-shadow;
    border-radius: 18px;
    background: $white;
    border: $container-border;
  }

  .enable-sub-accounts_title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: $font-size-24;
    line-height: 28px;
    font-weight: 800;
  }

  .enable-sub-accounts_for-account {
    font-size: $font-size-18;
    font-weight: 800;
    color: $third-font-color;
    line-height: 21px;
    margin: 4px 0 24px 0;
  }

  .enable-sub-accounts_account {
    color: $success-font-color;
  }

  .enable-sub-accounts_rule {
    line-height: 16px;
    margin-bottom: 26px;
    font-weight: 500;
    color: $tips-font-color;
  }

  .enable-sub-accounts_rule_item {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 4px;
    grid-template-columns: max-content;
    margin-bottom: 10px;
    line-height: 19px;
  }

  .enable-sub-accounts_rule_item_cash-pledge {
    color: $success-font-color;
  }

  .enable-sub-accounts_button {
    margin-top: 32px;
    width: 300px;
  }

  .enable-sub-accounts_enable-loading {
    display: inline-flex;
    align-items: center;
    width: 300px;
    background: #D6EFE7;
    border-radius: 60px;
    margin-top: 32px;
    padding: 12px 18px;
  }

  .enable-sub-accounts_enable-loading_icon {
    display: inline-block;
    margin-right: 6px;

    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .enable-sub-accounts_enable-loading_container {
    display: inline-grid;
    font-size: $font-size-14;
    font-weight: 400;
    color: $success-font-color;
    line-height: 16px;
  }

  .enable-sub-accounts_enable-loading_title {
    font-size: $font-size-18;
    font-weight: 500;
    color: $success-font-color;
    line-height: 21px;
  }

  .enable-sub-accounts_faq {
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

  .enable-sub-accounts_no-permissions-mint-subaccounts_faq {
    display: inline-block;
    font-weight: 500;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  &.enable-sub-accounts_mobile {
    width: unset;
    margin: 16px;

    .enable-sub-accounts_container {
      padding: 16px;
    }

    .enable-sub-accounts_button {
      width: 100%;
    }

    .enable-sub-accounts_enable-loading {
      display: flex;
      width: unset;
    }
  }
}
</style>
