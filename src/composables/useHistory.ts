import { ref } from 'vue'
import type { TextLine } from '@/types'

export interface HistoryState {
  lines: TextLine[]
  selectedLineId: string | null
  selectedSegmentId: string | null
}

const MAX_HISTORY_SIZE = 50

export function useHistory() {
  const history = ref<HistoryState[]>([])

  // 深拷貝 lines 陣列
  function cloneLines(lines: TextLine[]): TextLine[] {
    return JSON.parse(JSON.stringify(lines))
  }

  // 儲存當前狀態到歷史記錄
  function saveState(
    lines: TextLine[],
    selectedLineId: string | null,
    selectedSegmentId: string | null,
  ): void {
    const state: HistoryState = {
      lines: cloneLines(lines),
      selectedLineId,
      selectedSegmentId,
    }

    history.value.push(state)

    // 限制歷史記錄數量
    if (history.value.length > MAX_HISTORY_SIZE) {
      history.value.shift()
    }
  }

  // 復原到上一個狀態
  function undo(): HistoryState | null {
    if (history.value.length === 0) {
      return null
    }

    return history.value.pop() || null
  }

  // 檢查是否可以復原
  function canUndo(): boolean {
    return history.value.length > 0
  }

  // 清除歷史記錄
  function clearHistory(): void {
    history.value = []
  }

  return {
    saveState,
    undo,
    canUndo,
    clearHistory,
  }
}
