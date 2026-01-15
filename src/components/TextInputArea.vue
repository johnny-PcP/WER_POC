<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')

const emit = defineEmits<{
  startMarking: [text: string]
  clear: []
}>()

function handleStart() {
  if (inputText.value.trim()) {
    emit('startMarking', inputText.value)
  }
}

function handleClear() {
  inputText.value = ''
  emit('clear')
}
</script>

<template>
  <div class="text-input-area space-y-4">
    <textarea
      v-model="inputText"
      class="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      placeholder="請在此貼上或輸入要標記的文字（支援多行）..."
    ></textarea>
    <div class="flex gap-3">
      <button
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!inputText.trim()"
        @click="handleStart"
      >
        開始標記
      </button>
      <button
        v-if="inputText.trim()"
        class="px-6 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
        @click="handleClear"
      >
        清除
      </button>
    </div>
  </div>
</template>
