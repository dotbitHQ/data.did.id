<template>
  <div class="textarea">
    <textarea
      v-bind="$attrs"
      :value="value"
      class="textarea__input"
      :class="{ 'textarea__input_error': !!errorMessages[0] }"
      :type="type"
      v-on="listeners"/>
    <div
      v-if="errorMessages[0]"
      class="textarea__error-messages">
      {{ errorMessages[0] }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { digitalEmojiUnifiedHandle } from '~/modules/tools'

export default Vue.extend({
  name: 'TextInput',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => ([])
    }
  },
  computed: {
    listeners (): object {
      const _vm = this
      return {
        ...this.$listeners,
        input (event: Event) {
          const value = (event.target as HTMLInputElement).value
          _vm.$emit('input', digitalEmojiUnifiedHandle(value))
        }
      }
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.textarea {
  display: flex;
  flex-direction: column;
}

.textarea__input {
  border-radius: 12px;
  border: 1px solid $input-border-color;
  color: $primary-font-color;
  caret-color: $input-focus-border-color;
  outline: none;
  font-size: $font-size-14;
  line-height: 20px;
  background: $input-bg-color;
  padding: 20px 24px;
  font-weight: 500;
  word-break: break-all;

  &:hover {
    border: 1px solid $input-focus-border-color;
  }

  &:focus {
    border: 1px solid $input-focus-border-color;
    background: $input-focus-bg-color;
  }

  &::placeholder {
    font-weight: 500;
    color: $third-font-color;
    line-height: 16px;
  }
}

.textarea__input_error {
  border: 1px solid $error-color !important;
  background: $input-focus-bg-color !important;
}

.textarea__error-messages {
  margin-top: 4px;
  font-size: $font-size-12;
  font-weight: 500;
  color: $error-font-color;
  line-height: 14px;
  text-align: left;
}
</style>
