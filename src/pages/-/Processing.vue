<template>
  <Dialog
    :showing="showing"
    class="processing"
    :title="title"
    closeButton
    @close="onClose"
  >
    <slot />
    <a
      v-if="txHash"
      class="processing_tx-hash"
      :href="txHashLink"
      target="_blank"
    >
      {{ collapseString(txHash, 5, 5) }}
      <Iconfont
        class="processing_tx-hash_icon"
        name="arrow-right"
        color="#B0B8BF"
        size="14"
      />
    </a>
    <div
      v-if="loading"
      class="processing_animation"
    >
      <span class="processing_animation_icon">
        <Iconfont
          name="loading"
          color="#22C493"
          size="38"
        />
      </span>
      <span class="processing_animation_title">{{ $tt('Processing') }}</span>
    </div>
    <div
      v-else
      class="processing_animation_complete"
      @click="onClose"
    >
      <Iconfont
        name="check-strong"
        color="#0DBA85"
        size="24"
      />
      {{ $tt('Done') }}
    </div>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Dialog from '~/components/Dialog.vue'
import Iconfont from '~/components/icon/Iconfont.vue'
import { collapseString } from '~/modules/tools'

export default Vue.extend({
  name: 'Processing',
  components: {
    Dialog,
    Iconfont
  },
  model: {
    prop: 'showing',
    event: 'close'
  },
  props: {
    showing: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    txHash: {
      type: String,
      default: ''
    },
    txHashLink: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    collapseString,
    onClose () {
      this.$emit('close', false)
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/variables";

.processing {
  .processing_animation {
    margin-top: 32px;
    display: flex;
    align-items: center;
    background: #D6EFE7;
    border-radius: 60px;
    padding: 8px 12px;
    color: $success-font-color;
    font-size: $font-size-12;
  }

  .processing_animation_icon {
    margin-right: 4px;

    svg {
      animation: rotate360DegAnimation 0.9s linear infinite;
    }
  }

  .processing_animation_title {
    font-size: $font-size-14;
    font-weight: 600;
    color: $success-font-color;
    line-height: 16px;
  }

  .processing_animation_complete {
    margin-top: 32px;
    height: 52px;
    background: #D6EFE7;
    border-radius: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-14;
    font-weight: 600;
    color: $success-font-color;
    cursor: pointer;
  }

  .processing_tx-hash {
    display: flex;
    align-items: center;
    justify-content: left;
    font-size: $font-size-12;
    font-weight: 400;
    color: $third-font-color;
    line-height: 14px;
    margin-top: 10px;
  }

  .processing_tx-hash_icon{
    margin-left: -2px;
  }
}
</style>
