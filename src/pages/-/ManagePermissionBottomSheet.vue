<template>
  <div>
    <Dialog
      :showing="selectModificationShowing"
      :title="$tt('Modify Permissions')"
      closeButton
      @close="onClose"
    >
      <WarningAlert>
        {{ $tt('A change of permission means transferring ownership or management of this account to another person. Please proceed with caution!') }}
      </WarningAlert>
      <ul class="manage-permission-bottom-sheet__permissions">
        <li
          class="manage-permission-bottom-sheet__permissions__item manage-permission-bottom-sheet__owner"
          @click="modifyOwner"
        >
          <span>
            <h2 class="manage-permission-bottom-sheet__permissions__title">{{ $tt('Modify Owner') }}</h2>
            <span class="manage-permission-bottom-sheet__permissions__desc">{{ $tt('You will lose control of your account permanently') }}</span>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#121314" size="16" />
          </span>
        </li>
        <li
          class="manage-permission-bottom-sheet__permissions__item manage-permission-bottom-sheet__manager"
          @click="modifyManager"
        >
          <span>
            <h2 class="manage-permission-bottom-sheet__permissions__title">{{ $tt('Modify Manager') }}</h2>
            <span class="manage-permission-bottom-sheet__permissions__desc">{{ $tt('Management rights will be transferred to someone else (you will still have Owner rights)') }}</span>
          </span>
          <span>
            <Iconfont name="arrow-right" color="#121314" size="16" />
          </span>
        </li>
      </ul>
    </Dialog>
    <!--  Modify Owner  -->
    <Dialog
      :showing="modifyOwnerShowing"
      :title="$tt('Modify Owner')"
      closeButton
      @close="onClose"
    >
      <ValidationObserver
        ref="modifyOwnerNextForm"
        tag="form"
        @submit.prevent="modifyOwnerNext"
      >
        <WarningAlert>
          {{ $tt('You are modifying the Owner rights of {accountName}, after that you will lose control of this account permanently. Please proceed with caution!', { accountName: toHashedStyle(accountInfo.account) }) }}
        </WarningAlert>
        <div class="manage-permission-bottom-sheet__tips">
          <span>*</span>
          <span>
            {{ $tt('It is not recommended to use any hardware wallet except Ledger and the latest version of OneKey. You may not be able to use .bit normally.') }}
            <a
              class="manage-permission-bottom-sheet__tips__link"
              href="https://talk.did.id/t/faq-bestdas-com/116#it-is-not-recommended-to-use-hardware-wallets-why-30"
              target="_self"
            >
              {{ $tt('Why?') }}
            </a>
          </span>
        </div>
        <div class="manage-permission-bottom-sheet__modify">
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('From {chain} address', { chain: accountInfo.owner_chain_type && ChainTypeToChain[accountInfo.owner_chain_type].symbol }) }}
          </label>
          <a
            v-if="accountInfo.owner_chain_type"
            class="manage-permission-bottom-sheet__link"
            :href="`${ChainTypeToChain[accountInfo.owner_chain_type].explorerAddress}${accountInfo.owner}`"
            target="_blank"
          >
            {{ accountInfo.owner }}
          </a>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('Change to') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Public Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newOwner.chain"
              :options="chainOptions"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('Address') }}
          </label>
          <AccountInput
            :chain="ChainTypeToChain[newOwner.chain]"
            :name="$tt('Address')"
            :placeholder="$tt('DAS account or {symbol} address', { symbol: newOwner.chain && ChainTypeToChain[newOwner.chain].symbol })"
            top
            @input="onInputNewOwnerAddress"
          />
        </div>
        <Button
          class="manage-permission-bottom-sheet__button"
          type="submit"
          block
          status="success"
          shape="round"
        >
          {{ $tt('Next') }}
        </Button>
      </ValidationObserver>
    </Dialog>
    <Dialog
      :showing="modifyOwnerConfirmShowing"
      :title="$tt('Modify Owner')"
      closeButton
      @close="onClose"
    >
      <WarningAlert>
        {{ $tt('After the modification, the ownership of {account} is completely transferred to someone else and you will lose control of {account} permanently.', { account: toHashedStyle(accountInfo.account) }) }}
      </WarningAlert>
      <div class="manage-permission-bottom-sheet__confirm">
        <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-16">
          {{ $tt('From {chain} address', { chain: accountInfo.owner_chain_type && ChainTypeToChain[accountInfo.owner_chain_type].symbol }) }}
        </label>
        <a
          v-if="accountInfo.owner_chain_type"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__margin-bottom-20"
          :href="`${ChainTypeToChain[accountInfo.owner_chain_type].explorerAddress}${accountInfo.owner}`"
          target="_blank"
        >
          {{ accountInfo.owner }}
        </a>
        <label class="manage-permission-bottom-sheet__label">
          {{ $tt('Change to {chain} address', { chain: newOwner.chain && ChainTypeToChain[newOwner.chain].symbol }) }}
        </label>
        <a
          v-if="newOwner.chain"
          class="manage-permission-bottom-sheet__link"
          :href="`${ChainTypeToChain[newOwner.chain].explorerAddress}${newOwner.address}`"
          target="_blank"
        >
          {{ newOwner.address }}
        </a>
      </div>
      <div class="manage-permission-bottom-sheet__second-confirmation">
        <Checkbox
          v-model="modifyOwnerSecondConfirmation"
        >
          {{ $tt("I am aware of the risks") }}
        </Checkbox>
      </div>
      <WalletConnectTips />
      <Button
        class="manage-permission-bottom-sheet__button"
        :loading="modifyOwnerConfirmLoading"
        :disabled="!modifyOwnerSecondConfirmation"
        block
        status="success"
        shape="round"
        @click="modifyOwnerConfirm"
      >
        {{ $tt('Confirm') }}
      </Button>
    </Dialog>
    <!--  Modify Manager  -->
    <Dialog
      :showing="modifyManagerShowing"
      :title="$tt('Modify Manager')"
      closeButton
      @close="onClose"
    >
      <ValidationObserver
        ref="modifyManagerNextForm"
        tag="form"
        @submit.prevent="modifyManagerNext"
      >
        <div class="manage-permission-bottom-sheet__modify">
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('From {chain} address', { chain: accountInfo.manager_chain_type && ChainTypeToChain[accountInfo.manager_chain_type].symbol }) }}
          </label>
          <a
            v-if="accountInfo.manager_chain_type"
            class="manage-permission-bottom-sheet__link"
            :href="`${ChainTypeToChain[accountInfo.manager_chain_type].explorerAddress}${accountInfo.manager}`"
            target="_blank"
          >
            {{ accountInfo.manager }}
          </a>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('Change to') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Public Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newManager.chain"
              :options="chainOptions"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-32">
            {{ $tt('Address') }}
          </label>
          <AccountInput
            :chain="ChainTypeToChain[newManager.chain]"
            :name="$tt('Address')"
            :placeholder="$tt('DAS account or {symbol} address', { symbol: newManager.chain && ChainTypeToChain[newManager.chain].symbol })"
            @input="onInputNewManagerAddress"
          />
        </div>
        <Button
          class="manage-permission-bottom-sheet__button"
          type="submit"
          block
          status="success"
          shape="round"
        >
          {{ $tt('Next') }}
        </Button>
      </ValidationObserver>
    </Dialog>
    <Dialog
      :showing="modifyManagerConfirmShowing"
      :title="$tt('Modify Manager')"
      closeButton
      @close="onClose"
    >
      <WarningAlert>
        {{ $tt('After the change, the management of this account will be transferred to someone else. You will still have Owner rights.') }}
      </WarningAlert>
      <div class="manage-permission-bottom-sheet__confirm">
        <label class="manage-permission-bottom-sheet__label manage-permission-bottom-sheet__margin-top-16">
          {{ $tt('From {chain} address', { chain: accountInfo.manager_chain_type && ChainTypeToChain[accountInfo.manager_chain_type].symbol }) }}
        </label>
        <a
          v-if="accountInfo.manager_chain_type"
          class="manage-permission-bottom-sheet__link manage-permission-bottom-sheet__margin-bottom-20"
          :href="`${ChainTypeToChain[accountInfo.manager_chain_type].explorerAddress}${accountInfo.manager}`"
          target="_blank"
        >
          {{ accountInfo.manager }}
        </a>
        <label class="manage-permission-bottom-sheet__label">
          {{ $tt('Change to {chain} address', { chain: newManager.chain && ChainTypeToChain[newManager.chain].symbol }) }}
        </label>
        <a
          v-if="newManager.chain"
          class="manage-permission-bottom-sheet__link"
          :href="`${ChainTypeToChain[newManager.chain].explorerAddress}${newManager.address}`"
          target="_blank"
        >
          {{ newManager.address }}
        </a>
      </div>
      <div class="manage-permission-bottom-sheet__second-confirmation">
        <Checkbox
          v-model="modifyManagerSecondConfirmation"
        >
          {{ $tt("I am aware of the risks") }}
        </Checkbox>
      </div>
      <WalletConnectTips />
      <Button
        class="manage-permission-bottom-sheet__button"
        :loading="modifyManagerConfirmLoading"
        :disabled="!modifyManagerSecondConfirmation"
        block
        status="success"
        shape="round"
        @click="modifyManagerConfirm"
      >
        {{ $tt('Confirm') }}
      </Button>
    </Dialog>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { validate, ValidationObserver, ValidationProvider } from 'vee-validate'
