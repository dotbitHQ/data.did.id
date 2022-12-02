<template>
  <div :class="['sub-account-gains', {'sub-account-gains_mobile': isMobile}]">
    <div class="sub-account-gains_container">
      <span class="sub-account-gains_info">
        <span>
          <Iconfont
            name="superdid"
            size="60"
          />
        </span>
        <span class="sub-account-gains_info_desc">
          <div class="sub-account-gains_info_desc_title">
            SuperDID
            <span class="sub-account-gains_info_desc_text">{{ $tt('Sell your SubDIDs in one simple link') }}</span>
            <a
              href="https://talk.did.id/t/bit-subdids-are-live/435#h-13-what-is-superdid-23"
              target="_blank"
            >
              <Iconfont
                name="help"
                color="#B0B8BF"
                size="14"
              />
            </a>
          </div>
          <div class="sub-account-gains_income">
            {{ $tt('Income: {amount} CKB.', { amount: thousandSplit(incomeAmount, 2) }) }}
            <span
              class="sub-account-gains_income_withdraw"
              @click="openWithdrawDialog"
            >
              {{ $tt('Withdraw') }}
            </span>
          </div>
        </span>
      </span>
      <Button
        status="success"
        shape="round"
        :href="`${superDid}/manage/sub-account/?nav=${accountName}&tab=PricingScheme`"
        :target="isMobile ? '_self' : '_blank'"
        size="middle"
        :block="isMobile"
      >
        {{ $tt('Go to SuperDID') }}
      </Button>
    </div>
    <Dialog
      :showing="withdrawDialogShowing"
      :title="$tt('Withdraw')"
      closeButton
      @close="closeWithdrawDialog"
    >
      <div class="sub-account-gains_content">
        {{ $tt('All income ({amount} CKB) will be withdrawn to your', { amount: thousandSplit(incomeAmount, 2) }) }}
        <a
          class="sub-account-gains_withdraw_dotbit-balance"
          :href="dotbitBalanceUrl"
          :target="isMobile ? '_self' : '_blank'">
          {{ $tt('dotbit Balance.') }}
        </a>
      </div>
      <template #action>
        <div class="sub-account-gains_withdraw_buttons">
          <Button
            shape="round"
            @click="closeWithdrawDialog"
          >
            {{ $tt('Cancel') }}
          </Button>
          <Button
            :loading="withdrawComfirmLoading"
            shape="round"
            status="success"
            @click="onWithdraw"
          >
            {{ $tt('Comfirm') }}
          </Button>
        </div>
      </template>
    </Dialog>
    <Dialog
      :showing="submittedDialogShowing"
      :title="$tt('Submitted')"
      closeButton
      @close="closeSubmittedDialog"
    >
      <div class="sub-account-gains_content">
        {{ $tt('Approximately 3 minutes.') }}
        <a
          class="sub-account-gains_tx-hash"
          :href="txHashLink"
          target="_blank"
        >
          {{ collapseString(txHash, 5, 5) }}
          <Iconfont
            class="sub-account-gains_tx-hash_icon"
            name="arrow-right"
            color="#B0B8BF"
            size="14"
          />
        </a>
      </div>
      <div
        class="sub-account-gains_withdraw_processing"
      >
        <span class="sub-account-gains_withdraw_processing_icon">
          <Iconfont
            name="loading"
            color="#22C493"
            size="38"
          />
        </span>
        <span class="sub-account-gains_withdraw_processing_title">{{ $tt('Processing') }}</span>
      </div>
    </Dialog>
    <Dialog
      :showing="completedDialogShowing"
      :title="'🎉 ' + $tt('Completed')"
      closeButton
      @close="closeCompletedDialog"
    >
      <div class="sub-account-gains_content">
        {{ $tt('Now you can check your income in your') }}
        <a
          class="sub-account-gains_withdraw_dotbit-balance"
          :href="dotbitBalanceUrl"
          :target="isMobile ? '_self' : '_blank'">
          {{ $tt('dotbit Balance.') }}
        </a>
      </div>
      <template #action>
        <div class="sub-account-gains_withdraw_buttons">
          <Button
            shape="round"
            @click="closeCompletedDialog"
          >
            {{ $tt('OK') }}
          </Button>
          <Button
            shape="round"
            status="success"
            :href="dotbitBalanceUrl"
            :target="isMobile ? '_self' : '_blank'"
          >
            {{ $tt('Check') }}
          </Button>
        </div>
      </template>
    </Dialog>
    <NotOwnerTips v-model="notOwnerTipsShowing" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { collapseString, thousandSplit } from '~/modules/tools'
import Iconfont from '~/components/icon/Iconfont.vue'
import Button from '~/components/Button.vue'
import { superDid, dotbitBalance } from '~~/config'
import Dialog from '~/components/Dialog.vue'
import { SUB_ACCOUNT_ACTIONS } from '~/constant/subAccount'
import { CYCLE_CALL_FUNCTION_TIME, TRX_STATUS } from '~/constant'
import errno from '~/constant/errno'
import { mapGetters, mapState } from 'vuex'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import NotOwnerTips from '~/pages/-/NotOwnerTips.vue'
import { CKB } from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'

