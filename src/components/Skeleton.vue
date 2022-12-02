<template>
  <span
    class="skeleton_item"
  >
    <Wireframe
      class="skeleton_item_logo"
      shape="circle"
      height="32"
      width="32"
    />
    <div class="skeleton_item_info">
      <Wireframe
        class="skeleton_item_title"
        shape="round"
        height="16"
        width="100"
      />
      <Wireframe shape="round" height="16" width="200" />
    </div>
  </span>
</template>

<script lang="ts">
import Wireframe from '~/components/Wireframe.vue'

export default {
  name: 'Skeleton',
  components: {
    Wireframe
  }
}
</script>

<style lang="scss">
@import "src/assets/variables";

.skeleton_item {
  display: flex;
  align-items: center;
  height: 50px;
  min-height: 50px;
  padding: 0 10px;
  background: $divider-color;
  border-radius: 25px;
}

.skeleton_item_logo {
  margin-right: 8px;
}

.skeleton_item_info {
  display: flex;
  flex-direction: column;
}

.skeleton_item_title {
  margin-bottom: 4px;
}
</style>
