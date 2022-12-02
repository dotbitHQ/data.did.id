<template>
  <span
    class="dropdown"
    v-click-outside="onClickOutside"
  >
    <span
      ref="dropdownButton"
      class="dropdown__button"
      :class="{
        dropdown__block: block,
        dropdown__type__primary: primary,
        dropdown__type__solid: solid,
        dropdown__size__small: small,
        dropdown__size__middle: middle,
        dropdown__size__large: large
      }"
      :disabled="$attrs.disabled"
      @click="onSwitch"
    >
      <span
        v-if="loading"
        class="dropdown__loading-icon"
        :class="{'dropdown__loading-icon__margin-right-8': !!$slots.default}"
      >
        <Iconfont name="loading" color="#D5D5D5" />
      </span>
      <slot v-else />
    </span>
    <transition name="dropdown-list">
      <div
        v-show="optionsShowing"
        class="dropdown__list__context"
      >
        <ul class="dropdown__list">
          <li
            v-if="label"
            class="dropdown__label"
          >{{ label }}</li>
          <li
            v-for="option in options"
            :key="option.text"
            class="dropdown__list__item"
            @click="onSelect(option.value)"
          >
            <Iconfont
              v-if="option.icon"
              class="dropdown__list__item__icon"
              :name="option.icon"
              size="20" />
            <IconImage
              v-else-if="option.logo"
              class="dropdown__list__item__icon"
              :url="option.logo"
              :alt="option.text"
              :size="20" />
            {{ option.text }}
          </li>
        </ul>
      </div>
    </transition>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import IconImage from '~/components/icon/IconImage.vue'
// @ts-ignore
import vClickOutside from 'v-click-outside'

export default defineComponent({
  name: 'Dropdown',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    IconImage,
    Iconfont
  },
  props: {
    label: {
      type: String,
      default: '',
      required: false
    },
    block: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    primary: {
      type: Boolean,
      default: false
    },
    solid: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    middle: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => ([]),
      required: true
    }
  },
  data () {
    return {
      optionsShowing: false,
    }
  },
  methods: {
    onSelect (value: string) {
      this.$emit('select', value)
      this.optionsShowing = false
    },
    onSwitch () {
      this.optionsShowing = !this.optionsShowing
    },
    onClickOutside () {
      this.optionsShowing = false
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.dropdown {
  position: relative;
  display: inline-block;

  .dropdown__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    font-size: $font-size-16;
    font-weight: 500;
    color: $primary-font-color;
    border-radius: 100%;
    outline: none;
    cursor: pointer;
    border: 1px solid rgba(190, 192, 194, 0.16);
    box-shadow: none;
    background-color: $white;

    &:disabled {
      cursor: no-drop;
      color: rgba(0, 0, 0, 0.2);
      border: 1px solid #D2D9E1;
      box-shadow: none !important;
    }

    &:hover {
      background: rgba(237, 240, 242, 0.6);
    }

    .dropdown__link {
      padding: 17px 14px;
      color: unset;
    }
  }

  .dropdown__block {
    width: 100%;
  }

  .dropdown__type__primary {
    border: 0;
    color: $white;
    background-color: $primary-font-color;

    &:disabled {
      border: 0;
      cursor: no-drop;
      color: rgba(255, 255, 255, 0.6);
      background-color: #A0A1AB;
      box-shadow: none !important;
    }

    &:hover {
      box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.2);
    }
  }

  .dropdown__type__solid {
    padding: 0 12px;
    border: 2px solid #000000;

    &:disabled {
      cursor: no-drop;
      color: rgba(0, 0, 0, 0.2);
      border: 2px solid #D2D9E1;
      box-shadow: none !important;
    }

    &:hover {
      box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.2);
    }
  }

  .dropdown__size__small {
    height: 30px;
    border-radius: 8px;

    .dropdown__link {
      padding: 7px 14px;
      color: unset;
    }
  }

  .dropdown__size__middle {
    height: 38px;

    .dropdown__link {
      padding: 11px 14px;
      color: unset;
    }
  }

  .dropdown__size__large {
    height: 60px;
    font-size: $font-size-16;
    border-radius: 16px;

    .dropdown__link {
      padding: 21px 14px;
      color: unset;
    }
  }

  .dropdown__loading-icon {
    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .dropdown__loading-icon__margin-right-8 {
    margin-right: 8px;
  }

  .dropdown-list-enter-active {
    animation: fadeInUp 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .dropdown-list-leave-active {
    animation: fadeOutDown 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .dropdown__list__context {
    position: absolute;
    padding-top: 4px;
    right: 0;
    z-index: 10;
    text-align: left;
  }

  .dropdown__list {
    padding: 12px;
    font-size: $font-size-14;
    line-height: 17px;
    background: $white;
    box-shadow: $option-outer-box-shadow;
    border-radius: 12px;
    border: $container-border;
  }

  .dropdown__list__item {
    display: flex;
    align-items: center;
    padding: 12px 24px 12px 12px;
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    font-size: $font-size-16;
    font-weight: 500;
    color: $primary-font-color;

    &:hover {
      border-radius: 8px;
      background: $normal-color;
    }
  }

  .dropdown__label {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: $font-size-14;
    font-weight: 500;
    color: $third-font-color;
    line-height: 16px;
    text-align: left;
  }

  .dropdown__list__item__icon {
    margin-right: 8px;
  }
}
</style>
