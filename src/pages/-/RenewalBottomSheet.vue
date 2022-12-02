<template>
  <div>
    <Dialog
      :showing="firstStepShowing"
      :title="$tt('Renew')"
      closeButton
      @close="onClose"
    >
      <div class="renewal-bottom-sheet__label">
        {{ $tt('Renewal time (years)') }}
      </div>
      <input
        v-model="renewalPeriod"
        class="renewal-bottom-sheet__renewal-period"
        type="number"
        inputmode="numeric"
        pattern="[0-9]*"
        :min="MIN_VALUE"
        :max="MAX_VALUE"
        @change="checkRenewalPeriod"
      >
      <div class="renewal-bottom-sheet__renewal-fee">
        {{ $tt('Cost: ${renewalAmount}', { renewalAmount: thousandSplit(renewalAmount, FIAT_DECIMAL_PLACES) }) }}
      </div>
      <div
        v-if="renewalPeriod > MAX_VALUE"
        class="renewal-bottom-sheet__renewal-period__error">
        {{ $tt('The maximum is 20.') }}
      </div>
      <i18n
        class="renewal-bottom-sheet__renewal-label"
        path="续费提示"
        :i18nkey="$tt('续费提示')"
        tag="div"
      >
        <span
          slot="accountName"
          class="renewal-bottom-sheet__account"
        >
