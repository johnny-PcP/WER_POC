import type { TextLine, Segment } from '@/types'

let segmentIdCounter = 0
let lineIdCounter = 0

function generateSegmentId(): string {
  return `seg-${++segmentIdCounter}`
}

function generateLineId(): string {
  return `line-${++lineIdCounter}`
}

export function resetIdCounters(): void {
  segmentIdCounter = 0
  lineIdCounter = 0
}

// 檢查是否為標點符號
function isPunctuation(text: string): boolean {
  // 中文標點符號
  const chinesePunctuation = /^[，。、；：？！「」『』（）【】《》〈〉""''…—～·]+$/
  // 英文標點符號
  const englishPunctuation = /^[.,;:?!'"()\[\]{}<>@#$%^&*\-_+=|\\\/`~]+$/

  return chinesePunctuation.test(text) || englishPunctuation.test(text)
}

function tokenizeLine(text: string): Segment[] {
  const segments: Segment[] = []

  // 使用 Intl.Segmenter 進行中文分詞
  const segmenter = new Intl.Segmenter('zh-TW', { granularity: 'word' })
  const segmentIterator = segmenter.segment(text)

  for (const { segment, index } of segmentIterator) {
    // 跳過純空白字元
    if (/^\s+$/.test(segment)) {
      continue
    }

    // 標點符號自動設為已刪除（不計入統計）
    const isDeleted = isPunctuation(segment)

    segments.push({
      id: generateSegmentId(),
      text: segment,
      isError: false,
      isDeleted,
      startIndex: index,
      endIndex: index + segment.length,
    })
  }

  return segments
}

export function parseText(text: string): TextLine[] {
  resetIdCounters()

  const lines = text.split('\n')
  const textLines: TextLine[] = []

  for (const line of lines) {
    // 跳過空行
    if (line.trim() === '') {
      continue
    }

    textLines.push({
      id: generateLineId(),
      originalText: line,
      segments: tokenizeLine(line),
    })
  }

  return textLines
}

// 重新解析單行文字（保留原有的 line id）
export function reParseLine(text: string, existingLineId?: string): TextLine {
  return {
    id: existingLineId || generateLineId(),
    originalText: text,
    segments: tokenizeLine(text),
  }
}

export function useTextParser() {
  return {
    parseText,
    reParseLine,
    resetIdCounters,
  }
}
