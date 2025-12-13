<template>
  <EntityManagement 
    title="系列管理" 
    :api="seriesAPI" 
    name-field="title"
  />
</template>

<script setup>
import EntityManagement from '../../components/admin/EntityManagement.vue'
import { seriesAPI } from '../../api/admin/entities'
</script>

