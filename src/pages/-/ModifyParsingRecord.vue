<template>
  <Dialog
    :showing="showing"
    :title="$tt('Edit Data')"
    closeButton
    @close="onClose"
  >
    <ValidationObserver
      ref="modifyParsingRecordForm"
      class="modify-parsing-record"
      tag="form"
      @submit.prevent="onSave"
    >
      <div class="modify-parsing-record">
        <template v-if="modifyParsingRecord.type === ParsingRecordType.address">
          <label class="modify-parsing-record__label">
            {{ $tt('Public Chain') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="parsingRecordSupportChains"
            search
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $tt('Address') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Address')"
            :rules="`required|address:${modifyParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.value"
              :placeholder="$tt('Please enter the address')"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.profile">
          <label class="modify-parsing-record__label">
            {{ $tt('Key') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="profileKeyOptions"
            search
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ capitalize(modifyParsingRecord.key) }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="capitalize(modifyParsingRecord.key)"
            :rules="`required|max:1024|profileValue:${modifyParsingRecord.key}`"
          >
            <TextInput
              v-model="modifyParsingRecord.value"
              :placeholder="$tt('Please enter {value}', { value: capitalize(modifyParsingRecord.value) })"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.dweb">
          <label class="modify-parsing-record__label">
            {{ $tt('Key') }}
          </label>
          <Select
            v-model="modifyParsingRecord.key"
            :options="dwebKeyOptions"
            search
          />
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ findDweb(modifyParsingRecord.key).text }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="findDweb(modifyParsingRecord.key).text"
            :rules="`required|max:1024|dwebValue:${modifyParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.value"
              :placeholder="modifyParsingRecordValueInputPlaceholder"
              :errorMessages="errors"
              @change="onChangeModifyParsingRecordValue"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type === ParsingRecordType.customKey">
          <label class="modify-parsing-record__label">
            {{ $tt('Custom Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Custom Key')"
            rules="required|objectkey|max:255"
          >
            <TextInput
              v-model.trim="modifyParsingRecord.key"
              :placeholder="$tt('Please enter custom key')"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $tt('Custom Value') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Custom Value')"
            rules="required|max:1024"
          >
            <TextInput
              v-model="modifyParsingRecord.value"
              :placeholder="$tt('Please enter custom value')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="modifyParsingRecord.type">
          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">
            {{ $tt('Label') }}
            <span class="modify-parsing-record__label__tip">({{ $tt('Optional') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Label')"
            rules="max:64"
          >
            <TextInput
              v-model="modifyParsingRecord.label"
              :placeholder="$tt('eg personal account')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
<!--          <label class="modify-parsing-record__label modify-parsing-record__margin-top-32">-->
<!--            {{ $tt('TTL') }}-->
<!--            <span class="modify-parsing-record__label__tip">({{ $tt('Unit: second') }})</span>-->
<!--          </label>-->
<!--          <ValidationProvider-->
<!--            v-slot="{ errors }"-->
<!--            :name="$tt('TTL')"-->
<!--            rules="positiveIntegers"-->
<!--          >-->
<!--            <TextInput-->
<!--              v-model.trim="modifyParsingRecord.ttl"-->
<!--              type="number"-->
<!--              inputmode="numeric"-->
<!--              pattern="[0-9]*"-->
<!--              :placeholder="$tt('{ttl} (recommended)', { ttl: minTTL })"-->
<!--              :errorMessages="errors"-->
<!--            />-->
<!--          </ValidationProvider>-->
        </template>
      </div>
      <Button
        class="modify-parsing-record__button"
        type="submit"
        block
        shape="round"
        status="success"
      >
        {{ $tt('Confirm') }}
      </Button>
    </ValidationObserver>
  </Dialog>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { mapState } from 'vuex'
import {
  IAccountParsingRecord,
  ParsingRecordAction,
  ParsingRecordProfileKey,
  ParsingRecordType
} from '~/services/Account'
import Button from '~/components/Button.vue'
import Select, { IOption } from '~/components/form/Select.vue'
import TextInput from '~/components/form/TextInput.vue'
import Dialog from '~/components/Dialog.vue'
import { PARSING_RECORD_SUPPORT_CHAINS } from '~/constant/chain'
import { COMMON_KEYS } from '~/store/common'
import { capitalize, findDweb } from '~/modules/tools'
import { DWEB_KEY_OPTIONS, ParsingRecordDwebKey, PROFILE_KEY_OPTIONS } from '~/constant'
import isValidDomain from 'is-valid-domain'

export default Vue.extend({
  name: 'ModifyParsingRecord',
  components: {
    ValidationProvider,
    ValidationObserver,
    Dialog,
    Select,
    TextInput,
    Button
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
    record: {
      type: Object as PropType<IAccountParsingRecord>,
      required: true
    }
  },
  data () {
    return {
      ParsingRecordType,
      ParsingRecordProfileKey,
      modifyParsingRecord: {
        type: '',
        key: '',
        label: '',
        value: '',
        ttl: '',
        action: ''
      } as IAccountParsingRecord
    }
  },
  computed: {
    ...mapState({
      common: COMMON_KEYS.namespace
    }),
    minTTL (): string {
      return (this.common.config.min_ttl || '300') + ''
    },
    profileKeyOptions (): IOption[] {
      const _list: IOption[] = []
      PROFILE_KEY_OPTIONS.forEach((item) => {
        _list.push({
          text: item.text,
          value: item.value,
          logo: `/images/social/social-${item.value}.png`
        })
      })
      return _list
    },
    parsingRecordSupportChains (): IOption[] {
      const _list: IOption[] = []
      PARSING_RECORD_SUPPORT_CHAINS.forEach((item) => {
        _list.push({
          text: item.text,
          value: item.coinType,
          logo: `/images/chain/chain-${item.value}.png`
        })
      })
      return _list
    },
    dwebKeyOptions (): IOption[] {
      const _list: IOption[] = []
      DWEB_KEY_OPTIONS.forEach((item) => {
        _list.push({
          text: item.text,
          value: item.value,
          logo: `/images/dweb/dweb-${item.value}.png`
        })
      })
      return _list
    },
    modifyParsingRecordValueInputPlaceholder (): string {
      const dWeb = findDweb(this.modifyParsingRecord.key)
      if (this.modifyParsingRecord.key === ParsingRecordDwebKey.ipfs) {
        return this.$tt('Please enter {value} CID', { value: dWeb.text })
      }
      else if (this.modifyParsingRecord.key === ParsingRecordDwebKey.ipns) {
        return this.$tt('Please enter {value} CID or domain', { value: dWeb.text })
      }
      else {
        return this.$tt('Please enter {value}', { value: dWeb.text })
      }
    }
  },
  watch: {
    record (newVal) {
      Object.assign(this.modifyParsingRecord, newVal)
    }
  },
  methods: {
    capitalize,
    findDweb,
    onClose () {
      this.$emit('close', false)
    },
    onTrim () {
      this.modifyParsingRecord.label = this.modifyParsingRecord.label && this.modifyParsingRecord.label.trim()
      this.modifyParsingRecord.value = this.modifyParsingRecord.value && this.modifyParsingRecord.value.trim()
    },
    async onSave () {
      const verified = await (this.$refs.modifyParsingRecordForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }
      this.modifyParsingRecord.action = ParsingRecordAction.change
      this.$emit('save', { ...this.modifyParsingRecord })
      this.$emit('close', false)
    },
    onChangeModifyParsingRecordValue () {
      if ([ParsingRecordDwebKey.ipfs, ParsingRecordDwebKey.ipns].includes((this.modifyParsingRecord.key as ParsingRecordDwebKey))) {
        if (/^https?:\/\/.+/.test(this.modifyParsingRecord.value)) {
          try {
            const url = new URL(this.modifyParsingRecord.value)
            if (isValidDomain(url.host, { subdomain: true, wildcard: false, allowUnicode: true, topLevel: false })) {
              this.modifyParsingRecord.value = url.host
            }
          }
          catch (err) {
            console.error(err)
          }
        }
        else if (this.modifyParsingRecord.value) {
          try {
            const url = new URL(`https://${this.modifyParsingRecord.value}`)
            if (isValidDomain(url.host, { subdomain: true, wildcard: false, allowUnicode: true, topLevel: false })) {
              this.modifyParsingRecord.value = url.host
            }
          }
          catch (err) {
            console.error(err)
          }
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.modify-parsing-record {
  display: flex;
  flex-direction: column;
}

.modify-parsing-record__label {
  display: block;
  font-size: $font-size-14;
  font-weight: 500;
  color: $primary-font-color;
  line-height: 16px;
  margin-bottom: 4px;
}

.modify-parsing-record__label__tip {
  font-size: $font-size-14;
  font-weight: 400;
  color: $third-font-color;
  line-height: 16px;
}

.modify-parsing-record__button {
  margin-top: 32px;
}

.modify-parsing-record__margin-top-32 {
  margin-top: 32px;
}
</style>
