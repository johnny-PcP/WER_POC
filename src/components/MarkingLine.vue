<script setup lang="ts">
import type { TextLine } from '@/types'
import { getLineStats } from '@/composables/useScoring'
import { computed, ref, watch } from 'vue'
import Segment from './Segment.vue'

const props = defineProps<{
  line: TextLine
  selectedSegmentId: string | null
  editMode: 'none' | 'left' | 'right'
  isTextEditMode: boolean
}>()

const emit = defineEmits<{
  toggleSegment: [lineId: string, segmentId: string]
  selectSegment: [lineId: string, segmentId: string]
  updateLineText: [lineId: string, newText: string]
  reParseLine: [lineId: string]
}>()

const stats = computed(() => getLineStats(props.line))

// 編輯中的文字
const editingText = ref(props.line.originalText)

// 當 line 變化時更新編輯文字
watch(
  () => props.line.originalText,
  (newText) => {
    editingText.value = newText
  },
)

function handleToggle(segmentId: string) {
  emit('toggleSegment', props.line.id, segmentId)
}

function handleSelect(segmentId: string) {
  emit('selectSegment', props.line.id, segmentId)
}

function handleTextChange(e: Event) {
  const target = e.target as HTMLInputElement
  editingText.value = target.value
  emit('updateLineText', props.line.id, target.value)
}

function handleReParseLine() {
  emit('reParseLine', props.line.id)
}
</script>

<template>
  <div class="marking-line flex items-baseline gap-4 py-2 border-b border-gray-200">
    <!-- 文字編輯模式 -->
    <template v-if="isTextEditMode">
      <div class="flex-1 flex items-center gap-2">
        <input
          type="text"
          :value="editingText"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="handleTextChange"
        />
      </div>
    </template>

    <!-- 標記模式 -->
    <template v-else>
      <div class="segments flex-1 flex flex-wrap items-baseline gap-1 pt-4">
        <Segment
          v-for="segment in line.segments"
          :key="segment.id"
          :segment="segment"
          :is-selected="segment.id === selectedSegmentId"
          :edit-mode="segment.id === selectedSegmentId ? editMode : 'none'"
          @toggle="handleToggle"
          @select="handleSelect"
        />
      </div>
    </template>

    <!-- 重新判定按鈕（始終顯示） -->
    <button
      class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
      @click="handleReParseLine"
      title="重新判定此行"
    >
      ↻
    </button>

    <div class="stats flex gap-2 text-sm font-mono whitespace-nowrap">
      <span class="text-blue-600">{{ stats.totalCount }}</span>
      <span v-if="stats.errorCount > 0" class="text-red-500">({{ stats.errorCount }})</span>
    </div>
  </div>
</template>

<style scoped>
.marking-line:last-child {
  border-bottom: none;
}
</style>