import { IAccountInfo } from '~/services/Account'
import {
  BSC,
  ChainType,
  ChainTypeToChain, CKB,
  ETH,
  NEW_LOCK_SCRIPT_TYPE,
  Polygon,
  TRON
} from '~/constant/chain'
import AccountInput from '~/components/form/AccountInput.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import Button from '~/components/Button.vue'
import Select from '~/components/form/Select.vue'
import Checkbox from '~/components/form/Checkbox.vue'
import errno from '~/constant/errno'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { COMMON_KEYS } from '~/store/common'
import { mmJsonHashAndChainIdHex, sleep, toHashedStyle } from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'
import { SUB_ACCOUNT_ACTIONS, SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import WarningAlert from '~/components/WarningAlert.vue'

export default Vue.extend({
  name: 'ManagePermissionBottomSheet',
  components: {
    ValidationProvider,
    ValidationObserver,
    Dialog,
    Iconfont,
    Checkbox,
    Select,
    Button,
    WalletConnectTips,
    AccountInput,
    WarningAlert
  },
  model: {
    prop: 'selectModificationShowing',
    event: 'close'
  },
  props: {
    selectModificationShowing: {
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
      ChainTypeToChain,
      modifyOwnerShowing: false,
      modifyOwnerConfirmShowing: false,
      modifyOwnerConfirmLoading: false,
      modifyOwnerSecondConfirmation: false,
      modifyManagerShowing: false,
      modifyManagerConfirmShowing: false,
      modifyManagerConfirmLoading: false,
      modifyManagerSecondConfirmation: false,
      newOwner: {
        chain: ChainType.eth,
        address: ''
      },
      newManager: {
        chain: ChainType.eth,
        address: ''
      },
      chainOptions: [{
        text: ETH.name,
        value: ChainType.eth,
        icon: ETH.icon
      }, {
        text: BSC.name,
        value: ChainType.bsc,
        icon: BSC.icon
      }, {
        text: TRON.name,
        value: ChainType.tron,
        icon: TRON.icon
      }, {
        text: Polygon.name,
        value: ChainType.polygon,
        icon: Polygon.icon
      }]
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    editOwnerThrottle (): number {
      const value = this.common.config.transfer_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    },
    editManagerThrottle (): number {
      const value = this.common.config.edit_manager_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
  },
  methods: {
    toHashedStyle,
    onClose (value: boolean) {
      this.$emit('close', value)
      this.modifyOwnerShowing = false
      this.modifyOwnerConfirmShowing = false
      this.modifyManagerShowing = false
      this.modifyManagerConfirmShowing = false
      this.modifyOwnerSecondConfirmation = false
      this.modifyManagerSecondConfirmation = false
      this.newOwner.address = ''
      this.newManager.address = ''
      ;(this.$refs.modifyOwnerNextForm as HTMLFormElement)?.reset()
      ;(this.$refs.modifyManagerNextForm as HTMLFormElement)?.reset()
    },
    modifyOwner () {
      this.$emit('close', false)
      this.modifyOwnerShowing = true
    },
    async modifyOwnerNext () {
      const verified = await (this.$refs.modifyOwnerNextForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }

      const addressVerified = await validate(this.newOwner.address, `required|address:${ChainTypeToChain[this.newOwner.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyOwnerShowing = false
      this.modifyOwnerConfirmShowing = true
    },
    async modifyOwnerConfirm () {
      if (this.isSubAccount) {
        this.modifySubAccountOwnerConfirm()
        return
      }
      const addressVerified = await validate(this.newOwner.address, `required|address:${ChainTypeToChain[this.newOwner.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyOwnerConfirmLoading = true

      try {
        const res = await this.$services.account.editOwner({
          chain_type: this.computedChainType,
          evm_chain_id: this.computedChainId,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          raw_param: {
            receiver_chain_type: [ChainType.bsc, ChainType.polygon].includes(this.newOwner.chain) ? ChainType.eth : this.newOwner.chain,
            receiver_address: this.newOwner.address
          }
        })

        if (!res) {
          return
        }

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

        this.modifyOwnerConfirmShowing = false
        this.modifyOwnerSecondConfirmation = false
        this.newOwner.address = ''
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 }),
          txHash: hash,
          txHashLink: `${CKB.explorerTrx}${hash}`
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editOwnerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeTransferAccountSameAddress) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('No need to transfer. You can view all .bit accounts under the current address.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeAccountIsExpired) {
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
      }
      finally {
        this.modifyOwnerConfirmLoading = false
      }
    },
    async modifySubAccountOwnerConfirm () {
      const addressVerified = await validate(this.newOwner.address, `required|address:${ChainTypeToChain[this.newOwner.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyOwnerConfirmLoading = true

      try {
        const _newChainId = [ChainType.bsc, ChainType.polygon].includes(this.newOwner.chain) ? ChainType.eth : this.newOwner.chain
        const _newCoinType = ChainTypeToChain[_newChainId].coinType
        const res = await this.$services.subAccount.editSubAccount({
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          account: this.accountInfo.account,
          edit_key: SUB_ACCOUNT_ACTIONS.owner,
          edit_value: {
            owner: {
              type: 'blockchain',
              key_info: {
                coin_type: _newCoinType,
                key: this.newOwner.address
              }
            }
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

        await this.$services.subAccount.sendTransaction(res)

        this.modifyOwnerConfirmShowing = false
        this.modifyOwnerSecondConfirmation = false
        this.newOwner.address = ''
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 })
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editOwnerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeTransferAccountSameAddress) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('No need to transfer. You can view all .bit accounts under the current address.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeAccountIsExpired) {
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
      }
      finally {
        this.modifyOwnerConfirmLoading = false
      }
    },
    modifyManager () {
      this.$emit('close', false)
      this.modifyManagerShowing = true
    },
    async modifyManagerNext () {
      const verified = await (this.$refs.modifyManagerNextForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }

      const addressVerified = await validate(this.newManager.address, `required|address:${ChainTypeToChain[this.newManager.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyManagerShowing = false
      this.modifyManagerConfirmShowing = true
    },
    async modifyManagerConfirm () {
      if (this.isSubAccount) {
        this.modifySubAccountManagerConfirm()
        return
      }
      const addressVerified = await validate(this.newManager.address, `required|address:${ChainTypeToChain[this.newManager.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyManagerConfirmLoading = true

      try {
        const res = await this.$services.account.editManager({
          evm_chain_id: this.computedChainId,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          raw_param: {
            manager_chain_type: [ChainType.bsc, ChainType.polygon].includes(this.newManager.chain) ? ChainType.eth : this.newManager.chain,
            manager_address: this.newManager.address
          }
        })

        if (!res) {
          return
        }

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

        this.modifyManagerConfirmShowing = false
        this.modifyManagerSecondConfirmation = false
        this.newManager.address = ''
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 }),
          txHash: hash,
          txHashLink: `${CKB.explorerTrx}${hash}`
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editManagerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeTransferAccountSameAddress) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('No need to transfer. You can view all .bit accounts under the current address.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeAccountIsExpired) {
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
      }
      finally {
        this.modifyManagerConfirmLoading = false
      }
    },
    async modifySubAccountManagerConfirm () {
      const addressVerified = await validate(this.newManager.address, `required|address:${ChainTypeToChain[this.newManager.chain].symbol}`)
      if (!addressVerified.valid) {
        return
      }

      this.modifyManagerConfirmLoading = true

      try {
        const _newChainId = [ChainType.bsc, ChainType.polygon].includes(this.newManager.chain) ? ChainType.eth : this.newManager.chain
        const _newCoinType = ChainTypeToChain[_newChainId].coinType
        const res = await this.$services.subAccount.editSubAccount({
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          account: this.accountInfo.account,
          edit_key: SUB_ACCOUNT_ACTIONS.manager,
          edit_value: {
            manager: {
              type: 'blockchain',
              key_info: {
                coin_type: _newCoinType,
                key: this.newManager.address
              }
            }
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

        await this.$services.subAccount.sendTransaction(res)

        this.modifyManagerConfirmShowing = false
        this.modifyManagerSecondConfirmation = false
        this.newManager.address = ''
        this.$alert({
          title: this.$tt('Submitted'),
          message: this.$tt('Approximately {number} minutes.', { number: 3 })
        })
      }
      catch (err: any) {
        console.error(err)
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editManagerThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
            })
          }
          else if (err.code === errno.apiErrorCodeTransferAccountSameAddress) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('No need to transfer. You can view all .bit accounts under the current address.')
            })
          }
          else if (err.code === errno.apiErrorCodeResolveFailed) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Frequent operations. There are still transactions being processed in your wallet address, please try again after 30s.')
            })
          }
          else if (err.code === errno.apiErrorCodeAccountIsExpired) {
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
      }
      finally {
        this.modifyManagerConfirmLoading = false
      }
    },
    onInputNewOwnerAddress (value: string) {
      if (value) {
        this.newOwner.address = value
      }
    },
    onInputNewManagerAddress (value: string) {
      if (value) {
        this.newManager.address = value
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.manage-permission-bottom-sheet__permissions {
  margin-top: 32px;
}

.manage-permission-bottom-sheet__permissions__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
}

.manage-permission-bottom-sheet__owner {
  margin-bottom: 16px;
  background: $success-color;

  &:hover {
    opacity: 0.7;
  }
}

.manage-permission-bottom-sheet__manager {
  background: #5576F9;

  &:hover {
    opacity: 0.7;
  }
}

.manage-permission-bottom-sheet__permissions__title {
  font-size: $font-size-18;
  font-weight: 500;
  color: $white;
  line-height: 21px;
}

.manage-permission-bottom-sheet__permissions__desc {
  margin-right: 8px;
  font-size: $font-size-14;
  font-weight: 400;
  color: $white;
  line-height: 16px;
  margin-top: 4px;
  display: inline-block;
  opacity: 0.7;
}

.manage-permission-bottom-sheet__button {
  margin-top: 32px;
}

.manage-permission-bottom-sheet__modify {
  margin-bottom: 40px;
}

.manage-permission-bottom-sheet__label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  line-height: 16px;
}

.manage-permission-bottom-sheet__link {
  display: inline-block;
  word-break: break-word;
  line-height: 17px;
  color: $link-font-color;
  font-family: $monospace-font-family;

  &:hover {
    color: $link-hover-font-color;
  }
}

.manage-permission-bottom-sheet__margin-top-32 {
  margin-top: 32px;
}

.manage-permission-bottom-sheet__margin-bottom-20 {
  margin-bottom: 20px;
}

.manage-permission-bottom-sheet__confirm {
  margin: 32px 0;
  padding: 12px;
  border-radius: 12px;
  background: #EDF0F2;
  border: $container-border;
}

.manage-permission-bottom-sheet__second-confirmation {
  margin-bottom: 32px;
}

.manage-permission-bottom-sheet__tips {
  margin-top: 8px;
  display: inline-grid;
  grid-auto-flow: column;
  grid-column-gap: 2px;
  grid-template-columns: 7px auto;
  font-size: $font-size-14;
  font-weight: 400;
  color: $assist-font-color;
  line-height: 17px;
  word-break: break-word;
  hyphens: auto;
}

.manage-permission-bottom-sheet__tips__link {
  color: $link-font-color;

  &:hover {
    color: $link-hover-font-color;
  }
}
</style>