export default defineComponent({
  name: 'SubAccountGains',
  components: {
    Iconfont,
    Button,
    Dialog,
    NotOwnerTips
  },
  data () {
    return {
      superDid,
      accountName: this.$route.params.account,
      incomeAmount: '0',
      withdrawDialogShowing: false,
      submittedDialogShowing: false,
      completedDialogShowing: false,
      notOwnerTipsShowing: false,
      txHashLink: '',
      txHash: '',
      withdrawComfirmLoading: false
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
    dotbitBalanceUrl (): string {
      const address = this.connectedAccount?.address
      const chainName = this.connectedAccount?.chain?.name
      return `${dotbitBalance}?originAddress=${address}&originChainName=${chainName}`
    }
  },
  mounted () {
    this.getIncomeAmount()
  },
  methods: {
    collapseString,
    thousandSplit,
    openWithdrawDialog () {
      this.withdrawDialogShowing = true
    },
    closeWithdrawDialog () {
      this.withdrawDialogShowing = false
    },
    openCompletedDialog () {
      this.completedDialogShowing = true
    },
    closeCompletedDialog () {
      this.completedDialogShowing = false
    },
    openSubmittedDialog () {
      this.submittedDialogShowing = true
    },
    closeSubmittedDialog () {
      this.submittedDialogShowing = false
    },
    async getIncomeAmount () {
      try {
        const res = await this.$services.subAccount.subAccountOwnerProfit({
          account: this.accountName,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          }
        })
        if (res) {
          this.incomeAmount = res.owner_profit
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    async onWithdraw () {
      this.withdrawComfirmLoading = true
      try {
        const res = await this.$services.subAccount.profitWithdraw({
          account: this.accountName,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          }
        })
        if (res) {
          this.txHash = res.hash
          this.txHashLink = `${CKB.explorerTrx}/${res.hash}`
          this.closeWithdrawDialog()
          this.checkOrderStatus()
          this.openSubmittedDialog()
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeResolveFailed) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
          })
        }
        else if (err.code === errno.apiErrorCodeNotHaveOwnerPermission) {
          this.notOwnerTipsShowing = true
        }
        else if (err.code === errno.apiErrorCodeProfitNotEnough) {
          this.$alert({
            title: this.$tt('Fail to withdraw'),
            message: this.$tt('Due to the underlying logic constraints of the contract, the minimum amount to be withdrawn is 116 CKB.')
          })
        }
      }
      finally {
        this.withdrawComfirmLoading = false
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
          action: SUB_ACCOUNT_ACTIONS.collect_sub_account_profit
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
          this.closeSubmittedDialog()
          this.openCompletedDialog()
          this.getIncomeAmount()
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.sub-account-gains {

  .sub-account-gains_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    height: 108px;
    background: $white;
    box-shadow: $container-outer-box-shadow;
    border-radius: 24px;
    border: $container-border;
    margin-top: 16px;
  }

  .sub-account-gains_info {
    display: flex;
    align-items: center;
  }

  .sub-account-gains_info_desc {
    margin-left: 16px;
  }

  .sub-account-gains_info_desc_title {
    font-weight: bold;
    color: $tips-font-color;
    margin-bottom: 8px;
  }

  .sub-account-gains_info_desc_text {
    color: $third-font-color;
  }

  .sub-account-gains_income {
    font-weight: 500;
    color: $assist-font-color;
    line-height: 16px;
  }

  .sub-account-gains_income_withdraw {
    color: $link-font-color;
    cursor: pointer;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  .sub-account-gains_content {
    font-weight: 500;
    color: $tips-font-color;
    line-height: 20px;
  }

  .sub-account-gains_withdraw_dotbit-balance {
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  .sub-account-gains_withdraw_buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: column;
    grid-column-gap: 8px;
  }

  .sub-account-gains_tx-hash {
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: $font-size-12;
    font-weight: 400;
    color: $third-font-color;
    line-height: 14px;
    margin-top: 10px;
  }

  .sub-account-gains_tx-hash_icon {
    margin-left: -2px;
  }

  .sub-account-gains_withdraw_processing {
    margin-top: 32px;
    display: flex;
    align-items: center;
    background: #D6EFE7;
    border-radius: 60px;
    padding: 8px 12px;
    color: $success-font-color;
    font-size: $font-size-12;
  }

  .sub-account-gains_withdraw_processing_icon {
    margin-right: 4px;

    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .sub-account-gains_withdraw_processing_title {
    font-size: $font-size-14;
    font-weight: 600;
    color: $success-font-color;
    line-height: 16px;
  }

  &.sub-account-gains_mobile {
    .sub-account-gains_container {
      height: unset;
      padding: 16px;
      flex-direction: column;
    }

    .sub-account-gains_info {
      margin-bottom: 32px;
    }
  }
}
</style>
