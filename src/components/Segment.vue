<script setup lang="ts">
import type { Segment } from '@/types'
import type { PreviewHighlight } from '@/composables/useSegmentPreview'
import type { SearchMatch } from '@/composables/useSearch'

defineOptions({
  name: 'TextSegment',
})

const props = defineProps<{
  segment: Segment
  isSelected: boolean
  editMode: 'none' | 'left' | 'right'
  previewHighlight?: PreviewHighlight | null
  isAdjacentPreview?: boolean
  searchMatches?: SearchMatch[]
  currentSearchMatch?: SearchMatch | null
}>()

const emit = defineEmits<{
  toggle: [id: string]
  select: [id: string]
}>()

function handleClick(id: string) {
  if (props.isSelected) {
    // 已選中：切換狀態
    emit('toggle', id)
  } else {
    // 未選中：只移動選取框
    emit('select', id)
  }
}

// 判斷是否應該顯示預覽
function shouldShowPreview(): boolean {
  return !!(props.previewHighlight && (props.isSelected || props.isAdjacentPreview))
}

// 判斷是否有搜尋匹配
function hasSearchMatches(): boolean {
  return !!(props.searchMatches && props.searchMatches.length > 0)
}

// 渲染帶搜尋高亮的文字片段
interface TextPart {
  text: string
  highlight: boolean
  current: boolean
}

function getSearchHighlightedParts(): TextPart[] {
  const text = props.segment.text
  const matches = props.searchMatches
  if (!matches || matches.length === 0) {
    return [{ text, highlight: false, current: false }]
  }

  const parts: TextPart[] = []
  let lastIndex = 0

  // 按 matchIndex 排序
  const sortedMatches = [...matches].sort((a, b) => a.matchIndex - b.matchIndex)

  for (const match of sortedMatches) {
    // 未匹配部分
    if (match.matchIndex > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.matchIndex),
        highlight: false,
        current: false,
      })
    }
    // 匹配部分
    const isCurrent =
      props.currentSearchMatch?.segmentId === props.segment.id &&
      props.currentSearchMatch?.matchIndex === match.matchIndex
    parts.push({
      text: text.slice(match.matchIndex, match.matchIndex + match.matchLength),
      highlight: true,
      current: isCurrent,
    })
    lastIndex = match.matchIndex + match.matchLength
  }

  // 剩餘部分
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), highlight: false, current: false })
  }

  return parts
}
</script>

<template>
  <span
    :data-segment-id="segment.id"
    class="segment cursor-pointer px-0.5 transition-colors relative"
    :class="[
      segment.isDeleted
        ? 'segment-deleted'
        : segment.isError
          ? 'segment-error'
          : 'segment-correct',
      isSelected ? 'segment-selected' : '',
      isSelected && segment.isError ? 'segment-selected-error' : '',
      isSelected && segment.isDeleted ? 'segment-selected-deleted' : '',
      isAdjacentPreview ? 'segment-adjacent-preview' : '',
    ]"
    @click="handleClick(segment.id)"
  >
    <!-- 左邊界調整指示器（Z 模式） -->
    <span
      v-if="isSelected && editMode === 'left'"
      class="arrow-indicator arrow-left"
    >
      ◀▶
    </span>
    <!-- 右邊界調整指示器（X 模式） -->
    <span
      v-if="isSelected && editMode === 'right'"
      class="arrow-indicator arrow-right"
    >
      ◀▶
    </span>

    <!-- 預覽高亮模式 -->
    <template v-if="shouldShowPreview() && previewHighlight">
      <!-- 左邊界預覽：高亮第一個字元 -->
      <template v-if="previewHighlight.position === 'start'">
        <span :class="isSelected ? 'preview-char-movable' : 'preview-char-target'">{{
          segment.text[0]
        }}</span
        ><span>{{ segment.text.slice(1) }}</span>
      </template>
      <!-- 右邊界預覽：高亮最後一個字元 -->
      <template v-else>
        <span>{{ segment.text.slice(0, -1) }}</span
        ><span :class="isSelected ? 'preview-char-movable' : 'preview-char-target'">{{
          segment.text.slice(-1)
        }}</span>
      </template>
    </template>

    <!-- 搜尋高亮模式 -->
    <template v-else-if="hasSearchMatches()">
      <template v-for="(part, index) in getSearchHighlightedParts()" :key="index">
        <span
          v-if="part.highlight"
          class="search-highlight"
          :class="{ 'search-highlight-current': part.current }"
          >{{ part.text }}</span
        ><span v-else>{{ part.text }}</span>
      </template>
    </template>

    <!-- 正常顯示 -->
    <template v-else>
      {{ segment.text }}
    </template>
  </span>
</template>

<style scoped>
.segment {
  display: inline-block;
  border-bottom: 2px solid;
  margin: 0 1px;
  padding: 2px 4px;
  border-radius: 2px;
}

