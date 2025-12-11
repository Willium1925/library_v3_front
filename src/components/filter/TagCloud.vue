<template>
  <div class="tags-wrapper">
    <div
      v-for="tag in tags"
      :key="tag.id"
      class="tag-pill"
      @click="handleTagClick(tag)"
    >
      {{ tag.name }}
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  tags: {
    type: Array,
    required: true,
    default: () => []
  }
})

const router = useRouter()

const handleTagClick = (tag) => {
  router.push({
    path: '/search',
    query: { tags: [tag.id] }
  })
}
</script>

<style scoped>
.tags-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-pill {
  padding: 10px 20px;
  background: #fff;
  border: 2px solid var(--primary);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 4px 4px 0px var(--primary);
  transition: 0.2s;
}

.tag-pill:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0px var(--primary);
}

.tag-pill:active {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--primary);
}
</style>

