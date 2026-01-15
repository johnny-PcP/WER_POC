<script setup lang="ts">
import type { TextLine } from '@/types'
import { getTotalStats } from '@/composables/useScoring'
import { computed } from 'vue'

const props = defineProps<{
  lines: TextLine[]
}>()

const stats = computed(() => getTotalStats(props.lines))
</script>

<template>
  <div class="total-stats bg-gray-100 rounded-lg p-4">
    <div class="flex flex-wrap gap-6 justify-center text-lg">
      <div class="stat-item">
        <span class="text-gray-600">總詞數：</span>
        <span class="font-bold text-blue-600">{{ stats.totalCount }}</span>
      </div>
      <div class="stat-item">
        <span class="text-gray-600">錯誤數：</span>
        <span class="font-bold text-red-500">{{ stats.errorCount }}</span>
      </div>
      <div class="stat-item">
        <span class="text-gray-600">正確率：</span>
        <span class="font-bold text-green-600">{{ stats.correctRate.toFixed(1) }}%</span>
      </div>
      <div class="stat-item">
        <span class="text-gray-600">錯誤率：</span>
        <span class="font-bold text-orange-500">{{ stats.errorRate.toFixed(1) }}%</span>
      </div>
    </div>
  </div>
</template>
