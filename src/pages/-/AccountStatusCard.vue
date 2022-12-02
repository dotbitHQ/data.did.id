<template>
  <div :class="['account-status-card', {'account-status-card_mobile': isMobile}]">
    <div class="account-status-card_container">
      <client-only>
        <span
          v-if="isMobile"
          class="account-status-card_actions_mobile"
        >
          <Dropdown
            class="account-status-card_share"
            :label="$tt('Share to')"
            :options="shareList"
            @select="onShareTo"
          >
            <Iconfont
              name="share"
              size="16"
              color="#121314"
            />
          </Dropdown>
          <Dropdown
            class="account-status-card_view"
            :label="$tt('View on')"
            :options="viewList"
            @select="onView"
          >
            <Iconfont
              name="more"
              size="16"
              color="#121314"
            />
          </Dropdown>
        </span>
      </client-only>
      <div class="account-status-card_account-info">
        <span
          class="account-status-card_icon"
        >
          <IconImage
            :url="avatar ? avatar : `${IDENTICON_SERVE}${accountInfo.account}`"
            :alt="accountInfo.account"
            :size="isMobile ? 72 : 150"
            rounded
          />
          <span
            v-if="editMode"
            class="account-status-card_icon_edit"
            @click="editAvatar"
          >
            <span class="account-status-card_icon_edit-icon">
              <Iconfont name="edit-line" size="20" />
            </span>
          </span>
        </span>
        <div
          class="account-status-card_account-name"
          :style="{ 'font-size': `${accountSize}px` }"
        >
