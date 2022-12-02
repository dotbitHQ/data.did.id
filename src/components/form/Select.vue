<template>
  <div
    class="select"
    v-click-outside="onClickOutside"
  >
    <div
      class="select__input__container"
      @click="onClick"
    >
      <input
        v-bind="$attrs"
        v-model="select"
        class="select__input"
        :class="{
          'select__input__error': !!errorMessages[0],
          'select__input__readonly': !search
        }"
        type="text"
        :readonly="!search"
        @input="onInput"
      >
      <Iconfont
        class="select__input__arrow-down"
        name="dropdown"
        color="#121314"
        size="14"
      />
    </div>
    <div
      v-if="errorMessages[0]"
      class="select__input__error-messages"
    >
      {{ errorMessages[0] }}
    </div>
    <transition name="select-options">
      <ul
        v-show="optionsShowing && showOptios.length > 0"
        class="select__options"
      >
        <li
          v-for="(option, index) in showOptios"
          :key="index"
          class="select__options__item"
          @click="onSelect(option)"
        >
          <IconImage
            v-if="option.logo"
            :url="option.logo"
            :alt="option.text"
            :size="20"
          />
          <Iconfont
            v-else-if="option.icon"
            :name="option.icon"
            :size="20"
          />
          {{ option.text }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import IconImage from '~/components/icon/IconImage.vue'
// @ts-ignore
import vClickOutside from 'v-click-outside'

export interface IOption {
  text: string,
  value: any,
  icon?: string,
  logo?: string,
}

export default Vue.extend({
  name: 'Select',
  components: {
    Iconfont,
    IconImage
  },
  directives: {
    clickOutside: vClickOutside.directive,
  },
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array as PropType<IOption[]>,
      default: () => ([]),
      required: true
    },
    search: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => ([])
    }
  },
  data () {
    return {
      optionsShowing: false,
      showOptios: [] as IOption[],
      select: '' as String | Number
    }
  },
  watch: {
    value (newVal) {
      if (newVal === '') {
        this.select = ''
      }
    }
  },
  mounted () {
    if (this.value) {
      const _option = this.options.find((option: IOption) => {
        return this.value === option.value
      })
      if (_option) {
        this.select = _option.text
      }
    }
    this.showOptios = this.options
  },
  methods: {
    onSelect (option: IOption) {
      this.$emit('input', option.value)
      this.select = option.text
      this.onInput()
      this.$emit('blur')
      this.optionsShowing = false
    },
    onClick () {
      this.optionsShowing = true
    },
    onInput () {
      let _value = event?.target?.value || ''
      let _list: IOption[] = []
      if (!this.search) {
        this.showOptios = this.options
      }
      if (_value) {
        this.options.forEach((option: IOption) => {
          const _text = option.text.toLowerCase()
          _value = _value.toLowerCase()
          if (_text.includes(_value)) {
            _list.push(option)
          }
        })
      }
      else {
        _list = this.options
      }
      this.showOptios = _list
    },
    onClickOutside () {
      this.optionsShowing = false
      if (this.value) {
        const option = this.options.find((option: IOption) => {
          return option.value === this.value
        })
        if (option?.text) {
          this.select = option.text
        }
      }
      this.onInput()
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.select {
  position: relative;
}

.select__input__container {
  position: relative;
  display: flex;
  align-items: center;
}

.select__input {
  display: inline-block;
  width: 100%;
  height: 34px;
  padding: 11px 48px 11px 24px;
  border-radius: 12px;
  border: 1px solid $input-border-color;
  background: $input-bg-color;
  color: $primary-font-color;
  caret-color: $input-focus-border-color;
  outline: none;
  font-size: $font-size-14;
  font-weight: 500;

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
  }
}

.select__input__readonly {
  cursor: pointer;
}

.select__input__error {
  border: 1px solid $error-color !important;
  background: $input-focus-bg-color !important;
}

.select__input__arrow-down {
  position: absolute;
  right: 16px;
}

.select__input__error-messages {
  margin-top: 4px;
  font-size: $font-size-12;
  font-weight: 500;
  color: $error-font-color;
  line-height: 14px;
}

.select-options-enter-active {
  animation: fadeInUp 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}

.select-options-leave-active {
  animation: fadeOutDown 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
}

.select__options {
  position: absolute;
  top: 55px;
  left: 0;
  right: 0;
  display: block;
  margin: 8px auto 0 auto;
  padding: 12px;
  max-height: 200px;
  background: $white;
  box-shadow: $option-outer-box-shadow;
  border-radius: 12px;
  border: $container-border;
  z-index: 2;
  overflow: scroll;
}

.select__options__item {
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 8px;
  grid-template-columns: 20px auto;
  padding: 12px;
  height: 20px;
  cursor: pointer;
  font-size: $font-size-16;
  font-weight: 500;
  color: $primary-font-color;

  &:hover {
    background: $normal-color;
    border-radius: 8px;
  }
}
</style>
