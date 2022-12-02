<template>
  <span
    class="action-label"
    :class="{
      'action-label_change': action === ParsingRecordAction.change,
      'action-label_add': action === ParsingRecordAction.add,
      'action-label_delete': action === ParsingRecordAction.delete
    }">
    <template v-if="action === ParsingRecordAction.delete">
      {{ $tt('Delete') }}
    </template>
    <template v-else-if="action === ParsingRecordAction.add">
      {{ $tt('Add') }}
    </template>
    <template v-else-if="action === ParsingRecordAction.change">
      {{ $tt('Modify') }}
    </template>
    <template v-else>
      {{ $tt('No change') }}
    </template>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { ParsingRecordAction } from '~/services/Account'

export default Vue.extend({
  name: 'ActionLabel',
  props: {
    action: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      ParsingRecordAction
    }
  }
})
</script>

<style lang="scss" scoped>
@import "src/assets/variables";

.action-label {
  padding: 0 6px;
  display: inline-block;
  width: 64px;
  height: 24px;
  background: $white;
  text-align: center;
  line-height: 24px;
  font-size: $font-size-12;
  font-weight: 500;
  color: $primary-font-color;
  box-shadow: $container-outer-box-shadow;
  border-radius: 15px;
}

.action-label_change,
.action-label_add {
  color: $success-font-color;
  border: 0;
}

.action-label_delete {
  color: $error-font-color;
  border: 0;
}
</style>
