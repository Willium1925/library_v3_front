<template>
  <div class="filter-group">
    <div class="filter-title">
      <span>{{ title }}</span>
      <span v-if="selectedValue" class="reset-btn" @click="handleReset">清除</span>
    </div>
    
    <!-- List Type Filter (單選) -->
    <div v-if="type === 'list'" class="filter-list">
      <div
        v-for="option in options"
        :key="option.id"
        class="filter-item"
        :class="{
          active: selectedValue === option.id,
          hidden: selectedValue && selectedValue !== option.id
        }"
        @click="handleSelect(option.id)"
      >
        <span>{{ option.name }}</span>
        <span v-if="option.count !== undefined" class="filter-count">{{ option.count }}</span>
      </div>
    </div>
    
    <!-- Tags Type Filter (多選) -->
    <div v-else-if="type === 'tags'" class="tags-wrapper">
      <div
        v-for="tag in options"
        :key="tag.id"
        class="tag-pill"
        :class="{ active: isTagSelected(tag.id) }"
        @click="handleTagToggle(tag.id)"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'list', // 'list' or 'tags'
    validator: (value) => ['list', 'tags'].includes(value)
  },
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: [Number, String, Array],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'reset'])

const selectedValue = computed(() => props.modelValue)

const handleSelect = (id) => {
  if (selectedValue.value === id) {
    // 取消選擇
    emit('update:modelValue', null)
  } else {
    emit('update:modelValue', id)
  }
}

const handleReset = () => {
  emit('update:modelValue', null)
  emit('reset')
}

// Tags multi-select
const isTagSelected = (tagId) => {
  return Array.isArray(selectedValue.value) && selectedValue.value.includes(tagId)
}

const handleTagToggle = (tagId) => {
  const currentTags = Array.isArray(selectedValue.value) ? [...selectedValue.value] : []
  
  if (currentTags.includes(tagId)) {
    // Remove tag
    emit('update:modelValue', currentTags.filter(id => id !== tagId))
  } else {
    // Add tag
    emit('update:modelValue', [...currentTags, tagId])
  }
}
</script>

<style scoped>
.filter-group {
  margin-bottom: 35px;
}

.filter-title {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 2px solid var(--primary);
  padding-bottom: 10px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset-btn {
  font-size: 12px;
  color: var(--accent);
  text-decoration: underline;
  cursor: pointer;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #eee;
  background: #fff;
  cursor: pointer;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  font-size: 14px;
}

.filter-item:hover {
  border-color: var(--primary);
  transform: translateX(5px);
}

.filter-item.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  transform: translateX(0);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.filter-item.active .filter-count {
  color: #ccc;
  background: transparent;
}

.filter-item.hidden {
  display: none;
}

.filter-count {
  font-size: 12px;
  color: var(--gray);
  background: #eee;
  padding: 2px 6px;
  border-radius: 10px;
}

/* Tags */
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-pill {
  padding: 6px 15px;
  font-size: 13px;
  border: 1px solid var(--primary);
  border-radius: 50px;
  background: #fff;
  cursor: pointer;
  transition: 0.2s;
  font-weight: 500;
}

.tag-pill:hover {
  background: var(--primary);
  color: #fff;
}

.tag-pill.active {
  background: var(--primary);
  color: #fff;
}
</style>

