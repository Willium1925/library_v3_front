<template>
  <EntityManagement 
    title="出版商管理" 
    :api="publishersAPI" 
    name-field="pubName"
  />
</template>

<script setup>
import EntityManagement from '../../components/admin/EntityManagement.vue'
import { publishersAPI } from '../../api/admin/entities'
</script>

