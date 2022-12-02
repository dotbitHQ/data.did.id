<template>
  <span
    v-if="showing"
    :class="['add-new-item', {'add-new-item_mobile': isMobile}]"
    @click="addNewRecord"
  >
    <Iconfont
      class="add-new-item_icon"
      color="#121314"
      name="add-new"
      size="16" />
    {{ $tt('Add New') }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'AddNewItem',
  components: {
    Iconfont
  },
  props: {
    showing: {
      type: Boolean,
      required: false
    },
    recordType: {
      type: String,
      required: false
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    }),
  },
  watch: {},
  mounted () {

  },
  beforeDestroy () {

  },
  methods: {
    addNewRecord () {
      this.$emit('click', this.recordType)
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.add-new-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  min-height: 48px;
  background: $white;
  border-radius: 24px;
  border: 0.071rem dashed $primary-font-color;
  font-size: $font-size-16;
  font-weight: 500;
  color: $primary-color;
  cursor: pointer;

  &:hover {
    background: rgba(237, 240, 242, 0.6);
  }

  .add-new-item_icon {
    margin-right: 10px;
  }

  &.add-new-item_mobile {

  }
}
</style>
