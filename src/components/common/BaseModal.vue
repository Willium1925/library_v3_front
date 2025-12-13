<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" :class="sizeClass">
          <!-- 標題欄 -->
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="handleClose" title="關閉">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <!-- 內容區 -->
          <div class="modal-body">
            <slot></slot>
          </div>

          <!-- 按鈕區 -->
          <div class="modal-footer" v-if="!hideFooter">
            <button 
              v-if="!hideCancel" 
              class="btn btn-secondary" 
              @click="handleCancel"
              :disabled="loading"
            >
              {{ cancelText }}
            </button>
            <button 
              v-if="!hideConfirm" 
              class="btn btn-primary" 
              @click="handleConfirm"
              :disabled="loading"
            >
              <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  hideFooter: {
    type: Boolean,
    default: false
  },
  hideCancel: {
    type: Boolean,
    default: false
  },
  hideConfirm: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: '確定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close'])

const sizeClass = computed(() => `modal-${props.size}`)

const handleClose = () => {
  if (props.closeOnClickOutside && !props.loading) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleCancel = () => {
  if (!props.loading) {
    emit('update:modelValue', false)
    emit('cancel')
  }
}

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-small {
  width: 400px;
}

.modal-medium {
  width: 600px;
}

.modal-large {
  width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--primary);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary);
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d1d5db;
}

/* 過渡動畫 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}
</style>

