<template>
  <div :class="['parsing-records', {'parsing-records_mobile': isMobile}]">
    <div class="parsing-records_container">
      <h3 class="parsing-records_titile profiles">
        <IconImage
          url="/images/components/title-profiles.png"
          alt="Permissions"
          :size="32"
        />
        {{ $tt('Profile ({total})', { total: profileParsingRecords.length }) }}
      </h3>
      <div
        class="parse-record_container"
        :class="{ 'parse-record_container_mobile': profileParsingRecords.length === 0 && !editMode }"
      >
        <template v-if="loading">
          <Skeleton
            v-for="i in 5"
            :key="i"
          />
        </template>
        <template v-else>
          <AddNewItem
            :showing="editMode"
            :recordType="ParsingRecordType.profile"
            @click="addNewRecord"
          />
          <template v-if="profileParsingRecords.length > 0">
            <span
              v-for="(record, index) in profileParsingRecords"
              v-if="record.action !== ParsingRecordAction.delete"
              :key="`profile${index}`"
              class="parsing-records_item"
              @click="onOpenLink(record)"
            >
              <span class="parsing-records_item_info">
                <IconImage
                  class="parsing-records_item_info_logo"
                  :url="profileLogo(record)"
                  :alt="record.key"
                  :size="32"
                  rounded
                />
                <span>
                  <div class="parsing-records_account-info_label">
                    {{ findProfile(record.key).text }}
                    <span
                      v-show="record.label"
                      class="parsing-records_item_tag"
                    >
                      {{ record.label }}
                    </span>
                  </div>
                  <div
                    class="parsing-records_account-info_address"
                  >
                    {{ record.value }}
                  </div>
                </span>
              </span>
              <ActionButtons
                v-if="editMode"
                @delete="deleteParsingRecord(record)"
                @edit="modifyParsingRecord(record)"
              />
            </span>
          </template>
          <NoItem
            v-if="!(editMode || profileParsingRecords.length > 0)"
            class="parsing-records_no-item"
            :recordType="ParsingRecordType.profile"
            @click="onClickNoItem"
          />
        </template>
      </div>
    </div>
    <div class="parsing-records_container">
      <h3 class="parsing-records_titile addresses">
        <IconImage
          url="/images/components/title-addresses.png"
          alt="Permissions"
          :size="32"
        />
        {{ $tt('Addresses ({total})', { total: addressParsingRecords.length }) }}
      </h3>
      <div
        class="parse-record_container"
        :class="{ 'parse-record_container_mobile': addressParsingRecords.length === 0 && !editMode }"
      >
        <template v-if="loading">
          <Skeleton
            v-for="i in 5"
            :key="i"
          />
        </template>
        <template v-else>
          <AddNewItem
            :showing="editMode"
            :recordType="ParsingRecordType.address"
            @click="addNewRecord"
          />
          <template v-if="addressParsingRecords.length > 0">
            <span
              v-for="(record, index) in addressParsingRecords"
              v-if="record.action !== ParsingRecordAction.delete"
              :key="`address${index}`"
              class="parsing-records_item"
              @click="onCopyAddress(record.value)"
            >
              <span class="parsing-records_item_info">
                <IconImage
                  class="parsing-records_item_info_logo"
                  :url="`/images/chain/chain-${findParsingRecordChain(record.key).value}.png`"
                  :alt="findParsingRecordChain(record.key).value"
                  :size="32"
                  rounded
                />
                <span>
                  <div class="parsing-records_account-info_label">
                    {{ findParsingRecordChain(record.key).text }}
                    <span
                      v-show="record.label"
                      class="parsing-records_item_tag"
                    >
                      {{ record.label }}
                    </span>
                  </div>
                  <div class="parsing-records_account-info_address monospace">
                    {{ collapseString(record.value, 9, 9) }}
                  </div>
                </span>
              </span>
              <ActionButtons
                v-if="editMode"
                @delete="deleteParsingRecord(record)"
                @edit="modifyParsingRecord(record)"
              />
            </span>
          </template>
          <NoItem
            v-if="!(editMode || addressParsingRecords.length > 0)"
            class="parsing-records_no-item"
            :recordType="ParsingRecordType.address"
            @click="onClickNoItem"
          />
        </template>
      </div>
    </div>
    <div class="parsing-records_container">
      <h3 class="parsing-records_titile custom">
        <IconImage
          url="/images/components/title-custom.png"
          alt="Permissions"
          :size="32"
        />
        {{ $tt('Custom ({total})', { total: customParsingRecords.length }) }}
      </h3>
      <div
        class="parse-record_container"
        :class="{ 'parse-record_container_mobile': customParsingRecords.length === 0 && !editMode }"
      >
        <template v-if="loading">
          <Skeleton
            v-for="i in 5"
            :key="i"
          />
        </template>
        <template v-else>
          <AddNewItem
            :showing="editMode"
            :recordType="ParsingRecordType.customKey"
            @click="addNewRecord"
          />
          <template v-if="customParsingRecords.length > 0">
            <span
              v-for="(record, index) in customParsingRecords"
              v-if="record.action !== ParsingRecordAction.delete"
              :key="`custom${index}`"
              class="parsing-records_item"
              @click="showParseRecordDetails(record)"
            >
              <span class="parsing-records_item_info">
                <IconImage
                  class="parsing-records_item_info_logo"
                  :url="record.key === 'bitcc_theme' ? '/images/social/social-theme.png' : ''"
                  :alt="record.key"
                  :size="32"
                  rounded
                />
                <span>
                  <div class="parsing-records_account-info_label">
                    {{ record.key }}
                    <span
                      v-show="record.label"
                      class="parsing-records_item_tag"
                    >
                      {{ record.label }}
                    </span>
                  </div>
                  <div class="parsing-records_account-info_address">
                    {{ record.value }}
                  </div>
                </span>
              </span>
              <ActionButtons
                v-if="editMode"
                @delete="deleteParsingRecord(record)"
                @edit="modifyParsingRecord(record)"
              />
            </span>
          </template>
          <NoItem
            v-if="!(editMode || customParsingRecords.length > 0)"
            class="parsing-records_no-item"
            :recordType="ParsingRecordType.customKey"
            @click="onClickNoItem"
          />
        </template>
      </div>
    </div>
    <div class="parsing-records_container dwebs">
      <h3 class="parsing-records_titile dwebs">
        <IconImage
          url="/images/components/title-dwebs.png"
          alt="Permissions"
          :size="32"
        />
        {{ $tt('DWeb ({total})', { total: dwebParsingRecords.length }) }}
      </h3>
      <div
        class="parse-record_container parse-record_container_dweb"
        :class="{ 'parse-record_container_mobile': dwebParsingRecords.length === 0 && !editMode }"
      >
        <template v-if="loading">
          <Skeleton
            v-for="i in 4"
            :key="i"
          />
        </template>
        <template v-else>
          <AddNewItem
            :showing="editMode"
            :recordType="ParsingRecordType.dweb"
            @click="addNewRecord"
          />
          <template v-if="dwebParsingRecords.length > 0">
            <span
              v-for="(record, index) in dwebParsingRecords"
              v-if="record.action !== ParsingRecordAction.delete"
              :key="`dweb${index}`"
              class="parsing-records_item"
              @click="onCopyAddress(record.value)"
            >
              <span class="parsing-records_item_info">
                <IconImage
                  class="parsing-records_item_info_logo"
                  :url="`/images/dweb/dweb-${findDweb(record.key).value}.png`"
                  :alt="findDweb(record.key).value"
                  :size="32"
                  rounded
                />
                <span>
                  <div class="parsing-records_account-info_label">
                    {{ findDweb(record.key).text }}
                    <span
                      v-show="record.label"
                      class="parsing-records_item_tag"
                    >
                      {{ record.label }}
                    </span>
                  </div>
                  <div class="parsing-records_account-info_address monospace">
                    {{ record.value }}
                  </div>
                </span>
              </span>
              <ActionButtons
                v-if="editMode"
                @delete="deleteParsingRecord(record)"
                @edit="modifyParsingRecord(record)"
              />
            </span>
          </template>
          <NoItem
            v-if="!(editMode || dwebParsingRecords.length > 0)"
            class="parsing-records_no-item"
            :recordType="ParsingRecordType.dweb"
            @click="onClickNoItem"
          />
        </template>
      </div>
    </div>
    <div class="parsing-records_container">
      <h3 class="parsing-records_titile permissions">
        <IconImage
          url="/images/components/title-permissions.png"
          alt="Permissions"
          :size="32"
        />
        {{ $tt('Permissions') }}
      </h3>
      <div class="parse-record_container">
        <template v-if="loading">
          <Skeleton
            v-for="i in 2"
            :key="i"
          />
        </template>
        <template v-else>
          <span
            class="parsing-records_item"
            @click="onCopyAddress(accountInfo.owner)"
          >
            <span class="parsing-records_item_info">
              <Iconfont
                class="parsing-records_item_info_logo"
                :name="accountInfo.owner_chain_type && ChainTypeToChain[accountInfo.owner_chain_type] && ChainTypeToChain[accountInfo.owner_chain_type].icon"
                size="32"
                rounded
              />
              <span>
                <div class="parsing-records_account-info_label">
                  {{ $tt('Owner') }}
                  <span
                    v-show="isOwner"
                    class="parsing-records_item_tag"
                  >
                    {{ $tt('Me') }}
                  </span>
                </div>
                <div class="parsing-records_account-info_address monospace">
                  {{ collapseString(accountInfo.owner, 9, 9) }}
                </div>
              </span>
            </span>
          </span>
          <span
            class="parsing-records_item"
            @click="onCopyAddress(accountInfo.manager)"
          >
            <span class="parsing-records_item_info">
              <Iconfont
                class="parsing-records_item_info_logo"
                :name="accountInfo.manager_chain_type && ChainTypeToChain[accountInfo.manager_chain_type] && ChainTypeToChain[accountInfo.manager_chain_type].icon"
                size="32"
                rounded
              />
              <span>
                <div class="parsing-records_account-info_label">
                  {{ $tt('Manager') }}
                  <span
                    v-show="isManager"
                    class="parsing-records_item_tag"
                  >
                    {{ $tt('Me') }}
                  </span>
                </div>
                <div class="parsing-records_account-info_address monospace">
                  {{ collapseString(accountInfo.manager, 9, 9) }}
                </div>
              </span>
            </span>
          </span>
        </template>
      </div>
    </div>
    <RecordDetails
      v-model="parseRecordDetailsShowing"
      :recordDetails="parseRecordDetails"
    />
    <transition name="parse-record-bottom-tips">
      <div
        v-if="editMode"
        class="parse-record_bottom-tips"
      >
        <div class="parse-record_bottom-tips_container">
          <Button
            v-if="!isMobile"
            status="dark"
            class="parse-record_top-tips_exit"
            shape="round"
            @click="showExitEditModeTips"
          >
            {{ $tt('Exit') }}
          </Button>
          <div class="parse-record_bottom-tips_statistics">
            <span class="parse-record_bottom-tips_item">
              {{ $tt('New: ') }}
              <span class="parse-record_bottom-tips_item_value">{{ operationStatistics.new }}</span>
            </span>
            <span class="parse-record_bottom-tips_item">
              {{ $tt('Delete: ') }}
              <span class="parse-record_bottom-tips_item_value">{{ operationStatistics.delete }}</span>
            </span>
            <span class="parse-record_bottom-tips_item">
              {{ $tt('Edit: ') }}
              <span class="parse-record_bottom-tips_item_value">{{ operationStatistics.edit }}</span>
            </span>
          </div>
          <Button
            v-if="!isMobile"
            class="parse-record_bottom-tips_button"
            shape="round"
            status="success"
            :loading="saveChangesLoading"
            :disabled="!parsingRecordsIsChanged"
            @click="saveChanges"
          >
            {{ $tt('Save') }}
          </Button>
          <div
            v-if="isMobile"
            class="parsing-records_bottom-tips_actions"
          >
            <Button
              class="parse-record_top-tips_exit"
              status="dark"
              shape="round"
              @click="showExitEditModeTips"
            >
              {{ $tt('Exit') }}
            </Button>
            <Button
              class="parse-record_bottom-tips_button"
              shape="round"
              status="success"
              :loading="saveChangesLoading"
              :disabled="!parsingRecordsIsChanged"
              @click="saveChanges"
            >
              {{ $tt('Save') }}
            </Button>
          </div>
        </div>
      </div>
    </transition>
    <AddParsingRecord
      v-model="addParsingRecordShowing"
      :type="addNewRecordType"
      :recordKey="addNewRecordKey"
      @save="saveNewParsingRecord"
    />
    <ModifyParsingRecord
      v-model="modifyParsingRecordShowing"
      :record="currentModifyParsingRecord"
      @save="saveModifyParsingRecord"
    />
    <ConfirmChanges
      v-model="confirmChangesShowing"
      :addressParsingRecords="addressParsingRecords"
      :profileParsingRecords="profileParsingRecords"
      :dwebParsingRecords="dwebParsingRecords"
      :customParsingRecords="customParsingRecords"
      @confirm="onConfirmChanges"
    />
    <Dialog
      :showing="taskNotCompletedDialogShowing"
      :title="$tt('Failed')"
      closeButton
      enableCloseAction
      @close="closeTaskNotCompletedDialog"
    >
      <div>{{ $tt('The current account cannot be edited. Please try again in 5 minutes. Possible reasons:') }}</div>
      <div class="parsing-records_task-not-completed_item">
        <span>1.</span>
        <span>{{ $tt('Your operations are too frequent. The last transaction is still pending;') }}</span>
      </div>
      <div class="parsing-records_task-not-completed_item">
        <span>2.</span>
        <span>{{ $tt('Currently, the parent account is minting some new SubDIDs.') }}</span>
      </div>
      <a
        class="parsing-records_task-not-completed_faq"
        target="_blank"
        href="https://talk.did.id/t/bit-subdids-are-live/435#what-are-subdids-1"
      >
        {{ $tt('Learn more') }}
      </a>
    </Dialog>
    <ExitEditModeTips
      v-model="exitEditModeTipsShowing"
      @exit="onExitEditMode"
      @save="saveChanges"
    />
    <Processing
      v-model="txSubmittedLoadingDialogShowing"
      :title="$tt('Submitted')"
      :txHash="txHash"
      :txHashLink="txHashLink"
      :loading="txLoading"
    >
      {{ $tt('Approximately {number} minutes.', { number: 3 }) }}
    </Processing>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import {
  collapseString,
  copyText,
  findDweb,
  findParsingRecordChain,
  findProfile,
  mmJsonHashAndChainIdHex,
  sleep
} from '~/modules/tools'
import Dialog from '~/components/Dialog.vue'
import {
  IAccountInfo,
  IAccountParsingRecord,
  ParsingRecordAction,
  ParsingRecordProfileKey,
  ParsingRecordType
} from '~/services/Account'
import { IConnectedAccount, ME_KEYS } from '~/store/me'
import {
  ChainTypeToChain, CKB,
  NEW_LOCK_SCRIPT_TYPE,
  PARSING_RECORD_SUPPORT_CHAINS
} from '~/constant/chain'
import {
  ACCOUNT_STATUS,
  CYCLE_CALL_FUNCTION_TIME,
  DWEB_KEY_OPTIONS,
  ORDER_ACTION_TYPE,
  PROFILE_KEY_OPTIONS, SETTINGS,
  TRX_STATUS
} from '~/constant'
import IconImage from '~/components/icon/IconImage.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import Button from '~/components/Button.vue'
import AddParsingRecord from '~/pages/-/AddParsingRecord.vue'
import ConfirmChanges from '~/pages/-/ConfirmChanges.vue'
import ModifyParsingRecord from '~/pages/-/ModifyParsingRecord.vue'
import { COMMON_KEYS } from '~/store/common'
import errno from '~/constant/errno'
import AddNewItem from '~/pages/-/AddNewItem.vue'
import NoItem from '~/pages/-/NoItem.vue'
import ActionButtons from '~/pages/-/ActionButtons.vue'
import { validate } from 'vee-validate'
import { SUB_ACCOUNT_ACTIONS, SUB_ACCOUNT_REG_EXP } from '~/constant/subAccount'
import RecordDetails from '~/pages/-/RecordDetails.vue'
import ExitEditModeTips from '~/pages/-/ExitEditModeTips.vue'
import Skeleton from '~/components/Skeleton.vue'
import Processing from '~/pages/-/Processing.vue'