.segment-correct {
  border-bottom-color: #3b82f6;
}

.segment-error {
  border-bottom-color: #ef4444;
}

.segment-deleted {
  border-bottom-color: transparent;
  color: #9ca3af;
}

/* === 選中狀態 - 基礎（正確狀態） === */
.segment-selected {
  background-color: rgba(251, 191, 36, 0.25);
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
  box-shadow:
    0 0 0 1px rgba(251, 191, 36, 0.3),
    0 0 12px rgba(251, 191, 36, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
  transform: scale(1.02);
  z-index: 10;
  animation: selection-pulse 2s ease-in-out infinite;
}

/* === 選中狀態 - 錯誤狀態 === */
.segment-selected-error {
  background-color: rgba(239, 68, 68, 0.2);
  outline-color: #ef4444;
  box-shadow:
    0 0 0 1px rgba(239, 68, 68, 0.3),
    0 0 12px rgba(239, 68, 68, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
  animation: selection-pulse-error 2s ease-in-out infinite;
}

/* === 選中狀態 - 已刪除狀態 === */
.segment-selected-deleted {
  background-color: rgba(156, 163, 175, 0.2);
  outline-color: #9ca3af;
  box-shadow:
    0 0 0 1px rgba(156, 163, 175, 0.3),
    0 0 12px rgba(156, 163, 175, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
  animation: selection-pulse-deleted 2s ease-in-out infinite;
}

/* === 選中脈衝動畫 === */
@keyframes selection-pulse {
  0%, 100% {
    outline-color: #fbbf24;
    box-shadow:
      0 0 0 1px rgba(251, 191, 36, 0.3),
      0 0 12px rgba(251, 191, 36, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    outline-color: #f59e0b;
    box-shadow:
      0 0 0 2px rgba(245, 158, 11, 0.4),
      0 0 20px rgba(251, 191, 36, 0.5),
      0 2px 12px rgba(0, 0, 0, 0.15);
  }
}

@keyframes selection-pulse-error {
  0%, 100% {
    outline-color: #ef4444;
    box-shadow:
      0 0 0 1px rgba(239, 68, 68, 0.3),
      0 0 12px rgba(239, 68, 68, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    outline-color: #dc2626;
    box-shadow:
      0 0 0 2px rgba(220, 38, 38, 0.4),
      0 0 20px rgba(239, 68, 68, 0.5),
      0 2px 12px rgba(0, 0, 0, 0.15);
  }
}

@keyframes selection-pulse-deleted {
  0%, 100% {
    outline-color: #9ca3af;
    box-shadow:
      0 0 0 1px rgba(156, 163, 175, 0.3),
      0 0 12px rgba(156, 163, 175, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.1);
  }
  50% {
    outline-color: #6b7280;
    box-shadow:
      0 0 0 2px rgba(107, 114, 128, 0.4),
      0 0 20px rgba(156, 163, 175, 0.5),
      0 2px 12px rgba(0, 0, 0, 0.15);
  }
}

.segment:hover:not(.segment-selected) {
  opacity: 0.85;
  transform: scale(1.01);
}

/* === 減少動畫偏好設定 === */
@media (prefers-reduced-motion: reduce) {
  .segment-selected,
  .segment-selected-error,
  .segment-selected-deleted {
    animation: none;
  }
}

.arrow-indicator {
  position: absolute;
  top: -14px;
  font-size: 10px;
  color: #f59e0b;
  animation: bounce 0.5s infinite alternate;
}

.arrow-left {
  left: 0;
}

.arrow-right {
  right: 0;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-2px);
  }
}

/* === 預覽高亮樣式 === */
.preview-char-movable,
.preview-char-target {
  display: inline;
  padding: 1px 2px;
  margin: 0 1px;
  border-radius: 2px;
  font-weight: 600;
  animation: pulse-preview 0.8s ease-in-out infinite;
}

/* 當前區塊可移動字元（橘色） */
.preview-char-movable {
  background-color: rgba(251, 146, 60, 0.4);
  color: #c2410c;
  border: 1px dashed #f97316;
}

/* 相鄰區塊目標字元（藍色） */
.preview-char-target {
  background-color: rgba(147, 197, 253, 0.5);
  color: #1d4ed8;
  border: 1px dashed #3b82f6;
}

/* 相鄰區塊預覽狀態 */
.segment-adjacent-preview {
  opacity: 0.95;
  outline: 2px dashed #93c5fd !important;
  outline-offset: 1px;
}

@keyframes pulse-preview {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .preview-char-movable,
  .preview-char-target {
    animation: none;
  }
}

/* === 搜尋高亮樣式 === */
.search-highlight {
  background-color: rgba(250, 204, 21, 0.5);
  border-radius: 2px;
  padding: 0 1px;
}

.search-highlight-current {
  background-color: rgba(251, 146, 60, 0.7);
  outline: 2px solid #f97316;
  outline-offset: 0;
}
</style>