<!--          <template v-if="isSubAccount">-->
<!--            {{ accountInfo.account.split('.')[1] }}<span class="renewal-bottom-sheet__account_sub-account">#{{ accountInfo.account.split('.')[0] }}</span>.{{ accountInfo.account.split('.')[2] }}-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ accountInfo.account }}-->
<!--          </template>-->
          {{ accountInfo.account }}
        </span>
        <span
          slot="renewalToDate"
          class="renewal-bottom-sheet__renewal-to"
        >
          {{ renewalToDate }}
        </span>
      </i18n>
      <template #action>
        <Button
          :disabled="renewalPeriod > MAX_VALUE"
          block
          shape="round"
          status="success"
          @click="onNext"
        >
          {{ $tt('Next') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="secondStepShowing"
      :title="$tt('Select payment')"
      closeButton
      @close="onClose"
    >
      <PaymentTokenSelect
        v-model="paymentToken"
        :currentChain="chainType"
        :options="common.tokens"
      />
      <div class="renewal-bottom-sheet__confirm-renewal__paid-amount">
        {{ thousandSplit(paidTokenAmount) }}
        <span class="renewal-bottom-sheet__confirm-renewal__symbol">{{ paymentToken.symbol }}</span>
      </div>
      <WalletConnectTips />
      <div
        v-if="paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)"
        class="renewal-bottom-sheet__payment-error"
      >
        {{ $tt('The wallet environment does not support {token} payments', { token: CKB.symbol }) }}
      </div>
      <div
        v-if="paymentToken.chain_type === ChainType.tron && (isSafePalWallet || isViaWallet)"
        class="renewal-bottom-sheet__payment-error"
      >
        {{ $tt('The wallet environment does not support {token} payments', { token: TRON.symbol }) }}
      </div>
      <template #action>
        <Button
          :loading="confirmLoading"
          :disabled="(paymentToken.token_id === CKB.tokenId && (isTokenPocket || isCoinbaseWallet)) || (paymentToken.chain_type === ChainType.tron && (isSafePalWallet || isViaWallet))"
          block
          status="success"
          shape="round"
          @click="onConfirm"
        >
          {{ $tt('Renew Now') }}
        </Button>
      </template>
    </Dialog>
    <DasBalanceInsufficientDialog
      v-model="dasBalanceInsufficientDialogShowing"
      :registrationFees="paidTokenAmount"
    />
    <PwBalanceInsufficientDialog
      v-model="pwBalanceInsufficientDialogShowing"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Decimal from 'decimal.js'
import dayjs from 'dayjs'
import { mapState, mapGetters } from 'vuex'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import { IAccountInfo } from '~/services/Account'
import {
  formatDateTime,
  thousandSplit,
  isCoinbaseWallet,
  isSafePalWallet,
  isViaWallet,
  isTokenPocket,
  mmJsonHashAndChainIdHex,
  sleep
} from '~/modules/tools'
import {
  FIAT_DECIMAL_PLACES,
  TIME_FORMAT,
  TOKEN_DECIMAL_PLACES
} from '~/constant'
import { IToken } from '~/services/Common'
import {
  ChainType,
  ChainTypeToChain,
  CKB,
  CoinTypeToChainTypeMap,
  DASBalanceTokenId,
  ETH,
  NEW_LOCK_SCRIPT_TYPE,
  TRON
} from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'
import Button from '~/components/Button.vue'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import config from '~~/config'
import PaymentTokenSelect from '~/components/PaymentTokenSelect.vue'
import DasBalanceInsufficientDialog from '~/components/DasBalanceInsufficientDialog.vue'
import PwBalanceInsufficientDialog from '~/components/PwBalanceInsufficientDialog.vue'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'

const MIN_VALUE = 1
const MAX_VALUE = 20

export default Vue.extend({
  name: 'RenewalBottomSheet',
  components: {
    Button,
    PaymentTokenSelect,
    WalletConnectTips,
    DasBalanceInsufficientDialog,
    PwBalanceInsufficientDialog
  },
  model: {
    prop: 'firstStepShowing',
    event: 'close'
  },
  props: {
    firstStepShowing: {
      type: Boolean,
      required: false
    },
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    }
  },
  data () {
    return {
      config,
      TRON,
      CKB,
      ETH,
      ChainType,
      FIAT_DECIMAL_PLACES,
      MIN_VALUE,
      MAX_VALUE,
      renewalPeriod: MIN_VALUE,
      secondStepShowing: false,
      confirmLoading: false,
      paymentToken: {} as IToken,
      dasBalanceInsufficientDialogShowing: false,
      pwBalanceInsufficientDialogShowing: false
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId
    }),
    isTokenPocket,
    isCoinbaseWallet,
    isSafePalWallet,
    isViaWallet,
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
    premium (): number {
      return 1 + Number(this.common.config?.premium || 0.1)
    },
    renewalAmount (): string {
      const _fee = new Decimal(this.renewalPeriod || 0).times(this.accountInfo.account_price || 0)
      return _fee.toFixed(FIAT_DECIMAL_PLACES)
    },
    renewalToDate (): string {
      const _date = dayjs(this.accountInfo.expired_at).add(this.renewalPeriod, 'year')
      return formatDateTime(_date, TIME_FORMAT.fullDate)
    },
    paidTokenAmount (): string {
      return new Decimal(this.renewalAmount)
        .div(this.paymentToken.price || 1)
        .times(this.premium)
        .toFixed(TOKEN_DECIMAL_PLACES)
    },
    chainType (): ChainType {
      let _chainType = ChainType.ckb
      const _coinType = this.connectedAccount.chain?.coinType
      if (_coinType && CoinTypeToChainTypeMap[_coinType]) {
        _chainType = CoinTypeToChainTypeMap[_coinType]
      }
      return _chainType
    }
  },
  watch: {
    secondStepShowing (newVal) {
      if (newVal === false) {
        this.confirmLoading = false
      }
    }
  },
  async mounted () {
    await this.$store.dispatch(COMMON_KEYS.fetchTokens)
  },
  methods: {
    thousandSplit,
    onClose (value: boolean) {
      this.$emit('close', value)
      this.secondStepShowing = false
    },
    onNext () {
      this.$emit('close', false)
      this.secondStepShowing = true
    },
    async onConfirm () {
      this.confirmLoading = true

      try {
        const renewOrderRes = await this.$services.account.submitRenewOrder({
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          pay_chain_type: this.paymentToken.chain_type,
          pay_token_id: this.paymentToken.token_id,
          pay_type: '',
          pay_address: this.connectedAccount.address,
          renew_years: Number(this.renewalPeriod)
        })

        if (!renewOrderRes) {
          return
        }

        if (this.paymentToken.token_id === DASBalanceTokenId) {
          const res = await this.$services.account.dasBalancePay({
            evm_chain_id: this.computedChainId,
            chain_type: this.computedChainType,
            address: this.connectedAccount.address,
            order_id: renewOrderRes.order_id
          })

          if (res && res.sign_list) {
            for (const item of res.sign_list) {
              if (item.sign_msg) {
                if (item.sign_type === NEW_LOCK_SCRIPT_TYPE.eip712) {
                  const mmJson = JSON.parse(JSON.stringify(res.mm_json))
                  mmJson.message.digest = item.sign_msg
                  const signDataRes = await this.$walletSdk.signData(mmJson, true)
                  item.sign_msg = signDataRes + mmJsonHashAndChainIdHex(mmJson, mmJson.domain.chainId)
                }
                else {
                  const signDataRes = await this.$walletSdk.signData(item.sign_msg)
                  item.sign_msg = (signDataRes as string)
                }
                // sometimes metamask need a duration to receive next signing request
                await sleep(1000)
              }
            }

            const { hash } = await this.$services.account.sendTrx(res)
            if (hash) {
              this.onClose(false)
              this.$alert({
                title: this.$tt('Tips'),
                message: this.$tt('The renewal order has been submitted and will take effect in 5 minutes. If the renewal does not take effect, your payment will be refunded to your payment address within 24 hours (except for transaction fees).'),
                txHash: hash,
                txHashLink: `${ChainTypeToChain[this.paymentToken.chain_type].explorerTrx}${hash}`
              })
            }
          }
        }
        else {
          const hash = await this.$walletSdk.sendTrx({
            to: renewOrderRes.receipt_address,
            value: renewOrderRes.amount,
            data: renewOrderRes.order_id
          }, this.paymentToken.token_id === CKB.tokenId)

          this.onClose(false)
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('The renewal order has been submitted and will take effect in 5 minutes. If the renewal does not take effect, your payment will be refunded to your payment address within 24 hours (except for transaction fees).'),
            txHash: hash,
            txHashLink: `${ChainTypeToChain[this.paymentToken.chain_type].explorerTrx}${hash}`
          })
        }
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
          else if (err.message && err.message.startsWith(errno.portalWalletInsufficientBalance)) {
            this.pwBalanceInsufficientDialogShowing = true
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
          else if (err.code === errno.apiErrorCodeAfterGracePeriod) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The account has been recycled and cannot be renewed.')
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
          else {
            this.$alert({
              title: this.$tt('Error'),
              message: err.code ? `${err.code}: ${err.message}` : err
            })
          }
        }
      }
      finally {
        this.confirmLoading = false
      }
    },
    checkRenewalPeriod (event: Event) {
      let _value = parseInt((event.target as HTMLInputElement).value)
      if (isNaN(_value) || _value < MIN_VALUE) {
        _value = MIN_VALUE
      }
      ;(event.target as HTMLInputElement).value = _value + ''
      this.renewalPeriod = _value
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.renewal-bottom-sheet__label {
  margin-top: 16px;
  text-align: center;
  font-size: $font-size-14;
  font-weight: 500;
  color: $assist-font-color;
  line-height: 16px;
}

.renewal-bottom-sheet__renewal-period {
  display: block;
  margin: 0 auto 6px auto;
  width: 200px;
  border: 0;
  border-bottom: $container-border;
  border-radius: 0;
  text-align: center;
  font-size: 64px;
  font-weight: 500;
  font-family: $barlow-medium;
  line-height: 75px;
  outline: none;
}

.renewal-bottom-sheet__renewal-fee {
  text-align: center;
  font-size: $font-size-14;
  font-weight: 500;
  line-height: 16px;
  color: $assist-font-color;
}

.renewal-bottom-sheet__renewal-period__error {
  margin-top: 6px;
  text-align: center;
  color: $error-font-color;
}

.renewal-bottom-sheet__renewal-label {
  margin-top: 48px;
  margin-bottom: -20px;
  text-align: center;
  color: $third-font-color;
  font-size: $font-size-14;
  font-weight: 500;
  line-height: 19px;
  word-break: break-word;
  hyphens: auto;
}

.renewal-bottom-sheet__renewal-to {
  color: $primary-font-color;
}

.renewal-bottom-sheet__account {
  color: $primary-font-color;
}

.renewal-bottom-sheet__account_sub-account {
  color: #E4B169;
}

.renewal-bottom-sheet__confirm-renewal__paid-amount {
  margin-top: 32px;
  text-align: center;
  font-size: 32px;
  font-family: $barlow-medium;
  font-weight: 500;
  color: $primary-font-color;
  line-height: 38px;
}

.renewal-bottom-sheet__confirm-renewal__symbol {
  color: $third-font-color;
}

.renewal-bottom-sheet__payment-error {
  font-size: $font-size-14;
  font-weight: 500;
  color: $error-font-color;
  text-align: center;
  padding: 10px 0;
}
</style>
