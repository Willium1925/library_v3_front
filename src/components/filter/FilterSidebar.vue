<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3>篩選條件</h3>
      <button v-if="hasActiveFilters" @click="clearAllFilters" class="clear-all-btn">
        全部清除
      </button>
    </div>
    
    <!-- Main Category -->
    <FilterGroup
      title="主分類"
      type="list"
      :options="mainCategories"
      v-model="filters.mainCategoryId"
      @update:modelValue="handleFilterChange"
    />
    
    <!-- Sub Category -->
    <FilterGroup
      v-if="subCategories.length > 0"
      title="子分類"
      type="list"
      :options="subCategories"
      v-model="filters.subCategoryId"
      @update:modelValue="handleFilterChange"
    />
    
    <!-- Author -->
    <FilterGroup
      title="作者"
      type="list"
      :options="authors"
      v-model="filters.authorId"
      @update:modelValue="handleFilterChange"
    />
    
    <!-- Publisher -->
    <FilterGroup
      title="出版商"
      type="list"
      :options="publishers"
      v-model="filters.publisherId"
      @update:modelValue="handleFilterChange"
    />
    
    <!-- Tags -->
    <FilterGroup
      title="標籤"
      type="tags"
      :options="tags"
      v-model="filters.tags"
      @update:modelValue="handleFilterChange"
    />
    
  </aside>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import FilterGroup from './FilterGroup.vue'

const props = defineProps({
  mainCategories: {
    type: Array,
    default: () => []
  },
  subCategories: {
    type: Array,
    default: () => []
  },
  authors: {
    type: Array,
    default: () => []
  },
  publishers: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  },
  initialFilters: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['filter-change'])

const filters = reactive({
  mainCategoryId: props.initialFilters.mainCategoryId || null,
  subCategoryId: props.initialFilters.subCategoryId || null,
  authorId: props.initialFilters.authorId || null,
  publisherId: props.initialFilters.publisherId || null,
  tags: props.initialFilters.tags || []
})

const hasActiveFilters = computed(() => {
  return filters.mainCategoryId ||
    filters.subCategoryId ||
    filters.authorId ||
    filters.publisherId ||
    filters.tags.length > 0
})

const handleFilterChange = () => {
  emit('filter-change', { ...filters })
}

const clearAllFilters = () => {
  filters.mainCategoryId = null
  filters.subCategoryId = null
  filters.authorId = null
  filters.publisherId = null
  filters.tags = []
  handleFilterChange()
}

// 當主分類改變時，清除子分類選擇
watch(() => filters.mainCategoryId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    filters.subCategoryId = null
  }
})
</script>

<style scoped>
.sidebar {
  background: #fff;
  border: 1px solid var(--border-color);
  padding: 25px;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid var(--primary);
}

.sidebar-header h3 {
  font-size: 20px;
  font-weight: 700;
}

.clear-all-btn {
  font-size: 12px;
  color: var(--accent);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity 0.2s;
}

.clear-all-btn:hover {
  opacity: 0.7;
}

</style>

