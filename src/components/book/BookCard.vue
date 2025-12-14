<template>
  <div class="book-card">
    <div class="book-card__img-wrapper" @click="goToDetail">
      <img
        :src="book.imageUrl || 'https://placehold.co/300x400/eee/333?text=No+Cover'"
        :alt="book.title"
      />
      <div class="favorite-overlay">
        <FavoriteButton :book-id="book.id" />
      </div>
    </div>
    <div class="book-card__info" @click="goToDetail">
      <h3 class="book-card__title">{{ book.title }}</h3>
      <p class="book-card__meta">作者：{{ Array.isArray(book.authors) ? book.authors.join('、') : (book.author || book.authors || '未知') }}</p>
      <p class="book-card__meta">出版：{{ book.publisherName }}</p>
      <div v-if="showStatus" class="book-card__status">
        <span
          :class="[
            'status-badge',
            {
              'status-available': book.availableCopies > 0,
              'status-unavailable': book.availableCopies === 0
            }
          ]"
        >
          {{ book.availableCopies > 0 ? `尚餘 ${book.availableCopies} 本` : '全部借出' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import FavoriteButton from './FavoriteButton.vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  },
  showStatus: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const availableCount = computed(() => props.book.availableCount || 0)

const goToDetail = () => {
  router.push(`/books/${props.book.id}`)
}
</script>

<style scoped>
.book-card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.book-card__img-wrapper {
  width: 100%;
  aspect-ratio: 3/4;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  position: relative;
}

.book-card__img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  opacity: 1; /* always visible */
  transition: opacity 0.3s;
  padding: 6px;
}

.book-card__info {
  padding: 15px;
  cursor: pointer;
}

.book-card__title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 5px;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-card__meta {
  font-size: 12px;
  color: var(--gray);
  margin-bottom: 2px;
}

.book-card__status {
  text-align: right;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
}

.status-available {
  background: #059669;
  color: #fff;
  opacity: 0.75;

}

.status-unavailable {
  background: var(--gray);
  color: #fff;
}
</style>
