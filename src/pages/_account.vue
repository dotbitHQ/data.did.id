<template>
  <div :class="['account', {'account_mobile': isMobile}]">
    <AccountStatusCard
      :accountInfo="accountInfo"
      :description="description.value"
      :avatar="avatar.value"
      :editMode="enableEditRecordMode"
      root
      @editAvatar="editAvatar"
      @editDescription="editDescription"
      @settings="onSettings"
    />
    <ParsingRecords
      ref="parsingRecords"
      :editMode="enableEditRecordMode"
      :accountInfo="accountInfo"
      :accountRecords="accountRecords"
      :enableSubAccount="enableSubAccount"
      :loading="loading"
      @avatar="onAvatar"
      @description="onDescription"
      @exitEditMode="onExitEditMode"
      @enableEditMode="onManageRecord"
      @settings="onSettings"
    />
    <ManagePermissionBottomSheet
      v-model="managePermissionShowing"
      :accountInfo="accountInfo"
    />
    <RenewalBottomSheet
      v-model="renewalShowing"
      :accountInfo="accountInfo"
    />
    <NotManagerTips v-model="notManagerTipsShowing" />
    <NotOwnerTips v-model="notOwnerTipsShowing" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { mapGetters, mapState } from 'vuex'
import { findParsingRecordChain } from '~/modules/tools'
import AccountStatusCard from '~/pages/-/AccountStatusCard.vue'
import { IAccountInfo, IAccountParsingRecord, ParsingRecordProfileKey, ParsingRecordType } from '~/services/Account'
import { COMMON_KEYS } from '~/store/common'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import { ACCOUNT_STATUS, SETTINGS } from '~/constant'
import ParsingRecords from '~/pages/-/ParsingRecords.vue'
import ManagePermissionBottomSheet from '~/pages/-/ManagePermissionBottomSheet.vue'
import RenewalBottomSheet from '~/pages/-/RenewalBottomSheet.vue'
import { SUB_ACCOUNT_ENABLE_STATUS, SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import { domain, superDid } from '~~/config'
import NotManagerTips from '~/pages/-/NotManagerTips.vue'
import NotOwnerTips from '~/pages/-/NotOwnerTips.vue'
import errno from '~/constant/errno'

export default defineComponent({
  name: 'Account',
  head (): { [key: string]: any } {
    const image = `https://display.did.id/seo/${this.accountName}?v=1`
    let description: any[] = []
    if (this.description.value) {
      description = [
        { hid: 'description', name: 'description', content: this.description.value },
        { hid: 'og:description', property: 'og:description', content: this.description.value },
        { hid: 'twitter:description', name: 'twitter:description', content: this.description.value },
      ]
    }
    const url = `${domain}${this.accountName}`

    return {
      title: this.accountName,
      meta: [
        // The Open Graph protocol
        { hid: 'og:title', property: 'og:title', content: this.accountName },
        { hid: 'og:site_name', property: 'og:site_name', content: this.accountName },
        { hid: 'og:url', property: 'og:url', content: url },
        { hid: 'og:image', property: 'og:image', content: image },
        // Twitter
        { hid: 'twitter:site', name: 'twitter:site', content: this.accountName },
        { hid: 'twitter:title', name: 'twitter:title', content: this.accountName },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
        { hid: 'twitter:image:alt', name: 'twitter:image:alt', content: this.accountName },
        ...description
      ]
    }
  },
  components: {
    AccountStatusCard,
    ParsingRecords,
    ManagePermissionBottomSheet,
    RenewalBottomSheet,
    NotManagerTips,
    NotOwnerTips,
  },
  data () {
    return {
      accountName: this.$route.params.account,
      accountInfo: {
        account: this.$route.params.account
      } as IAccountInfo,
      renewalShowing: false,
      managePermissionShowing: false,
      enableEditRecordMode: false,
      accountRecords: [] as IAccountParsingRecord[],
      description: {} as IAccountParsingRecord,
      avatar: {} as IAccountParsingRecord,
      enableSubAccount: SUB_ACCOUNT_ENABLE_STATUS.off,
      notManagerTipsShowing: false,
      notOwnerTipsShowing: false,
      loading: true
    }
  },
  async asyncData ({ app, params, store, redirect }) {
    const accountName = params.account
    let accountInfo = {
      account: accountName
    } as IAccountInfo
    let enableSubAccount = SUB_ACCOUNT_ENABLE_STATUS.off
    let accountRecords: IAccountParsingRecord[] = []
    if (accountName) {
      store.dispatch(COMMON_KEYS.fetchConfig)
      try {
        const res = await app.$services.account.accountInfo(accountName)
        if (res) {
          accountInfo = res
          if (accountInfo) {
            enableSubAccount = accountInfo.enable_sub_account
          }
          if (res.status === ACCOUNT_STATUS.subAccountNotCreated) {
            redirect(`/not-created/${accountName}`)
          }
          else if (res.status === ACCOUNT_STATUS.onCross) {
            redirect(`/on-cross/${accountName}`)
          }
          else if ([ACCOUNT_STATUS.notOpenRegister, ACCOUNT_STATUS.reservedAccount, ACCOUNT_STATUS.candidateAccount, ACCOUNT_STATUS.unavailableAccount].includes(res.status)) {
            redirect(`/error/${accountName}`)
          }
          else if (![ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.expired].includes(res.status)) {
            redirect(`/registerable/${accountName}`)
          }
        }
        const { records } = await app.$services.account.accountParsingRecords(accountName)
        if (records) {
          accountRecords = records.map((record: IAccountParsingRecord) => {
            if (record.type === ParsingRecordType.address) {
              const ret = findParsingRecordChain(record.key)
              return {
                ...record,
                key: ret.coinType
              }
            }
            else {
              return record
            }
          })
        }
        return {
          accountName,
          accountInfo,
          enableSubAccount,
          accountRecords,
          loading: false
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeAccountNotExist) {
          redirect(`/registerable/${accountName}`)
        }
        else {
          redirect(`/error/${accountName}`)
        }
      }
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
    },
    loggedIn (): boolean {
      return !!this.me.connectedAccount.address
    },
    canManage (): boolean {
      return ![ACCOUNT_STATUS.onePriceSell].includes(this.accountInfo.status)
    },
    isOwner (): boolean {
      return !!this.accountInfo.owner && this.connectedAccount.address.toUpperCase() === this.accountInfo.owner.toUpperCase()
    },
    isManager (): boolean {
      return !!this.accountInfo.manager && this.connectedAccount.address.toUpperCase() === this.accountInfo.manager.toUpperCase()
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountName)
    }
  },
  async mounted () {
    const action = this.$route.query.action
    if (action === 'renew' && !this.isSubAccount && [ACCOUNT_STATUS.registered, ACCOUNT_STATUS.onePriceSell, ACCOUNT_STATUS.expired].includes(this.accountInfo.status)) {
      this.onSettings(SETTINGS.renew)
    }
  },
  methods: {
    onAvatar (value: IAccountParsingRecord) {
      this.avatar = value
    },
    onDescription (value: IAccountParsingRecord) {
      this.description = value
    },
    onManageRecord () {
      if (!this.isManager) {
        this.notManagerTipsShowing = true
      }
      else if (!this.canManage) {
        this.$alert({
          title: this.$tt('Tips'),
          message: this.$tt('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
        })
      }
      else {
        if (this.enableEditRecordMode) {
          return
        }
        this.enableEditRecordMode = true
        this.managePermissionShowing = false
      }
    },
    onExitEditMode (notClear?: boolean) {
      this.enableEditRecordMode = false
      if (!notClear) {
        this.getAccountRecords()
      }
    },
    async getAccountRecords () {
      try {
        const res = await this.$services.account.accountParsingRecords(this.accountInfo.account)
        if (res?.records) {
          this.accountRecords = res.records.map((record) => {
            if (record.type === ParsingRecordType.address) {
              const ret = findParsingRecordChain(record.key)
              return {
                ...record,
                key: ret.coinType
              }
            }
            else {
              return record
            }
          })
        }
      }
      catch (err) {
        console.error(err)
      }
    },
    editDescription () {
      if (this.description.value) {
        ;(this.$refs.parsingRecords as any).modifyParsingRecord(this.description)
      }
      else {
        ;(this.$refs.parsingRecords as any).addNewRecord(ParsingRecordType.profile, ParsingRecordProfileKey.description)
      }
    },
    editAvatar () {
      if (this.avatar.value) {
        ;(this.$refs.parsingRecords as any).modifyParsingRecord(this.avatar)
      }
      else {
        ;(this.$refs.parsingRecords as any).addNewRecord(ParsingRecordType.profile, ParsingRecordProfileKey.avatar)
      }
    },
    onManagePermission () {
      if (!this.isOwner) {
        this.notOwnerTipsShowing = true
      }
      else if (!this.canManage) {
        this.$alert({
          title: this.$tt('Tips'),
          message: this.$tt('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
        })
      }
      else {
        if (this.enableEditRecordMode) {
          this.onExitEditMode()
        }
        this.enableEditRecordMode = false
        this.managePermissionShowing = true
      }
    },
    async onSettings (value: string) {
      if (value === SETTINGS.superDid) {
        const link = `${superDid}/manage/sub-account/?nav=${this.accountName}&tab=PricingScheme`
        if (this.isMobile) {
          window.location.href = link
        }
        else {
          window.open(link)
        }
        return
      }

      if (!this.loggedIn) {
        this.$walletSdk.walletsConnect()
        return
      }

      if (value === SETTINGS.manageData) {
        this.onManageRecord()
      }
      else if (value === SETTINGS.changePermission) {
        this.onManagePermission()
      }
      else if (value === SETTINGS.mintSubAccounts) {
        if (!this.canManage) {
          this.$alert({
            title: this.$tt('Tips'),
            message: this.$tt('If a DAS account is on sale, it is in a special status and cannot be operated other than renewed and delisted.')
          })
        }
        else if (this.enableSubAccount === SUB_ACCOUNT_ENABLE_STATUS.off) {
          if (!this.isOwner) {
            this.notOwnerTipsShowing = true
            return
          }
          this.$router.push(`/sub-accounts/enable/${this.accountName}`)
        }
        else {
          if (!this.isManager) {
            this.notManagerTipsShowing = true
            return
          }
          this.$router.push(`/sub-accounts/${this.accountName}`)
        }
      }
      else if (value === SETTINGS.renew) {
        if (this.enableEditRecordMode) {
          this.onExitEditMode()
        }
        this.renewalShowing = true
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.account {

  &.account_mobile {
    margin: 0 16px 20px 16px;
  }
}
</style>
