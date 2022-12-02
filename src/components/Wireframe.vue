<!-- a wireframe components to act as a wireframe when loading -->
<style lang="scss">
@import "src/assets/variables";

.wireframe {
  display: inline-block;
  background: $divider-color;

  &._round {
    border-radius: 4px;
  }

  &._circle {
    border-radius: 100%;
  }
}
</style>

<template>
  <div class="wireframe" :class="`_${shape}`" :style="{height: `${height}px`, width: `${width}px`}" />
</template>

<script lang="ts">
export default {
  name: 'Wireframe',
  components: {},
  props: {
    shape: {
      type: String,
      default: 'round', // rect, circle, round
    },
    height: {
      type: [Number, String],
      default: 10,
    },
    width: {
      type: [Number, String],
      default: 10,
    }
  },
}
</script>
