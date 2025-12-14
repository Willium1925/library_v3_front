<template>
  <div class="list-card" :class="{ 'overdue-border': isOverdue }">
    <div class="card-img">
      <img
        :src="book.imageUrl || 'https://placehold.co/100x140/eee/333?text=Book'"
        :alt="book.title"
      />
    </div>
    <div class="card-info">
      <div class="card-title">{{ book.title }}</div>
      <div class="card-meta">作者：{{ Array.isArray(book.authors) ? book.authors.join('、') : (book.author || book.authors || '未知') }}</div>
      <div class="card-meta">書籍碼：{{ book.uniqueCode }}</div>
      <slot name="meta"></slot>
    </div>
    <div class="card-status">
      <slot name="status"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  },
  isOverdue: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.list-card {
  background: #fff;
  border: 1px solid var(--light-border);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  gap: 25px;
  align-items: flex-start;
  position: relative;
}

.list-card:hover {
  border-color: var(--primary);
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.05);
}

.card-img {
  width: 100px;
  height: 140px;
  background: #eee;
  flex-shrink: 0;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 140px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-meta {
  font-size: 13px;
  color: #555;
  margin-bottom: 4px;
}

.card-status {
  min-width: 150px;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  height: 140px;
}

.overdue-border {
  border: 2px solid var(--accent);
}
</style>

