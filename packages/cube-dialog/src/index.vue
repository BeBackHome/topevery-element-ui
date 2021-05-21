<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="el-dialog__wrapper cube-dialog"
      :class="fullscreen ? 'fullscreen_wrapper':'' "
      @click.self="handleWrapperClick"
    >
      <div
        :key="key"
        ref="dialog"
        role="dialog"
        aria-modal="true"
        :aria-label="title || 'dialog'"
        :class="['el-dialog', { 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        :style="style"
      >
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            v-if="showClose"
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            @click="handleClose"
          >
            <i class="el-dialog__close el-icon el-icon-close" />
          </button>
        </div>
        <div
          v-if="rendered"
          v-loading="loading"
          class="el-dialog__body"
        >
          <div class="el-dialog__body__main">
            <div
              ref="scroll-bar"
              class="scroll-bar"
            >
              <slot />
            </div>
          </div>
          <div
            v-if="$slots.footer"
            class="el-dialog__footer"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>

// import { debounce } from 'throttle-debounce';
import Popup from 'topevery-element-ui/src/utils/popup';
import Migrating from 'topevery-element-ui/src/mixins/migrating';
import emitter from 'topevery-element-ui/src/mixins/emitter';
import { debounceShake } from 'topevery-element-ui/src/utils/index.new';

export default {
  name: 'CubeDialog',
  mixins: [Popup, emitter, Migrating],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    manualAddResize: {
      type: Boolean,
      default: false
    },
    resizeTime: {
      type: Number,
      default: 300
    },
    prefix: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: true
    },
    width: String,
    fullscreen: Boolean,
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '0vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      closed: false,
      key: 0,
      percentage: 0.80, // 高度占屏幕的百分比
      maxHeight: 'auto'
    };
  },

  computed: {
    style() {
      const style = {};
      if (!this.fullscreen) {
        style.marginTop = this.top;
        style.height = this.maxHeight;
        if (this.width) {
          style.width = this.width;
        }
      }
      return style;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false;
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
          const { fullscreen } = this;
          if (!fullscreen) {
            this.computedHeight();
          }
        });
        if (this.appendToBody) {
          document.body.appendChild(this.$el);
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        if (!this.closed) this.$emit('close');
        if (this.destroyOnClose) {
          this.$nextTick(() => {
            this.key++;
          });
        }
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
      if (this.appendToBody) {
        document.body.appendChild(this.$el);
      }
      const { manualAddResize, resizeTime } = this;
      if (manualAddResize) {
        setTimeout(() => {
          this.addResize();
        }, resizeTime);
      }
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },
  beforeDestroy() {
    this.removeResize();
  },
  methods: {
    computedHeight() {
      if (!this.visible) return;
      // p判断容器高度是否大于可视区高度
      const { fullscreen, prefix } = this;
      const innerHieght = window.innerHeight || 400;
      const divHieght = this.$refs['scroll-bar'] && this.$refs['scroll-bar'].offsetHeight || 200;
      if ((divHieght + prefix) > innerHieght && !fullscreen) {
        this.maxHeight = (Math.abs(innerHieght) * this.percentage).toFixed(0) + 'px';
      } else {
        this.maxHeight = 'auto';
      }
      this.$emit('update:mainHeight', divHieght);
    },
    getMigratingConfig() {
      return {
        props: {
          'size': 'size is removed.'
        }
      };
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('close');
        this.closed = true;
      }
    },
    addResize() {
      const { fullscreen, resizeHeight } = this;
      if (!resizeHeight && !fullscreen) {
        console.log('---addResize---');
        this.computedHeight();
        // this.resizeHeight = debounce(200, true, () => { this.computedHeight(); });
        this.resizeHeight = debounceShake(200, () => { this.computedHeight(); });
        window.addEventListener('resize', this.resizeHeight);
      }
    },
    removeResize() {
      if (this.resizeHeight) {
        this.resizeHeight = null;
        window.removeEventListener('resize', this.resizeHeight);
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    },
    afterEnter() {
      this.$emit('opened');
      setTimeout(() => {
        this.addResize();
      }, 200);
    },
    afterLeave() {
      this.$emit('closed');
      this.removeResize();
    }
  }
};
</script>
