<template>
  <EntityManagement 
    title="標籤管理" 
    :api="tagsAPI" 
    name-field="title"
  />
</template>

<script setup>
import EntityManagement from '../../components/admin/EntityManagement.vue'
import { tagsAPI } from '../../api/admin/entities'
</script>

