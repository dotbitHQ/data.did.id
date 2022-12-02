<template>
  <span
    :class="['action-buttons', {'action-buttons_mobile': isMobile}]"
    @click.stop
  >
    <button
      class="action-buttons_button"
      @click="editData"
    >
      <Iconfont
        name="edit"
        size="15"
        color="#31333E"
      />
    </button>
    <span class="action-buttons_split-line"></span>
    <button
      class="action-buttons_button _right"
      @click="deleteData"
    >
      <Iconfont
        name="delete"
        size="15"
        color="#EB5757"
      />
    </button>
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'ActionButtons',
  components: {
    Iconfont
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  },
  methods: {
    deleteData () {
      this.$emit('delete')
    },
    editData () {
      this.$emit('edit')
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.action-buttons {
  display: inline-flex;
  align-items: center;
  position: absolute;
  right: 10px;
  background: $white;
  box-shadow: $container-outer-box-shadow;
  border-radius: 16px;

  .action-buttons_button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 32px;
    background: #FFFFFF;
    opacity: 1;
    outline: 0;
    border: 0;
    border-radius: 15px 0 0 15px;
    cursor: pointer;

    &:hover {
      background: $normal-color;
    }

    &._right {
      border-radius: 0 15px 15px 0;
    }
  }

  .action-buttons_split-line {
    display: inline-block;
    width: 1px;
    height: 12px;
    background: #EAECED;
  }

  &.action-buttons_mobile {

  }
}
</style>
