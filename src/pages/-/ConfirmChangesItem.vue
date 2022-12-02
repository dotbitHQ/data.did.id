<template>
  <div :class="['confirm-changes-item', {'confirm-changes-item_mobile': isMobile}]">
    <span class="confirm-changes__item__header">
      <IconImage
        class="confirm-changes_item_info_logo"
        :url="logo"
        :alt="label"
        :size="32"
        rounded
      />
      <span>
        <div class="confirm-changes__item__label">
          {{ label }}
        </div>
        <div
          class="confirm-changes__item__value"
          :class="{ 'confirm-changes__item_delete': action === ParsingRecordAction.delete }">
          {{ value }}
        </div>
      </span>
    </span>
    <ActionLabel :action="action" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import ActionLabel from '~/pages/-/ActionLabel.vue'
import IconImage from '~/components/icon/IconImage.vue'
import { ParsingRecordAction } from '~/services/Account'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ConfirmChangesItem',
  components: {
    ActionLabel,
    IconImage
  },
  props: {
    logo: String,
    label: String,
    value: String,
    action: String
  },
  data () {
    return {
      ParsingRecordAction,
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.confirm-changes-item {
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  height: 50px;
  background: #EDF0F2;
  border-radius: 25px;

  .confirm-changes__item__header {
    display: inline-flex;
    align-items: center;
  }

  .confirm-changes_item_info_logo {
    margin-right: 8px;

    &._disable {
      filter: grayscale(100%);
    }
  }

  .confirm-changes__item__label {
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $font-size-16;
    font-weight: bold;
    color: $primary-font-color;
  }

  .confirm-changes__item__value {
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: $font-size-14;
    font-weight: 500;
    color: $assist-font-color;
  }

  .confirm-changes__item_delete {
    color: $error-color;
    text-decoration: line-through;
  }

  &.confirm-changes-item_mobile {
    .confirm-changes__item__value {
      width: 150px;
    }
  }
}
</style>