<!--          <template v-if="isSubAccount">-->
<!--            {{ accountInfo.account.split('.')[1] }}<span class="account-status-card_account-name_sub-account">#{{ accountInfo.account.split('.')[0] }}</span>.{{ accountInfo.account.split('.')[2] }}-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            {{ accountInfo.account }}-->
<!--          </template>-->
          {{ accountInfo.account }}
        </div>
        <div
          class="account-status-card_description"
          :class="{
            'pointer': !!description
          }"
          @click="openDescription(description)"
        >
          <div :class="{ 'account-status-card_description_edit-mode': editMode }">
            {{ description ? description : $tt('No description yet~') }}
          </div>
        </div>
      </div>
      <div class="account-status-card_actions">
        <div>
          <ManageButton
            v-if="!isSubAccount"
            class="account-status-card_sub-account"
            :label="$tt('Mint')"
            showLabel
            :options="subAccountOptions"
            @select="onSelectSettings"
          >
            <Iconfont
              v-if="!isMobile"
              class="account-status-card__manage-button-icon"
              name="sub-account"
              size="16"
            />
            {{ $tt('SubDIDs') }}
          </ManageButton>
          <ManageButton
            class="account-status-card_manage"
            :label="$tt('Manage')"
            showLabel
            :options="manageOptions"
            @select="onSelectSettings"
          >
            <Iconfont
              v-if="!isMobile"
              class="account-status-card__manage-button-icon"
              name="settings"
              size="16"
              color="#121314"
            />
            {{ $tt('Manage') }}
          </ManageButton>
          <template v-if="!isMobile">
            <Dropdown
              class="account-status-card_share"
              :label="$tt('Share to')"
              :options="shareList"
              @select="onShareTo"
            >
              <Iconfont
                name="share"
                size="16"
                color="#121314"
              />
            </Dropdown>
            <Dropdown
              class="account-status-card_view"
              :label="$tt('View on')"
              :options="viewList"
              @select="onView"
            >
              <Iconfont
                name="more"
                size="16"
                color="#121314"
              />
            </Dropdown>
          </template>
        </div>
        <div>
          <div v-if="countdownToRecoveryDays > 0">
            <span
              class="account-status-card_account-expired"
              @click="onSelectSettings(SETTINGS.renew)">
              <Iconfont
                name="alert"
                color="#FFFFFF"
                size="12"
              />
              {{ $tt('账号回收提示', { days: countdownToRecoveryDays }) }}
            </span>
          </div>
          <div v-else-if="countdownToExpiredDays > 0">
            <span
              class="account-status-card_account-expired"
              @click="onSelectSettings(SETTINGS.renew)">
              <Iconfont
                name="alert"
                color="#FFFFFF"
                size="12"
              />
              {{ $tt('Expires in {days} days', { days: countdownToExpiredDays }) }}
            </span>
          </div>
          <div class="account-status-card_registration-info_container">
            <span
              v-if="accountInfo.expired_at"
              v-tooltip.top="{
                ref: 'registrationInfoRef',
                class: 'account-status-card_registration-info_tooltip-custom'
              }"
              class="account-status-card_registration-info"
            >
              {{ $tt('Expires {date}', { date: formatDateTime(accountInfo.expired_at, TIME_FORMAT.fullDate) }) }}
              <Iconfont
                class="account-status-card_registration-info_icon"
                name="info"
                size="16"
                color="#B0B8BF"
              />
            </span>
            <span
              v-if="!(countdownToRecoveryDays > 0 || countdownToExpiredDays > 0 || isSubAccount)"
              class="account-status-card_renew_container"
            >
              <span
                class="account-status-card_renew"
                @click="onSelectSettings(SETTINGS.renew)"
              >
                {{ $tt('Renew') }}
              </span>
              <span class="account-status-card_renew_dividing-line"/>
              <span
                v-tooltip.top="{
                  content: '📅 ' + $tt('Add to Calendar'),
                  class: 'account-status-card_registration-info_tooltip-custom'
                }"
                class="account-status-card_remind-me"
                @click="addToCalendar"
              >
                {{ $tt('Remind me') }}
              </span>
            </span>
          </div>
          <div
            v-if="(countdownToRecoveryDays > 0 || countdownToExpiredDays > 0) && !isSubAccount"
            class="account-status-card_renew-now"
            @click="onSelectSettings(SETTINGS.renew)"
          >
            <Iconfont class="account-status-card_renew-now-icon" name="renew" size="24" color="#121314" />
            <span class="account-status-card_renew-now-text">{{ $tt('Renew Now') }}</span>
            <Iconfont class="account-status-card_renew-now-arrow" name="arrow-right" size="16" color="#121314" />
          </div>
          <div
            v-show="tooltipRefShowing"
            ref="registrationInfoRef"
            class="account-status-card_registration-info_ref"
          >
            <div>{{ $tt('Registered: {date}', { date: formatDateTime(accountInfo.registered_at) }) }}</div>
            <div>{{ $tt('Expires: {date}', { date: formatDateTime(accountInfo.expired_at) }) }}</div>
            <div v-if="countdownToRecoveryDays > 0">{{ $tt('To be recycled: {date}', { date: recoveryDate }) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import Decimal from 'decimal.js'
import { ACCOUNT_STATUS, IDENTICON_SERVE, SETTINGS, TIME_FORMAT } from '~/constant'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { IAccountInfo } from '~/services/Account'
import { COMMON_KEYS } from '~/store/common'
import { copyText, formatDateTime } from '~/modules/tools'
import ManageButton from '~/pages/-/ManageButton.vue'
import { SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import { atcb_action } from 'add-to-calendar-button'
import dayjs from 'dayjs'
import { domain } from '~~/config'

const SHARES = {
  twitter: 'twitter',
  copyLink: 'copyLink'
}

const VIEWS = {
  about3: 'about3',
  rss3: 'rss3',
  whois3: 'whois3',
  bitcc: 'bitcc',
  seekdid: 'seekdid'
}

export default Vue.extend({
  name: 'AccountStatusCard',
  components: {
    IconImage,
    Iconfont,
    ManageButton
  },
  props: {
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    },
    root: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: '',
      required: false
    },
    avatar: {
      type: String,
      required: false
    },
    editMode: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      SETTINGS,
      ACCOUNT_STATUS,
      IDENTICON_SERVE,
      TIME_FORMAT,
      subAccountOptions: [{
        icon: 'mint-sub-accounts',
        text: this.$tt('Mint SubDIDs'),
        value: SETTINGS.mintSubAccounts
      }, {
        icon: 'superdid',
        text: 'SuperDID',
        value: SETTINGS.superDid
      }],
      shareList: [{
        logo: '/images/social/social-twitter.png',
        text: 'Twitter',
        value: SHARES.twitter
      }, {
        logo: '/images/components/copy-link.png',
        text: this.$tt('Copy Link'),
        value: SHARES.copyLink
      }],
      viewList: [{
        logo: '/images/social/aboutme.png',
        text: 'About³.me',
        value: VIEWS.about3
      }, {
        logo: '/images/social/rss3.png',
        text: 'RSS3',
        value: VIEWS.rss3
      }, {
        logo: '/images/social/whois.png',
        text: 'Whois³',
        value: VIEWS.whois3
      }, {
        logo: '/images/social/cc-host.png',
        text: 'bit.cc',
        value: VIEWS.bitcc
      }, {
        logo: '/images/social/seekdid.png',
        text: 'SEEKDID',
        value: VIEWS.seekdid
      }],
      oneDayMillisecond: 24 * 60 * 60 * 1000,
      tooltipRefShowing: false
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    isExpired (): boolean {
      if (this.accountInfo.expired_at) {
        return new Date().getTime() >= this.accountInfo.expired_at
      }
      return false
    },
    gracePeriod (): number {
      if (this.common.config.account_expiration_grace_period) {
        return this.common.config.account_expiration_grace_period * 1000
      }
      return 0
    },
    countdownToExpiredDays (): number | string {
      const currentTimestamp = new Date().getTime()
      const { expired_at: expiredAt } = this.accountInfo
      if (currentTimestamp > expiredAt - (this.oneDayMillisecond * 30) && currentTimestamp < expiredAt) {
        return new Decimal(expiredAt)
          .sub(currentTimestamp)
          .div(this.oneDayMillisecond)
          .toFixed(0, Decimal.ROUND_UP)
      }
      return 0
    },
    countdownToRecoveryDays (): number | string {
      const currentTimestamp = new Date().getTime()
      const { expired_at: expiredAt } = this.accountInfo
      if (currentTimestamp > expiredAt && currentTimestamp < expiredAt + this.gracePeriod) {
        return new Decimal(expiredAt)
          .add(this.gracePeriod)
          .sub(currentTimestamp)
          .div(this.oneDayMillisecond)
          .toFixed(0, Decimal.ROUND_UP)
      }
      return 0
    },
    recoveryDate (): string {
      const expiredAt = dayjs(this.accountInfo.expired_at)
      return formatDateTime(expiredAt.add(this.gracePeriod, 'millisecond'))
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
    manageOptions (): any[] {
      return [{
        icon: 'manage-data',
        text: this.$tt('Manage Data'),
        value: SETTINGS.manageData
      }, {
        icon: 'change-permission',
        text: this.$tt('Change Permissions'),
        value: SETTINGS.changePermission
      }, {
        icon: 'renew',
        text: this.$tt('Renew'),
        value: SETTINGS.renew,
        color: '#006DFF',
        comingSoon: this.isSubAccount
      }]
    },
    accountSize (): number {
      const _length = this.accountInfo.account.length

      if (this.isMobile) {
        if (_length <= 10) {
          return 48
        }
        else if (_length <= 16) {
          return 32
        }
        else {
          return 24
        }
      }
      else {
        if (_length <= 20) {
          return 48
        }
        else if (_length <= 30) {
          return 32
        }
        else {
          return 24
        }
      }
    }
  },
  mounted () {
    window.setTimeout(() => {
      this.tooltipRefShowing = true
    }, 1000)
  },
  methods: {
    formatDateTime,
    onSelectSettings (value: string) {
      if (value === SETTINGS.renew && this.isSubAccount) {
        return
      }
      this.$emit('settings', value)
    },
    onShareTo (value: string) {
      if (value === SHARES.twitter) {
        const text = `👋 Welcome to my Web3 profile! @dotbitHQ\n${window.location.href}`
        const url = `https://twitter.com/compose/tweet?text=${encodeURIComponent(text)}`
        window.open(url)
      }
      else if (value === SHARES.copyLink) {
        copyText(window.location.href).then(() => {
          this.$toast('👌 ' + this.$tt('Copied'))
        })
      }
    },
    openDescription (description: string) {
      if (this.editMode) {
        this.$emit('editDescription')
      }
      else if (description) {
        this.$alert({
          title: this.$tt('Description'),
          message: description
        })
      }
    },
    onView (value: string) {
      let link
      if (value === VIEWS.bitcc) {
        if (this.isSubAccount) {
          link = `https://bit.cc/${this.accountInfo.account}`
        }
        else {
          link = `https://${this.accountInfo.account}.cc`
        }
      }
      else if (value === VIEWS.about3) {
        link = `https://about3.me/${this.accountInfo.account}`
      }
      else if (value === VIEWS.rss3) {
        link = `https://${this.accountInfo.account}.cheers.bio`
      }
      else if (value === VIEWS.whois3) {
        link = `https://whois3.me/${this.accountInfo.account}`
      }
      else if (value === VIEWS.seekdid) {
        link = `https://seekdid.com/${this.accountInfo.account}`
      }

      if (!link) {
        return
      }

      if (this.isMobile) {
        window.location.href = link
      }
      else {
        window.open(link)
      }
    },
    editAvatar () {
      this.$emit('editAvatar')
    },
    addToCalendar () {
      const account = this.accountInfo.account
      const expiredAt = dayjs(this.accountInfo.expired_at)
      const startDate = formatDateTime(expiredAt.subtract(3, 'day'), TIME_FORMAT.fullDate)
      const config = {
        name: `Your ${account} will expire in 3 days. Please renew it in time.`,
        description: `Account: ${account}\nExpires: ${formatDateTime(expiredAt)}\nRenew now: [url]${domain}${account}?action=renew[/url]`,
        startDate: startDate,
        options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com', 'MicrosoftTeams', 'Yahoo'],
        trigger: 'click',
        iCalFileName: 'dotbit-reminder-event'
      }
      // @ts-ignore
      atcb_action(config)
      const list = document.getElementsByClassName('atcb-list-item')
      for (let i = 0; i < list.length; i++) {
        let eventLabel: any = list[i]?.childNodes[1]
        eventLabel = (eventLabel as HTMLElement).innerText
        list[i].addEventListener('click', () => {
          this.$gtag('event', 'click', {
            event_category: 'Renew add to calendar',
            event_label: eventLabel,
            value: 1
          })
        })
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.account-status-card {
  margin-bottom: 24px;
  padding: 20px 20px 32px 36px;
  background: $white;
  box-shadow: $container-outer-box-shadow;
  border-radius: 24px;
  border: $container-border;
  min-height: 290px;

  .account-status-card_container {
    display: flex;
    justify-content: space-between;
  }

  .account-status-card_actions {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    text-align: right;
    align-items: flex-end;
  }

  .account-status-card_account-info {
    padding-top: 30px;
    width: 646px;
  }

  .account-status-card_account-name {
    margin-bottom: 12px;
    font-weight: 800;
    color: $primary-font-color;
    line-height: 1.1;
    word-break: break-word;
  }

  .account-status-card_account-name_sub-account {
    color: #E4B169;
  }

  .account-status-card_icon {
    position: relative;
    display: inline-flex;
    margin-bottom: 32px;
  }

  .account-status-card_icon_edit {
    position: absolute;
    display: inline-flex;
    width: 150px;
    height: 150px;
    align-items: center;
    justify-content: center;
    background: rgba(18, 19, 20, 0.6);
    border-radius: 50%;
    cursor: pointer;
  }

  .account-status-card_icon_edit-icon {
    display: inline-flex;
    height: 36px;
    width: 36px;
    align-items: center;
    justify-content: center;
    background: $white;
    border-radius: 50%;

    &:hover {
      color: $primary-color;
    }
  }

  .account-status-card_registration-info {
    display: inline-flex;
    color: $third-font-color;
    font-size: $font-size-14;
    font-weight: 400;
    line-height: 16px;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }
  }

  .account-status-card_registration-info_icon {
    margin-left: 4px;
  }

  .account-status-card_sub-account {

    .manage-button__button {
      padding-right: 16px;
    }
  }

  .account-status-card_description {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    font-size: $font-size-14;
    font-weight: 400;
    color: $assist-font-color;
    line-height: 16px;
    word-break: break-word;

    &.pointer {
      cursor: pointer;
    }
  }

  .account-status-card_description_edit-mode {
    border: 0.07rem dashed $primary-font-color;
    padding: 0 2px;
    border-radius: 2px;
    cursor: pointer;
  }

  .account-status-card_view {
    margin-left: 8px;
  }

  .account-status-card_manage {
    margin-left: 8px;

    .manage-button__button {
      padding-right: 16px;
    }
  }

  .account-status-card__manage-button-icon {
    margin-right: 6px;
  }

  .account-status-card_share {
    margin-left: 8px;
  }

  .account-status-card_account-expired {
    display: inline-grid;
    grid-auto-flow: column;
    grid-column-gap: 4px;
    margin: 0 2px 12px 0;
    align-items: center;
    background: $error-color;
    border-radius: 4px;
    padding: 2px 4px;
    width: max-content;
    font-size: $font-size-12;
    font-weight: 500;
    color: $white;
    cursor: pointer;

    .iconfont {
      margin-right: 4px;
    }
  }

  .account-status-card_registration-info_tooltip-custom {
    background-color: $primary-font-color !important;
    border-radius: 8px;
    box-shadow: $container-outer-box-shadow;

    .tooltip-arrow {
      border-color: $primary-font-color !important;
    }
  }

  .account-status-card_renew-now {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 286px;
    height: 56px;
    border-radius: 12px;
    background-color: rgba(255, 107, 107, 0.5);
    margin-top: 14px;
    cursor: pointer;
    border: 1px solid rgba(255, 107, 107, 0.4);

    &:hover {
      opacity: 0.8;
    }
  }

  .account-status-card_renew-now-icon {
    padding-left: 20px;
    padding-right: 12px;
  }

  .account-status-card_renew-now-text {
    flex: 1;
    font-size: $font-size-18;
    color: $tips-font-color;
    text-align: left;
  }

  .account-status-card_registration-info_container {
    display: flex;
    justify-content: flex-end;
  }

  .account-status-card_renew-now-arrow {
    padding: 24px;
  }

  .account-status-card_renew_container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  .account-status-card_renew {
    color: $primary-color;
    cursor: pointer;

    &:hover {
      color: rgba(34, 108, 242, 0.7);
    }
  }

  .account-status-card_renew_dividing-line {
    margin: 0 8px;
    background: rgba(182, 196, 217, 0.4);
    width: 1px;
    height: 12px;
  }

  .account-status-card_remind-me {
    color: $primary-color;
    cursor: pointer;

    &:hover {
      color: rgba(34, 108, 242, 0.7);
    }
  }

  &.account-status-card_mobile {
    padding: 10px 10px 32px 10px;
    margin-bottom: 22px;
    min-height: unset;

    .account-status-card_container {
      margin: 0;
      flex-direction: column;
      text-align: center;
    }

    .account-status-card_icon {
      margin-bottom: 16px;
    }

    .account-status-card_icon_edit {
      width: 72px;
      height: 72px;
    }

    .account-status-card_account-name {
      padding: 0 24px;
      margin-bottom: 16px;
    }

    .account-status-card_description {
      padding: 0 24px;
      -webkit-line-clamp: 4;
    }

    .account-status-card_manage-buttons {
      padding: 20px 20px 0 20px;
      display: flex;
      justify-content: center;
    }

    .account-status-card_actions {
      flex-direction: column-reverse;
      align-items: center;
      text-align: center;
    }

    .account-status-card_account-info {
      width: unset;
      padding: 22px 0 28px 0;
    }

    .account-status-card_actions_mobile {
      position: absolute;
      right: 26px;
    }

    .account-status-card_manage {
      margin-top: 28px;

      .manage-button__button {
        width: 120px;
        color: $white;
        background: $success-color;
        padding-right: 10px;
      }

      .manage-button__list__context {
        right: 0;
        left: unset;
      }
    }

    .account-status-card_sub-account {
      margin-top: 28px;

      .manage-button__button {
        width: 120px;
        color: $white;
        background: $primary-color;
        padding-right: 10px;
      }
    }

    .account-status-card_account-expired {
      display: grid;
      margin: 0 auto 16px auto;
    }

    .account-status-card_registration-info_container {
      flex-direction: column;
      align-items: center;
    }

    .account-status-card_renew_container {
      margin: 8px 0 0 0;
    }
  }
}
</style>
