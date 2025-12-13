<template>
  <EntityManagement 
    title="作者管理" 
    :api="authorsAPI" 
    name-field="name"
  />
</template>

<script setup>
import EntityManagement from '../../components/admin/EntityManagement.vue'
import { authorsAPI } from '../../api/admin/entities'
</script>

