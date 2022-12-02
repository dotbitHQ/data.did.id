<template>
  <Dialog
    :showing="showing"
    :title="$tt('Exit edit mode')"
    closeButton
    @close="onClose"
  >
    <div>
      {{ $tt("Would you like to save all changes?") }}
    </div>
    <template #action>
      <div class="exit-edit-mode-tips__buttons">
        <Button
          shape="round"
          @click="onExit"
        >
          {{ $tt('Exit') }}
        </Button>
        <Button
          shape="round"
          status="success"
          @click="onSave"
        >
          {{ $tt('Save') }}
        </Button>
      </div>
    </template>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Button from '~/components/Button.vue'

export default Vue.extend({
  name: 'ExitEditModeTips',
  components: {
    Dialog,
    Button
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    onExit () {
      this.$emit('exit')
      this.onClose()
    },
    onSave () {
      this.$emit('save')
    },
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.exit-edit-mode-tips__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-flow: column;
  grid-column-gap: 8px;
}
</style>
