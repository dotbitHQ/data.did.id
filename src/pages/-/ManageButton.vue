<template>
  <span
    class="manage-button"
    v-click-outside="onClickOutside"
  >
    <span
      ref="manageButton"
      class="manage-button__button"
      :class="{
        'manage-button__block': block,
        'manage-button__type__primary': primary,
        'manage-button__type__solid': solid,
        'manage-button__size__small': small,
        'manage-button__size__middle': middle,
        'manage-button__size__large': large,
        label: showLabel
      }"
      :disabled="$attrs.disabled"
      @click="onSwitch"
    >
      <span
        v-if="loading"
        class="manage-button__loading-icon"
        :class="{'manage-button__loading-icon__margin-right-8': !!$slots.default}"
      >
        <Iconfont name="loading" color="#D5D5D5" />
      </span>
      <slot v-else />
    </span>
    <transition name="manage-button-list">
      <div
        v-show="optionsShowing"
        class="manage-button__list__context"
      >
        <ul class="manage-button__list">
          <li
            v-if="label"
            class="manage-button__label"
          >{{ label }}</li>
          <li
            v-for="option in options"
            :key="option.text"
            class="manage-button__list__item"
            :class="{ '_disable': option.comingSoon }"
            @click="onSelect(option)"
          >
            <div class="manage-button__list__item__content">
              <Iconfont
                v-if="option.icon"
                class="manage-button__list__item__icon"
                :name="option.icon"
                :color="option.color"
                size="20" />
              {{ option.text }}
              <span
                v-if="option.comingSoon"
                class="manage-button__list__item__coming-soon"
              >{{ $tt('(Coming soon)') }}</span>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { SETTINGS } from '~/constant'
// @ts-ignore
import vClickOutside from 'v-click-outside'

export default defineComponent({
  name: 'ManageButton',
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    Iconfont
  },
  props: {
    label: {
      type: String,
      default: '',
      required: false
    },
    showLabel: {
      type: Boolean,
      default: false,
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
      SETTINGS,
      optionsShowing: false,
    }
  },
  methods: {
    onSelect (option: any) {
      if (option.comingSoon) {
        return
      }
      this.$emit('select', option.value)
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
@import "src/assets/variables";

.manage-button {
  position: relative;
  display: inline-block;

  .manage-button__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 34px;
    font-size: $font-size-16;
    font-weight: 500;
    color: $primary-font-color;
    border-radius: 18px;
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

    .manage-button__link {
      padding: 17px 14px;
      color: unset;
    }
  }

  .manage-button__block {
    width: 100%;
  }

  .manage-button__type__primary {
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

  .manage-button__type__solid {
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

  .manage-button__size__small {
    height: 30px;
    border-radius: 8px;

    .manage-button__link {
      padding: 7px 14px;
      color: unset;
    }
  }

  .manage-button__size__middle {
    height: 38px;

    .manage-button__link {
      padding: 11px 14px;
      color: unset;
    }
  }

  .manage-button__size__large {
    height: 60px;
    font-size: $font-size-16;
    border-radius: 16px;

    .manage-button__link {
      padding: 21px 14px;
      color: unset;
    }
  }

  .manage-button__loading-icon {
    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .manage-button__loading-icon__margin-right-8 {
    margin-right: 8px;
  }

  .manage-button__list__context {
    position: absolute;
    padding-top: 4px;
    left: 0;
    z-index: 10;
    text-align: left;
  }

  .manage-button-list-enter-active {
    animation: fadeInUp 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .manage-button-list-leave-active {
    animation: fadeOutDown 0.1s cubic-bezier(0.75, 0.25, 0.25, 0.75);
  }

  .manage-button__list {
    padding: 12px;
    font-size: $font-size-14;
    line-height: 17px;
    background: $white;
    box-shadow: $option-outer-box-shadow;
    border-radius: 12px;
    border: $container-border;
  }

  .manage-button__list__item {
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

    &._disable {
      color: $third-font-color;
      cursor: no-drop;
    }
  }

  .manage-button__label {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: $font-size-14;
    font-weight: 500;
    color: $third-font-color;
    line-height: 16px;
    text-align: left;
  }

  .manage-button__list__item__icon {
    margin-right: 8px;
  }

  .label {
    width: unset;
    border-radius: 22px;
    padding: 0 10px;
  }

  .manage-button__list__item__content {
    display: flex;
    align-items: center;
  }

  .manage-button__list__item__coming-soon {
    color: $third-font-color
  }
}
</style>
