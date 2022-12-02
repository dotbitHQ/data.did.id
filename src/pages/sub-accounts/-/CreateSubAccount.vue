<template>
  <div :class="['create-sub-account', {'create-sub-account_mobile': isMobile}]">
    <Dialog
      :showing="firstStepShowing"
      :title="$tt('Mint SubDIDs')"
      closeButton
      @close="onClose"
    >
      <div class="create-sub-account_tips">
        {{ $tt('Support bulk mint SubDIDs. Please enter required information as suggested below (one SubDID per line).') }}
      </div>
      <div class="create-sub-account_example">
        <div>{{ $tt('name1,owner1,years') }}</div>
        <div>{{ $tt('name2,owner2,years') }}</div>
      </div>
      <div class="create-sub-account_example_tips">{{ $tt('* The maximum number minted each time is 50.') }}</div>
      <i18n
        class="create-sub-account_for-account"
        path="子账户来自"
        :i18nkey="$tt('子账户来自')"
        tag="div"
      >
        <span
          slot="account"
          class="create-sub-account_for-account_account"
        >
          {{ accountInfo.account }}
        </span>
        <a
          slot="faq"
          href="https://talk.did.id/t/bit-subdids-are-live/435#how-to-mint-subdids-7"
          target="_blank"
        >
          <Iconfont
            name="help"
            color="#B0B8BF"
            size="14"
          />
        </a>
      </i18n>
      <Textarea
        v-model="subAccountListString"
        class="create-sub-account_textarea"
        rows="10"
        :placeholder="$tt('subAccountListStringPlaceholder')"
        @input="onChangeSubAccountListString"
      />
      <div
        v-if="dataErrorTips"
        class="create-sub-account_error-tips"
      >{{ dataErrorTips }}</div>

      <template #action>
        <Button
          :loading="onNextLoading"
          block
          status="success"
          shape="round"
          @click="onNext"
        >
          {{ $tt('Next') }}
        </Button>
      </template>
    </Dialog>
    <Dialog
      :showing="secondStepShowing"
      :title="$tt('Mint SubDIDs')"
      closeButton
      @close="onClose"
    >
      <div class="create-sub-account_sub-accounts-details">
        <div class="create-sub-account_sub-accounts-details_container">
          <span class="create-sub-account_sub-accounts-details_label">{{ $tt('Total input') }}</span>
          <span class="create-sub-account_sub-accounts-details_value">{{ subAccountsEntered }}</span>
        </div>
        <div class="create-sub-account_sub-accounts-details_container">
          <span class="create-sub-account_sub-accounts-details_label">
            {{ $tt('Invalid') }}
            <a
              class="create-sub-account_sub-accounts-details_label_faq"
              href="https://talk.did.id/t/bit-subdids-are-live/435#h-12-what-is-the-rule-of-minting-subdids-22"
              target="_blank"
            >
              <Iconfont
                name="help"
                color="#B0B8BF"
                size="14"
              />
            </a>
          </span>
          <span class="create-sub-account_sub-accounts-details_value">{{ subAccountsUnqualified }}</span>
        </div>
        <div class="create-sub-account_sub-accounts-details_container">
          <span class="create-sub-account_sub-accounts-details_label">{{ $tt('Existing') }}</span>
          <span class="create-sub-account_sub-accounts-details_value">{{ subAccountsMinted }}</span>
        </div>
        <div class="create-sub-account_sub-accounts-details_container">
          <span class="create-sub-account_sub-accounts-details_label">{{ $tt('Total cost') }}</span>
          <span class="create-sub-account_sub-accounts-details_amount">{{ totalAmountCKB }} CKB</span>
        </div>
      </div>
      <div class="create-sub-account_table_container">
        <table class="create-sub-account_table">
          <tr class="create-sub-account_list_header">
            <th>{{ $tt('SubDIDs') }}</th>
            <th>{{ $tt('Owner') }}</th>
            <th>{{ $tt('Years') }}</th>
            <th>
              <span class="create-sub-account_table_field">{{ $tt('Cost (CKB)') }}</span>
            </th>
          </tr>
          <tr
            v-for="account in subAccounts"
            :key="account.account"
            class="create-sub-account_list_body"
          >
