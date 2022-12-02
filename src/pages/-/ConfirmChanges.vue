<template>
  <Dialog
    :showing="showing"
    :title="$tt('Confirm information')"
    closeButton
    @close="onClose">
    <div class="confirm-changes__container">
      <div
        v-if="addressList.length > 0"
        class="confirm-changes__group">
        {{ $tt('Addresses ({amount})', { amount: addressList.length }) }}
      </div>
      <template v-for="(record, index) in addressList">
        <ConfirmChangesItem
          :key="`address${index}`"
          :logo="`/images/chain/chain-${findParsingRecordChain(record.key).value}.png`"
          :label="findParsingRecordChain(record.key).text"
          :value="collapseString(record.value, 6, 6)"
          :action="record.action"
        />
      </template>
      <div
        v-if="profileList.length > 0"
        class="confirm-changes__group confirm-changes__margin-top-14">
        {{ $tt('Profile ({amount})', { amount: profileList.length }) }}
      </div>
      <template v-for="(record, index) in profileList">
        <ConfirmChangesItem
          :key="`profile${index}`"
          :logo="profileLogo(record)"
          :label="findProfile(record.key).text"
          :value="record.value"
          :action="record.action"
        />
      </template>
      <div
        v-if="dwebList.length > 0"
        class="confirm-changes__group confirm-changes__margin-top-14">
        {{ $tt('DWeb ({amount})', { amount: dwebList.length }) }}
      </div>
      <template v-for="(record, index) in dwebList">
        <ConfirmChangesItem
          :key="`dweb${index}`"
          :logo="`/images/dweb/dweb-${findDweb(record.key).value}.png`"
          :label="findDweb(record.key).text"
          :value="record.value"
          :action="record.action"
        />
      </template>
      <div
        v-if="customList.length > 0"
        class="confirm-changes__group confirm-changes__margin-top-14">
        {{ $tt('Custom ({amount})', { amount: customList.length }) }}
      </div>
      <template v-for="(record, index) in customList">
        <ConfirmChangesItem
          :key="`custom${index}`"
          :logo="record.key === 'bitcc_theme' ? '/images/social/social-theme.png' : ''"
          :label="record.key"
          :value="record.value"
          :action="record.action"
        />
      </template>
    </div>
    <WalletConnectTips />
    <template #action>
      <Button
        block
        shape="round"
        status="success"
        @click="onSave">
        {{ $tt('Confirm changes') }}
      </Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import WalletConnectTips from '~/components/WalletConnectTips.vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'
import { IAccountParsingRecord, ParsingRecordAction, ParsingRecordProfileKey } from '~/services/Account'
import { collapseString, findDweb, findParsingRecordChain, findProfile } from '~/modules/tools'
import ConfirmChangesItem from '~/pages/-/ConfirmChangesItem.vue'

export default Vue.extend({
  name: 'ConfirmChanges',
  components: {
    Dialog,
    Button,
    WalletConnectTips,
    ConfirmChangesItem
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    addressParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    profileParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    dwebParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    },
    customParsingRecords: {
      type: Array as PropType<IAccountParsingRecord[]>,
      required: true
    }
  },
  data () {
    return {
      ParsingRecordAction
    }
  },
  computed: {
    addressList () {
      return this.addressParsingRecords.filter((record) => {
        return record.action !== ''
      })
    },
    profileList () {
      return this.profileParsingRecords.filter((record) => {
        return record.action !== ''
      })
    },
    dwebList () {
      return this.dwebParsingRecords.filter((record) => {
        return record.action !== ''
      })
    },
    customList () {
      return this.customParsingRecords.filter((record) => {
        return record.action !== ''
      })
    },
  },
  methods: {
    findParsingRecordChain,
    findProfile,
    collapseString,
    findDweb,
    profileLogo (record: IAccountParsingRecord) {
      if ([ParsingRecordProfileKey.avatar].includes(record.key as any)) {
        if (record.value.match(/[https|http]?:\/\//)) {
          return record.value
        }
      }
      return `/images/social/social-${record.key}.png`
    },
    onSave () {
      this.$emit('confirm')
      this.$emit('close', false)
    },
    onClose () {
      this.$emit('close', false)
    },
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.confirm-changes__container {
  height: 370px;
  overflow-y: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
}

.confirm-changes__group {
  margin-bottom: 8px;
  font-size: $font-size-14;
  font-weight: 500;
  color: $primary-font-color;
}

.confirm-changes__margin-top-14 {
  margin-top: 14px;
}
</style>
