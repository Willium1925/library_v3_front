<template>
  <div class="book-grid" :class="{ [`grid-cols-${columns}`]: true }">
    <BookCard
      v-for="book in books"
      :key="book.id"
      :book="book"
      :show-status="showStatus"
    />
  </div>
</template>

<script setup>
import BookCard from './BookCard.vue'

defineProps({
  books: {
    type: Array,
    required: true,
    default: () => []
  },
  columns: {
    type: Number,
    default: 5
  },
  showStatus: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.book-grid {
  display: grid;
  gap: 20px;
}

.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-cols-5 {
  grid-template-columns: repeat(5, 1fr);
}

/* 響應式 */
@media (max-width: 1200px) {
  .grid-cols-5 {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .grid-cols-4,
  .grid-cols-5 {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