<!--            <td>-->
<!--              {{ accountInfo.account.split('.')[0] }}<span class="create-sub-account_list_sub-account">#{{ account.account && account.account.replace('.' + accountInfo.account, '') }}</span>.{{ accountInfo.account.split('.')[1] }}-->
<!--            </td>-->
            <td>
              <span class="create-sub-account_list_sub-account">{{ account.account && account.account.replace('.' + accountInfo.account, '') }}</span>.{{ accountInfo.account }}
            </td>
            <td>{{ collapseString(account.key_info.key) }}</td>
            <td>{{ account.register_years }}</td>
            <td>{{ account.register_years }}</td>
          </tr>
        </table>
      </div>
      <template #action>
        <div class="create-sub-account_confirm_actions">
          <Button
            shape="round"
            middle
            @click="onBack"
          >
            {{ $tt('Back') }}
          </Button>
          <Button
            :disabled="subAccounts.length === 0"
            :loading="confirmLoading"
            status="success"
            shape="round"
            @click="onMint"
          >
            {{ $tt('Mint') }}
          </Button>
        </div>
      </template>
    </Dialog>
    <DasBalanceInsufficientDialog
      v-model="dasBalanceInsufficientDialogShowing"
      :registrationFees="paidTokenAmount"
    />
    <Dialog
      :showing="taskNotCompletedDialogShowing"
      :title="$tt('Failed')"
      closeButton
      enableCloseAction
      @close="closeTaskNotCompletedDialog"
    >
      <div>{{ $tt('The current account cannot be edited. Please try again in 5 minutes. Possible reasons:') }}</div>
      <div class="create-sub-account_task-not-completed_item">
        <span>1.</span>
        <span>{{ $tt('Your operations are too frequent. The last transaction is still pending;') }}</span>
      </div>
      <div class="create-sub-account_task-not-completed_item">
        <span>2.</span>
        <span>{{ $tt('One or more of your SubDIDs are currently editing their data.') }}</span>
      </div>
      <a
        class="create-sub-account_task-not-completed_faq"
        target="_blank"
        href="https://talk.did.id/t/bit-subdids-are-live/435#what-are-subdids-1"
      >
        {{ $tt('Learn more') }}
      </a>
    </Dialog>
    <SetCustomScriptTips
      v-model="customScriptSetDialogShowing"
      :account="accountInfo.account"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import { ISubAccount } from '~/services/SubAccount'
import { COMMON_KEYS } from '~/store/common'
import Button from '~/components/Button.vue'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import DasBalanceInsufficientDialog from '~/components/DasBalanceInsufficientDialog.vue'
import { collapseString, sleep, splitAccount } from '~/modules/tools'
import Textarea from '~/components/form/Textarea.vue'
import { CKB, CoinType, ETH, TRON } from '~/constant/chain'
import { CHECK_SUB_ACCOUNT_STATUS } from '~/constant/subAccount'
import errno from '~/constant/errno'
import { validate } from 'vee-validate'
import { IAccountInfo } from '~/services/Account'
import Iconfont from '~/components/icon/Iconfont.vue'
import SetCustomScriptTips from '~/pages/-/SetCustomScriptTips.vue'

