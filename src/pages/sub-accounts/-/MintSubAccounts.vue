<template>
  <span
    :class="['mint-sub-accounts', {'mint-sub-accounts_mobile': isMobile}]"
    @click="addNew"
  >
    <Iconfont
      class="mint-sub-accounts_icon"
      color="#121314"
      name="add-new"
      size="16" />
    {{ $tt('Mint SubDIDs') }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'MintSubAccounts',
  components: {
    Iconfont
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    })
  },
  methods: {
    addNew () {
      this.$emit('click')
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.mint-sub-accounts {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
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

  .mint-sub-accounts_icon {
    margin-right: 10px;
  }

  &.mint-sub-accounts_mobile {

  }
}
</style>