const PARSING_RECORD_MAX_LIMIT = 100

const ACTIONS = {
  delete: 'delete',
  replace: 'replace',
  add: 'add'
}

export default Vue.extend({
  name: 'ParsingRecords',
  components: {
    IconImage,
    Iconfont,
    Dialog,
    Button,
    AddParsingRecord,
    ConfirmChanges,
    ModifyParsingRecord,
    AddNewItem,
    NoItem,
    ActionButtons,
    RecordDetails,
    ExitEditModeTips,
    Skeleton,
    Processing
  },
  props: {
    accountInfo: {
      type: Object as PropType<IAccountInfo>,
      required: true
    },
    editMode: {
      type: Boolean,
      default: false
    },
    accountRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    loading: Boolean,
    enableSubAccount: {
      type: Number
    }
  },
  data () {
    return {
      ParsingRecordAction,
      ParsingRecordType,
      ParsingRecordProfileKey,
      ChainTypeToChain,
      parseRecordDetailsShowing: false,
      parseRecordDetails: {} as IAccountParsingRecord,
      addressParsingRecords: [] as IAccountParsingRecord[],
      profileParsingRecords: [] as IAccountParsingRecord[],
      dwebParsingRecords: [] as IAccountParsingRecord[],
      customParsingRecords: [] as IAccountParsingRecord[],
      currentModifyParsingRecord: {} as IAccountParsingRecord,
      addParsingRecordShowing: false,
      modifyParsingRecordShowing: false,
      saveChangesLoading: false,
      confirmChangesShowing: false,
      addNewRecordType: '',
      addNewRecordKey: '',
      taskNotCompletedDialogShowing: false,
      exitEditModeTipsShowing: false,
      txSubmittedLoadingDialogShowing: false,
      txHash: '',
      txHashLink: '',
      txLoading: true
    }
  },
  computed: {
    ...mapState({
      me: ME_KEYS.namespace,
      common: COMMON_KEYS.namespace
    }),
    ...mapGetters({
      computedChainType: ME_KEYS.computedChainType,
      computedChainId: ME_KEYS.computedChainId,
      isMobile: COMMON_KEYS.isMobile,
    }),
    connectedAccount (): IConnectedAccount {
      return this.me.connectedAccount
    },
    isSubAccount (): boolean {
      return SUB_ACCOUNT_REG_EXP.test(this.accountInfo.account)
    },
    isManager (): boolean {
      return !!this.accountInfo.manager && this.connectedAccount.address.toUpperCase() === this.accountInfo.manager.toUpperCase()
    },
    isOwner (): boolean {
      return !!this.accountInfo.owner && this.connectedAccount.address.toUpperCase() === this.accountInfo.owner.toUpperCase()
    },
    canManage (): boolean {
      return ![ACCOUNT_STATUS.onePriceSell].includes(this.accountInfo.status)
    },
    editRecordsThrottle (): number {
      const value = this.common.config.edit_records_throttle
      if (value) {
        return parseInt(String(value / 60))
      }
      return 5
    },
    operationStatistics (): { new: number, delete: number, edit: number } {
      const statistics = {
        new: 0,
        delete: 0,
        edit: 0
      }
      const list = [...this.addressParsingRecords, ...this.profileParsingRecords, ...this.dwebParsingRecords, ...this.customParsingRecords]
      list.forEach((record) => {
        if (record.action === ParsingRecordAction.add) {
          statistics.new += 1
        }
        else if (record.action === ParsingRecordAction.delete) {
          statistics.delete += 1
        }
        else if (record.action === ParsingRecordAction.change) {
          statistics.edit += 1
        }
      })
      return statistics
    },
    parsingRecordsIsChanged (): boolean {
      return this.operationStatistics.new + this.operationStatistics.delete + this.operationStatistics.edit > 0
    }
  },
  watch: {
    accountRecords () {
      this.recordsGroups()
    },
  },
  created () {
    this.recordsGroups()
  },
  mounted () {
    window.setTimeout(() => {
      this.urlQueryParser()
    }, 2000)
    window.onbeforeunload = () => {
      if (this.parsingRecordsIsChanged) {
        return this.$tt('Changes you made may not be saved.')
      }
    }
  },
  methods: {
    findParsingRecordChain,
    findProfile,
    collapseString,
    findDweb,
    recordsGroups () {
      this.addressParsingRecords = []
      this.profileParsingRecords = []
      this.dwebParsingRecords = []
      this.customParsingRecords = []
      this.accountRecords.forEach((record: IAccountParsingRecord) => {
        record = {
          ...record,
          action: ''
        }
        if (record.type === ParsingRecordType.address) {
          this.addressParsingRecords.push(record)
        }
        else if (record.type === ParsingRecordType.profile) {
          if (record.key === ParsingRecordProfileKey.avatar) {
            if (record.value.match(/[https|http]?:\/\//)) {
              this.$emit('avatar', record)
            }
          }
          if (record.key === ParsingRecordProfileKey.description) {
            this.$emit('description', record)
          }
          this.profileParsingRecords.push(record)
        }
        else if (record.type === ParsingRecordType.dweb) {
          this.dwebParsingRecords.push(record)
        }
        else if (record.type === ParsingRecordType.customKey) {
          this.customParsingRecords.push(record)
        }
      })
    },
    closeTaskNotCompletedDialog () {
      this.taskNotCompletedDialogShowing = false
    },
    profileLogo (record: IAccountParsingRecord) {
      if ([ParsingRecordProfileKey.avatar].includes(record.key as any)) {
        if (record.value.match(/[https|http]?:\/\//)) {
          return record.value
        }
      }
      return `/images/social/social-${record.key}.png`
    },
    urlQueryParser () {
      try {
        const recordsString = this.$route.query.records
        if (recordsString) {
          const records = JSON.parse(<string>recordsString)
          if (records && records.length > 0) {
            this.$emit('enableEditMode')
            const deleteList: any[] = []
            const addList: any[] = []
            records.forEach((item: any) => {
              const action = item.action
              const keyParts = item.key.split('.') // address.btc
              const type = keyParts[0]
              const key = keyParts[1]
              item.type = type
              if (type === ParsingRecordType.address) {
                item.key = findParsingRecordChain(key).coinType
              }
              else {
                item.key = key
              }

              if (action === ACTIONS.delete) {
                deleteList.push(item)
              }
              else if (action === ACTIONS.add) {
                addList.push(item)
              }
              else if (action === ACTIONS.replace) {
                deleteList.push(item)
                addList.push(item)
              }
            })

            deleteList.forEach((item: any) => {
              const type = item.type
              const key = item.key

              if (type === ParsingRecordType.address) {
                this.addressParsingRecords.forEach((record, index) => {
                  if (record.key === key) {
                    record.action = ParsingRecordAction.delete
                  }
                })
              }
              else if (type === ParsingRecordType.profile) {
                this.profileParsingRecords.forEach((record, index) => {
                  if (record.key === key) {
                    record.action = ParsingRecordAction.delete
                  }
                })
              }
              else if (type === ParsingRecordType.dweb) {
                this.dwebParsingRecords.forEach((record, index) => {
                  if (record.key === key) {
                    record.action = ParsingRecordAction.delete
                  }
                })
              }
              else if (type === ParsingRecordType.customKey) {
                this.customParsingRecords.forEach((record, index) => {
                  if (record.key === key) {
                    record.action = ParsingRecordAction.delete
                  }
                })
              }
            })

            addList.forEach(async (item: any) => {
              const type = item.type
              const key = item.key
              const value = item.value
              const label = item.label
              const ttl = item.ttl
              if (type === ParsingRecordType.address) {
                const chainValue = PARSING_RECORD_SUPPORT_CHAINS.filter((chain) => {
                  return chain.coinType === key
                })
                if (chainValue) {
                  const valueVerified = await validate(value, `required|address:${key}`)
                  const labelVerified = await validate(label, 'max:64')
                  const ttlVerified = await validate(ttl, 'positiveIntegers')
                  if (valueVerified.valid && labelVerified.valid && ttlVerified.valid) {
                    this.addressParsingRecords.push({
                      ...item,
                      action: ParsingRecordAction.add
                    })
                  }
                }
              }
              else if (type === ParsingRecordType.profile) {
                const optionValue = PROFILE_KEY_OPTIONS.filter((option) => {
                  return option.value === key
                })
                if (optionValue) {
                  const valueVerified = await validate(value, `required|max:1024|profileValue:${key}`)
                  const labelVerified = await validate(label, 'max:64')
                  const ttlVerified = await validate(ttl, 'positiveIntegers')
                  if (valueVerified.valid && labelVerified.valid && ttlVerified.valid) {
                    this.profileParsingRecords.push({
                      ...item,
                      action: ParsingRecordAction.add
                    })
                  }
                }
              }
              else if (type === ParsingRecordType.dweb) {
                const optionValue = DWEB_KEY_OPTIONS.filter((option) => {
                  return option.value === key
                })
                if (optionValue) {
                  const valueVerified = await validate(value, 'required|max:1024')
                  const labelVerified = await validate(label, 'max:64')
                  const ttlVerified = await validate(ttl, 'positiveIntegers')
                  if (valueVerified.valid && labelVerified.valid && ttlVerified.valid) {
                    this.dwebParsingRecords.push({
                      ...item,
                      action: ParsingRecordAction.add
                    })
                  }
                }
              }
              else if (type === ParsingRecordType.customKey) {
                const keyVerified = await validate(key, 'required|objectkey|max:255')
                const valueVerified = await validate(value, 'required|max:1024')
                const labelVerified = await validate(label, 'max:64')
                const ttlVerified = await validate(ttl, 'positiveIntegers')
                if (keyVerified.valid && valueVerified.valid && labelVerified.valid && ttlVerified.valid) {
                  this.customParsingRecords.push({
                    ...item,
                    action: ParsingRecordAction.add
                  })
                }
              }
            })
            this.saveChanges()
          }
        }
      }
      catch (err) {
        console.log(err)
      }
    },
    onCopyAddress (address: string) {
      copyText(address).then(() => {
        this.$toast('👌 ' + this.$tt('Copied'))
      })
    },
    showParseRecordDetails (record: IAccountParsingRecord) {
      this.parseRecordDetails = record
      this.parseRecordDetailsShowing = true
    },
    onOpenLink (record: IAccountParsingRecord) {
      if (record.value.match(/[https|http]?:\/\//)) {
        window.open(record.value)
      }
      else if (record.key === ParsingRecordProfileKey.twitter) {
        window.open(`https://twitter.com/${record.value.replace(/^@/, '')}`)
      }
      else if (record.key === ParsingRecordProfileKey.website) {
        window.open(record.value.indexOf('http') === 0 ? record.value : `http://${record.value}`)
      }
      else {
        this.onCopyAddress(record.value)
      }
    },
    onExitEditMode (notClear?: boolean) {
      this.$emit('exitEditMode', notClear)
    },
    showExitEditModeTips () {
      if (this.parsingRecordsIsChanged) {
        this.exitEditModeTipsShowing = true
      }
      else {
        this.onExitEditMode()
      }
    },
    addNewRecord (type: string, key?: any) {
      if (this.saveChangesLoading) {
        return
      }
      const _total = this.addressParsingRecords.length + this.profileParsingRecords.length + this.customParsingRecords.length + this.dwebParsingRecords.length
      if (_total >= PARSING_RECORD_MAX_LIMIT) {
        this.$alert({
          title: this.$tt('Tips'),
          message: this.$tt('You cannot add new parsing records, and the number of parsing records cannot exceed {num}', { num: PARSING_RECORD_MAX_LIMIT })
        })
      }
      else {
        this.addParsingRecordShowing = true
        this.addNewRecordType = type
        if (key) {
          this.addNewRecordKey = key
        }
      }
    },
    onClickNoItem (type: string) {
      this.$emit('settings', SETTINGS.manageData)
      setTimeout(() => {
        if (this.editMode) {
          const _total = this.addressParsingRecords.length + this.profileParsingRecords.length + this.customParsingRecords.length + this.dwebParsingRecords.length
          if (_total >= PARSING_RECORD_MAX_LIMIT) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('You cannot add new parsing records, and the number of parsing records cannot exceed {num}', { num: PARSING_RECORD_MAX_LIMIT })
            })
          }
          else {
            this.addParsingRecordShowing = true
            this.addNewRecordType = type
            this.addNewRecordKey = ''
          }
        }
      }, 500)
    },
    saveNewParsingRecord (record: IAccountParsingRecord) {
      if (record.type === ParsingRecordType.address) {
        this.addressParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.profile) {
        if (record.key === ParsingRecordProfileKey.avatar) {
          if (record.value.match(/[https|http]?:\/\//)) {
            this.$emit('avatar', record)
          }
        }
        if (record.key === ParsingRecordProfileKey.description) {
          this.$emit('description', record)
        }
        this.profileParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.dweb) {
        this.dwebParsingRecords.push(record)
      }
      else if (record.type === ParsingRecordType.customKey) {
        this.customParsingRecords.push(record)
      }
    },
    modifyParsingRecord (record: IAccountParsingRecord) {
      if (this.saveChangesLoading) {
        return
      }
      this.currentModifyParsingRecord = record
      this.modifyParsingRecordShowing = true
    },
    saveModifyParsingRecord (record: IAccountParsingRecord) {
      if (this.currentModifyParsingRecord.action === ParsingRecordAction.add) {
        Object.assign(this.currentModifyParsingRecord, record, { action: ParsingRecordAction.add })
      }
      else {
        Object.assign(this.currentModifyParsingRecord, record)
      }
    },
    deleteParsingRecord (record: IAccountParsingRecord) {
      if (this.saveChangesLoading) {
        return
      }
      if (record.action === ParsingRecordAction.add) {
        if (record.type === ParsingRecordType.address) {
          this.addressParsingRecords.forEach((item, index) => {
            if (item === record) {
              this.addressParsingRecords.splice(index, 1)
            }
          })
        }
        else if (record.type === ParsingRecordType.profile) {
          this.profileParsingRecords.forEach((item, index) => {
            if (item === record) {
              this.profileParsingRecords.splice(index, 1)
            }
          })
        }
        else if (record.type === ParsingRecordType.dweb) {
          this.dwebParsingRecords.forEach((item, index) => {
            if (item === record) {
              this.dwebParsingRecords.splice(index, 1)
            }
          })
        }
        else if (record.type === ParsingRecordType.customKey) {
          this.customParsingRecords.forEach((item, index) => {
            if (item === record) {
              this.customParsingRecords.splice(index, 1)
            }
          })
        }
        return
      }
      record.action = ParsingRecordAction.delete
    },
    saveChanges () {
      this.exitEditModeTipsShowing = false
      this.confirmChangesShowing = true
    },
    async onConfirmChanges () {
      this.txHash = ''
      this.txHashLink = ''
      this.txLoading = true
      if (this.isSubAccount) {
        this.onConfirmSubAccountChanges()
        return
      }
      this.saveChangesLoading = true
      const _addressParsingRecords = this.addressParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _profileParsingRecords = this.profileParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _dwebParsingRecords = this.dwebParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _customParsingRecords = this.customParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })

      try {
        const res = await this.$services.account.editRecords({
          evm_chain_id: this.computedChainId,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          account: this.accountInfo.account,
          raw_param: {
            records: [
              ..._addressParsingRecords,
              ..._profileParsingRecords,
              ..._dwebParsingRecords,
              ..._customParsingRecords
            ]
          }
        })

        if (!res) {
          this.saveChangesLoading = false
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
        this.confirmChangesShowing = false
        this.txHash = hash
        this.txHashLink = `${CKB.explorerTrx}${hash}`
        this.txSubmittedLoadingDialogShowing = true
        this.onExitEditMode(true)
        this.checkOrderStatus()
      }
      catch (err: any) {
        console.error(err)
        this.saveChangesLoading = false
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editRecordsThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
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
    },
    async onConfirmSubAccountChanges () {
      this.saveChangesLoading = true
      const _addressParsingRecords = this.addressParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _profileParsingRecords = this.profileParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _dwebParsingRecords = this.dwebParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })
      const _customParsingRecords = this.customParsingRecords.filter((record: IAccountParsingRecord) => {
        return record.action !== ParsingRecordAction.delete
      })

      try {
        const res = await this.$services.subAccount.editSubAccount({
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          account: this.accountInfo.account,
          edit_key: SUB_ACCOUNT_ACTIONS.records,
          edit_value: {
            records: [
              ..._addressParsingRecords,
              ..._profileParsingRecords,
              ..._dwebParsingRecords,
              ..._customParsingRecords
            ]
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
        this.confirmChangesShowing = false
        this.txSubmittedLoadingDialogShowing = true
        this.onExitEditMode(true)
        this.checkSubAccountOrderStatus()
      }
      catch (err: any) {
        console.error(err)
        this.saveChangesLoading = false
        if (![errno.metaMaskUserRejectedAccountAccess, errno.metaMaskUserDeniedMessageSignature].includes(err.code) && err !== errno.tronLinkConfirmationDeclinedByUser && err.message !== errno.walletConnectUserRejectedTheTransaction) {
          if (err.code === errno.apiErrorCodeAccountFrequencyLimit) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('The operation is too frequent. Please try again after {timeInterval} minutes', { timeInterval: this.editRecordsThrottle })
            })
          }
          else if (err.code === errno.metaMaskWalletRequestPermissions) {
            this.$alert({
              title: this.$tt('Tips'),
              message: this.$tt('Other requests for the wallet are not processed, please try again after processing')
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
    },
    async checkSubAccountOrderStatus () {
      try {
        const res = await this.$services.subAccount.transactionStatus({
          account: this.accountInfo.account,
          key_info: {
            coin_type: this.connectedAccount.chain.coinType,
            key: this.connectedAccount.address
          },
          action: SUB_ACCOUNT_ACTIONS.edit_sub_account
        })
        if (res && (res.status === TRX_STATUS.pending || res.status === TRX_STATUS.unpackaged)) {
          window.setTimeout(() => {
            this.checkSubAccountOrderStatus()
          }, CYCLE_CALL_FUNCTION_TIME * 2)
        }
      }
      catch (err: any) {
        console.error(err)
        if (err.code === errno.apiErrorCodeNotExitsTrx) {
          this.txLoading = false
          this.saveChangesLoading = false
          this.onExitEditMode()
        }
      }
    },
    async checkOrderStatus () {
      try {
        const res = await this.$services.account.trxStatus({
          evm_chain_id: this.computedChainId,
          chain_type: this.computedChainType,
          address: this.connectedAccount.address,
          actions: [ORDER_ACTION_TYPE.editRecords]
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
          this.txLoading = false
          this.saveChangesLoading = false
          this.onExitEditMode()
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.parsing-records {
  margin-bottom: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;

  .parsing-records_container {
    background: $white;
    box-shadow: $container-outer-box-shadow;
    border-radius: 24px;
    border: $container-border;
    overflow: hidden;

    &.dwebs {
      grid-column-start: span 2;
    }
  }

  .parsing-records_titile {
    display: grid;
    grid-auto-flow: column;
    justify-content: left;
    align-items: center;
    grid-column-gap: 8px;
    height: 60px;
    padding: 0 26px;
    font-size: 20px;
    font-weight: 800;

    &.profiles {
      background: rgba(156, 234, 236, 0.2);
      color: #65BDA8;
    }

    &.addresses {
      background: rgba(156, 236, 178, 0.2);
      color: #6DBF6F;
    }

    &.dwebs {
      background: rgba(156, 188, 236, 0.2);
      color: #7DB1FF;
    }

    &.custom {
      background: rgba(156, 174, 236, 0.2);
      color: #7885FF;
    }

    &.permissions {
      background: rgba(172, 156, 236, 0.2);
      color: #8684E4;
    }
  }

  .parse-record_container {
    position: relative;
    display: flex;
    flex-direction: column;
    grid-row-gap: 8px;
    min-height: 280px;
    max-height: 454px;
    padding: 16px;
    overflow-y: scroll;

    &::-webkit-scrollbar {
      display: none;
      width: 0 !important;
    }
  }

  .parse-record_container_dweb {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 50px);
    grid-column-gap: 32px;
  }

  .parsing-records_item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    min-height: 50px;
    padding: 0 10px;
    background: #EDF0F2;
    border-radius: 25px;
    cursor: pointer;

    &:hover {
      background: rgba(237, 240, 242, 0.6);
    }
  }

  .parsing-records_item_info {
    display: inline-flex;
    align-items: center;
  }

  .parsing-records_item_info_logo {
    margin-right: 8px;
  }

  .parsing-records_account-info_label {
    width: 270px;
    font-size: $font-size-16;
    font-weight: bold;
    color: $primary-font-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 20px;
  }

  .parsing-records_account-info_address {
    font-size: $font-size-14;
    font-weight: 500;
    color: $assist-font-color;
    line-height: 17px;
    width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &.monospace {
      font-family: $monospace-font-family;
    }
  }

  .parsing-records_item_tag {
    position: relative;
    top: -1px;
    display: inline-flex;
    margin-left: 4px;
    padding: 0 2px;
    background: $normal-color;
    border-radius: 4px;
    font-size: $font-size-12;
    font-weight: 500;
    color: $assist-font-color;
    line-height: 16px;
  }

  .parse-record_bottom-tips {
    position: fixed;
    bottom: 32px;
    left: 0;
    right: 0;
  }

  .parse-record_bottom-tips_container {
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 618px;
    height: 52px;
    padding: 8px;
    background: rgba(17, 18, 19, 0.6);
    border-radius: 68px;
    backdrop-filter: blur(28px) brightness(100%);
    -webkit-backdrop-filter: blur(28px) brightness(100%);
  }

  .parse-record_top-tips_exit {
    width: 150px;
  }

  .parse-record_bottom-tips_button {
    width: 150px;
  }

  .parse-record_bottom-tips_item {
    font-size: 20px;
    color: $white;
    padding: 0 14px;
    font-weight: 500;
  }

  .parse-record_bottom-tips_item_value {
    color: $success-font-color;
    font-weight: 500;
  }

  .parsing-records_task-not-completed_item {
    margin-top: 8px;
    display: inline-grid;
    grid-auto-flow: column;
    grid-column-gap: 2px;
    grid-template-columns: 14px auto;
    font-weight: 500;
  }

  .parsing-records_task-not-completed_faq {
    display: block;
    margin-top: 10px;
    font-weight: 500;
    line-height: 20px;
    color: $link-font-color;

    &:hover {
      color: $link-hover-font-color;
    }
  }

  .parsing-records_no-item {
    display: inline-block;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: max-content;
    height: max-content;
  }

  .parse-record-bottom-tips-enter-active {
    animation: slideInUp 0.2s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .parse-record-bottom-tips-leave-active {
    animation: slideOutDown 0.2s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  &.parsing-records_mobile {
    display: block;

    .parsing-records_container {
      margin-bottom: 24px;
    }

    .parsing-records_account-info_address {
      width: calc(100vw - 140px);
    }

    .parsing-records_account-info_label {
      width: calc(100vw - 140px);
    }

    .parse-record_bottom-tips_container {
      flex-direction: column;
      height: 120px;
      width: unset;
      border-radius: 0;
      padding: 0;
    }

    .parsing-records_bottom-tips_actions {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 8px;
      grid-template-columns: repeat(2, 1fr);
      width: calc(100vw - 32px);
      padding: 0 16px;
      margin-bottom: 16px;
    }

    .parse-record_bottom-tips_statistics {
      margin: 16px 0 12px 0;
    }

    .parse-record_bottom-tips_button,
    .parse-record_top-tips_exit {
      width: unset;
    }

    .parse-record_bottom-tips_item {
      padding: 0 20px;
      font-weight: 400;
    }

    .parse-record_container {
      min-height: unset;
      max-height: unset;
    }

    .parse-record_container_dweb {
      grid-template-columns: unset;
      grid-template-rows: unset;
    }

    .parse-record_container_mobile {
      min-height: 256px;
    }

    .parse-record_bottom-tips {
      bottom: 0;
    }
  }
}
</style>