export default Vue.extend({
  name: 'CreateSubAccount',
  components: {
    Button,
    DasBalanceInsufficientDialog,
    Textarea,
    Iconfont,
    SetCustomScriptTips
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
      secondStepShowing: false,
      onNextLoading: false,
      confirmLoading: false,
      dasBalanceInsufficientDialogShowing: false,
      paidTokenAmount: '0',
      subAccountListString: '',
      subAccounts: [] as ISubAccount[],
      subAccountsEntered: 0,
      subAccountsUnqualified: 0,
      subAccountsMinted: 0,
      totalAmountCKB: 0,
      dataErrorTips: '',
      taskNotCompletedDialogShowing: false,
      customScriptSetDialogShowing: false
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    ...mapState({
      common: COMMON_KEYS.namespace,
      me: ME_KEYS.namespace
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
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

  },
  methods: {
    collapseString,
    closeTaskNotCompletedDialog () {
      this.taskNotCompletedDialogShowing = false
    },
    onChangeSubAccountListString () {
      this.subAccountListString = this.subAccountListString.replace(/[\t]/g, ',')
      this.subAccountListString = this.subAccountListString.replace(/[ ]/g, '')
      this.dataErrorTips = ''
    },
    onBack () {
      this.secondStepShowing = false
      this.$emit('close', true)
    },
    onClose (value: boolean) {
      this.$emit('close', value)
      this.secondStepShowing = false
      this.subAccountListString = ''
    },
    async onNext () {
      if (!this.subAccountListString) {
        return
      }
      this.onNextLoading = true
      this.subAccounts = []
      this.subAccountsEntered = 0
      this.subAccountsUnqualified = 0
      this.subAccountsMinted = 0
      this.totalAmountCKB = 0
      const _subAccounts = this.subAccountListString.split('\n')
      const subAccountList: ISubAccount[] = []
      this.dataErrorTips = ''

      for (const account of _subAccounts) {
        if (!account.replace(/\s+/g, '')) {
          break
        }
        const params = account.split(/[,|，]/)

        if (params.length < 3) {
          this.dataErrorTips = this.$tt('Format error')
          this.onNextLoading = false
          return
        }

        const ethAddressVerified = await validate(params[1].trim(), `required|address:${ETH.symbol}`)
        const tronAddressVerified = await validate(params[1].trim(), `required|address:${TRON.symbol}`)
        const dotbitAccountVerified = /\.bit$/.test(params[1].trim())
        if (!(ethAddressVerified.valid || tronAddressVerified.valid || dotbitAccountVerified)) {
          this.dataErrorTips = this.$tt('SubDIDs are only supported for ETH/BSC/Polygon/Tron addresses now. Your information contains invalid addresses. Also, you can try "name,.bit account,years".')
          this.onNextLoading = false
          this.$alert({
            title: this.$tt('Error'),
            message: this.$tt('There is an error at this address ({address})', { address: params[1].trim() })
          })
          return
        }

        const registerYears = Number(params[2].trim())
        const registerYearsVerified = await validate(registerYears, 'integer')
        if (!(registerYears > 0 && registerYears <= 20 && registerYearsVerified.valid)) {
          this.dataErrorTips = this.$tt('The number of years of registration must be a positive integer less than or equal to 20')
          this.onNextLoading = false
          return
        }

        let coinType = ''
        let toAccount = ''
        if (ethAddressVerified.valid) {
          coinType = CoinType.eth
        }
        else if (tronAddressVerified.valid) {
          coinType = CoinType.trx
        }
        else if (dotbitAccountVerified) {
          toAccount = params[1].trim()
        }

        if (toAccount) {
          subAccountList.push({
            type: 'blockchain',
            mint_for_account: toAccount,
            account: params[0].trim().toLowerCase() + '.' + this.accountInfo.account,
            register_years: registerYears,
            account_char_str: splitAccount(params[0].trim().toLowerCase())
          })
        }
        else {
          subAccountList.push({
            type: 'blockchain',
            key_info: {
              coin_type: coinType,
              key: params[1].trim()
            },
            account: params[0].trim().toLowerCase() + '.' + this.accountInfo.account,
            register_years: registerYears,
            account_char_str: splitAccount(params[0].trim().toLowerCase())
          })
        }
      }

      try {
        const res = await this.$services.subAccount.checkSubAccount({
          account: this.accountInfo.account,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          sub_account_list: subAccountList
        })
        this.subAccountsEntered = subAccountList.length

        if (res && res.result) {
          res.result.forEach((account) => {
            if (account.status === CHECK_SUB_ACCOUNT_STATUS.ok) {
              this.totalAmountCKB += account.register_years
              this.subAccounts.push(account)
            }
            else if (account.status === CHECK_SUB_ACCOUNT_STATUS.fail) {
              this.subAccountsUnqualified += 1
            }
            else if ([CHECK_SUB_ACCOUNT_STATUS.registered, CHECK_SUB_ACCOUNT_STATUS.registering].includes(<number>account.status)) {
              this.subAccountsMinted += 1
            }
          })
          this.$emit('close', false)
          this.secondStepShowing = true
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeAccountIsExpired) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('The account has expired. If you need to continue using it, please renew it.')
          })
        }
        else {
          this.$alert({
            title: this.$tt('Error'),
            message: err.code ? `${err.code}: ${err.message}` : err
          })
        }
      }
      finally {
        this.onNextLoading = false
      }
    },
    async onMint () {
      this.confirmLoading = true

      try {
        const res = await this.$services.subAccount.createSubAccount({
          account: this.accountInfo.account,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          sub_account_list: this.subAccounts
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

        await this.$services.subAccount.sendTransaction(res)
        this.secondStepShowing = false
        this.subAccountListString = ''
        this.$emit('submitted', this.subAccounts.length)
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 })
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit || err.code === errno.apiErrorCodeMintSubAccountsTaskInProgress || err.code === errno.apiErrorCodeMintSubAccountsCheckFailed) {
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
          else if (err.code === errno.apiErrorCodeSubAccountsCustomScriptSet) {
            this.customScriptSetDialogShowing = true
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
          else if (err.code === errno.apiErrorCodeTaskNotCompleted) {
            this.taskNotCompletedDialogShowing = true
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
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.create-sub-account {

  .create-sub-account_tips {
    font-weight: 400;
    color: $tips-font-color;
    line-height: 16px;
  }

  .create-sub-account_example {
    font-weight: 500;
    color: $tips-font-color;
    line-height: 16px;
    border-left: 2px solid $container-border-color;
    padding-left: 8px;
    margin-top: 8px;
  }

  .create-sub-account_example_tips {
    margin-top: 8px;
    font-weight: 400;
    color: $tips-font-color;
    line-height: 16px;
  }

  .create-sub-account_for-account {
    margin: 24px 0 4px 0;
    font-weight: 500;
    color: $primary-font-color;
    line-height: 16px;
  }

  .create-sub-account_for-account_account {
    color: $success-font-color;
  }

  .create-sub-account_sub-accounts-details {
    display: grid;
    grid-row-gap: 6px;
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 16px;
    background: $normal-color;
    border: $container-border;
  }

  .create-sub-account_sub-accounts-details_container {
    display: flex;
    justify-content: space-between;
  }

  .create-sub-account_sub-accounts-details_label {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: $assist-font-color;
  }

  .create-sub-account_sub-accounts-details_label_faq {
    margin-left: 4px;
  }

  .create-sub-account_sub-accounts-details_value {
    font-weight: bold;
    color: $primary-font-color;
  }

  .create-sub-account_sub-accounts-details_amount {
    font-weight: 500;
    color: $primary-color;
  }

  .create-sub-account_confirm_actions {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 8px;
    grid-template-columns: repeat(2, 1fr);
  }

  .create-sub-account_table_container {
    max-height: 264px;
    overflow: scroll;
  }

  .create-sub-account_table {
    border-radius: 8px;
    border-spacing: 1px;
    background: $container-border-color;
    overflow: hidden;
  }

  .create-sub-account_list_header {
    background: #EEEFF1;
    text-align: left;

    th {
      padding: 14px 12px;
      height: 17px;
      word-break: keep-all;
    }
  }

  .create-sub-account_table_field {
    display: inline-block;
    width: max-content;
  }

  .create-sub-account_list_body {
    td {
      font-weight: 500;
      padding: 14px 12px;
      background: $white;
    }

    &:hover {
      td {
        background: #EEEFF1;
      }
    }
  }

  .create-sub-account_list_sub-account {
    font-weight: bold;
    color: #E4B169;
  }

  .create-sub-account_error-tips {
    margin-top: 4px;
    font-size: $font-size-12;
    font-weight: 500;
    color: $error-font-color;
    line-height: 14px;
    text-align: left;
  }

  .create-sub-account_task-not-completed_item {
    margin-top: 8px;
    display: inline-grid;
    grid-auto-flow: column;
    grid-column-gap: 2px;
    grid-template-columns: 14px auto;
    font-weight: 500;
  }

  .create-sub-account_task-not-completed_faq {
    display: block;
    margin-top: 10px;
    font-weight: 500;
    line-height: 20px;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  &.create-sub-account_mobile {

  }
}
</style>
