<template>
  <span
    :class="['back-to-home', {'back-to-home_mobile': isMobile}]"
    @click="onBackToHome"
  >
    <Iconfont
      class="back-to-home_icon"
      name="back"
      size="20"
      color="#31333E"
    />
    {{ $tt('Back') }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Iconfont from '~/components/icon/Iconfont.vue'
import { COMMON_KEYS } from '~/store/common'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'BackToHome',
  components: {
    Iconfont,
  },
  props: {},
  data () {
    return {
      accountName: this.$route.params.account,
    }
  },
  computed: {
    ...mapGetters({
      isMobile: COMMON_KEYS.isMobile
    })
  },
  methods: {
    onBackToHome () {
      this.$router.push(`/${this.accountName}`)
    }
  }
})
</script>

<style lang="scss">
@import 'src/assets/variables';

.back-to-home {
  display: inline-flex;
  align-items: center;
  background: $white;
  box-shadow: $container-outer-box-shadow;
  border-radius: 45px;
  padding: 12px 16px 12px 12px;
  cursor: pointer;
  font-size: $font-size-18;
  line-height: 20px;
  color: $tips-font-color;
  font-weight: 500;

  &:hover {
    opacity: 0.7;
  }

  .back-to-home_icon {
    margin-right: 6px;
  }

  &.back-to-home_mobile {

  }
}
</style>
