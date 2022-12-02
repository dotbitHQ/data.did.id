<template>
  <Dialog
    :showing="showing"
    :title="$tt('Add Data')"
    closeButton
    @close="onClose"
  >
    <ValidationObserver
      ref="addParsingRecordForm"
      class="add-parsing-record"
      tag="form"
      @submit.prevent="onSave"
    >
      <div class="add-parsing-record__content">
        <template v-if="newParsingRecord.type === ParsingRecordType.address">
          <label class="add-parsing-record__label">
            {{ $tt('Public Chain') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Public Chain')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="parsingRecordSupportChains"
              :placeholder="$tt('Please select the public chain')"
              search
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $tt('Address') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Address')"
            :rules="`required|address:${newParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="newParsingRecord.value"
              :placeholder="$tt('Please enter the address')"
              :errorMessages="errors"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.profile">
          <label class="add-parsing-record__label">
            {{ $tt('Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Key')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="profileKeyOptions"
              :placeholder="$tt('Please select the key')"
              :errorMessages="errors"
              search
              @input="onChangeProfileKey"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ findProfile(newParsingRecord.key).text }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="findProfile(newParsingRecord.key).text"
            :rules="`required|max:1024|profileValue:${newParsingRecord.key}`"
          >
            <TextInput
              v-model="newParsingRecord.value"
              :placeholder="$tt('Please enter {value}', { value: findProfile(newParsingRecord.key).text })"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.dweb">
          <label class="add-parsing-record__label">
            {{ $tt('Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Key')"
            rules="selectRequired"
          >
            <Select
              v-model="newParsingRecord.key"
              :options="dwebKeyOptions"
              :placeholder="$tt('Please select the key')"
              :errorMessages="errors"
              search
              @input="onChangeProfileKey"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ findDweb(newParsingRecord.key).text }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="findDweb(newParsingRecord.key).text"
            :rules="`required|max:1024|dwebValue:${newParsingRecord.key}`"
          >
            <TextInput
              v-model.trim="newParsingRecord.value"
              :placeholder="newParsingRecordValueInputPlaceholder"
              :errorMessages="errors"
              @change="onChangeNewParsingRecordValue"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type === ParsingRecordType.customKey">
          <label class="add-parsing-record__label">
            {{ $tt('Custom Key') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Custom Key')"
            rules="required|objectkey|max:255"
          >
            <TextInput
              v-model.trim="newParsingRecord.key"
              :placeholder="$tt('Please enter custom key')"
              :errorMessages="errors"
            />
          </ValidationProvider>
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $tt('Custom Value') }}
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Custom Value')"
            rules="required|max:1024"
          >
            <TextInput
              v-model="newParsingRecord.value"
              :placeholder="$tt('Please enter custom value')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
        </template>
        <template v-if="newParsingRecord.type">
          <label class="add-parsing-record__label add-parsing-record__margin-top-32">
            {{ $tt('Label') }}
            <span class="add-parsing-record__label__tip">({{ $tt('Optional') }})</span>
          </label>
          <ValidationProvider
            v-slot="{ errors }"
            :name="$tt('Label')"
            rules="max:64"
          >
            <TextInput
              v-model="newParsingRecord.label"
              :placeholder="$tt('eg personal account')"
              :errorMessages="errors"
              @blur="onTrim"
            />
          </ValidationProvider>
<!--          <label class="add-parsing-record__label add-parsing-record__margin-top-32">-->
<!--            {{ $tt('TTL') }}-->
<!--            <span class="add-parsing-record__label__tip">({{ $tt('Unit: second') }})</span>-->
<!--          </label>-->
<!--          <ValidationProvider-->
<!--            v-slot="{ errors }"-->
<!--            :name="$tt('TTL')"-->
<!--            rules="positiveIntegers"-->
<!--          >-->
<!--            <TextInput-->
<!--              v-model.trim="newParsingRecord.ttl"-->
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
        class="add-parsing-record_button"
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
import Vue from 'vue'
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
import { capitalize, findDweb, findProfile } from '~/modules/tools'
import { DWEB_KEY_OPTIONS, ParsingRecordDwebKey, PROFILE_KEY_OPTIONS, TwitterUserUrlRegExp } from '~/constant'
import isValidDomain from 'is-valid-domain'

export default Vue.extend({
  name: 'AddParsingRecord',
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
    type: {
      type: String,
      default: ''
    },
    recordKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      ParsingRecordType,
      ParsingRecordProfileKey,
      newParsingRecord: {
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
    newParsingRecordValueInputPlaceholder (): string {
      const dWeb = findDweb(this.newParsingRecord.key)
      if (this.newParsingRecord.key === ParsingRecordDwebKey.ipfs) {
        return this.$tt('Please enter {value} CID', { value: dWeb.text })
      }
      else if (this.newParsingRecord.key === ParsingRecordDwebKey.ipns) {
        return this.$tt('Please enter {value} CID or domain', { value: dWeb.text })
      }
      else {
        return this.$tt('Please enter {value}', { value: dWeb.text })
      }
    }
  },
  watch: {
    minTTL (newVal) {
      this.newParsingRecord.ttl = newVal
    },
    type (newVal) {
      this.newParsingRecord.type = newVal
    },
    recordKey (newVal) {
      this.newParsingRecord.key = newVal
    }
  },
  methods: {
    capitalize,
    findProfile,
    findDweb,
    onClose () {
      this.resetNewParsingRecord()
      this.$emit('close', false)
    },
    onTrim () {
      this.newParsingRecord.label = this.newParsingRecord.label && this.newParsingRecord.label.trim()
      this.newParsingRecord.value = this.newParsingRecord.value && this.newParsingRecord.value.trim()
      if (this.newParsingRecord.key === ParsingRecordProfileKey.twitter && TwitterUserUrlRegExp.test(this.newParsingRecord.value)) {
        this.newParsingRecord.value = this.newParsingRecord.value.replace('https://twitter.com/', '')
      }
    },
    async onSave () {
      const verified = await (this.$refs.addParsingRecordForm as HTMLFormElement).validate()
      if (!verified) {
        return
      }
      this.newParsingRecord.action = ParsingRecordAction.add
      this.$emit('save', { ...this.newParsingRecord })
      this.resetNewParsingRecord()
      this.$emit('close', false)
    },
    resetNewParsingRecord () {
      Object.assign(this.newParsingRecord, {
        key: '',
        label: '',
        value: '',
        ttl: this.minTTL,
        action: ''
      })
    },
    onChangeProfileKey () {
      Object.assign(this.newParsingRecord, {
        label: '',
        value: '',
        ttl: this.minTTL
      })
    },
    onChangeNewParsingRecordValue () {
      if ([ParsingRecordDwebKey.ipfs, ParsingRecordDwebKey.ipns].includes((this.newParsingRecord.key as ParsingRecordDwebKey))) {
        if (/^https?:\/\/.+/.test(this.newParsingRecord.value)) {
          try {
            const url = new URL(this.newParsingRecord.value)
            if (isValidDomain(url.host, { subdomain: true, wildcard: false, allowUnicode: true, topLevel: false })) {
              this.newParsingRecord.value = url.host
            }
          }
          catch (err) {
            console.error(err)
          }
        }
      }
      else if (this.newParsingRecord.value) {
        try {
          const url = new URL(`https://${this.newParsingRecord.value}`)
          if (isValidDomain(url.host, { subdomain: true, wildcard: false, allowUnicode: true, topLevel: false })) {
            this.newParsingRecord.value = url.host
          }
        }
        catch (err) {
          console.error(err)
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.add-parsing-record {
  display: flex;
  flex-direction: column;
}

.add-parsing-record__content {
  min-height: 300px;
}

.add-parsing-record__label {
  display: block;
  font-size: $font-size-14;
  font-weight: 500;
  color: $primary-font-color;
  line-height: 16px;
  margin-bottom: 4px;
}

.add-parsing-record__label__tip {
  font-size: $font-size-14;
  font-weight: 400;
  color: $third-font-color;
  line-height: 16px;
}

.add-parsing-record_button {
  margin-top: 32px;
}

.add-parsing-record__margin-top-24 {
  margin-top: 24px;
}

.add-parsing-record__margin-top-32 {
  margin-top: 32px;
}
</style>
