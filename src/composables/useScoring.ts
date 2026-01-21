import type { TextLine, LineStats, TotalStatsData } from '@/types'

export function getLineStats(line: TextLine): LineStats {
  // 只計算未被刪除的區塊
  const activeSegments = line.segments.filter((seg) => !seg.isDeleted)
  const totalCount = activeSegments.length
  const errorCount = activeSegments.filter((seg) => seg.isError).length

  return {
    totalCount,
    errorCount,
  }
}

export function getTotalStats(
  lines: TextLine[],
  startLine?: number | null,
  endLine?: number | null
): TotalStatsData {
  // 過濾範圍：startLine 和 endLine 是 1-based 索引
  let filteredLines = lines
  if (startLine !== undefined && startLine !== null && startLine > 0) {
    const start = startLine - 1 // 轉為 0-based
    const end = endLine !== undefined && endLine !== null && endLine > 0 ? endLine : lines.length
    filteredLines = lines.slice(start, end)
  }

  let totalCount = 0
  let errorCount = 0

  for (const line of filteredLines) {
    const stats = getLineStats(line)
    totalCount += stats.totalCount
    errorCount += stats.errorCount
  }

  const correctRate = totalCount > 0 ? ((totalCount - errorCount) / totalCount) * 100 : 100
  const errorRate = totalCount > 0 ? (errorCount / totalCount) * 100 : 0

  return {
    totalCount,
    errorCount,
    correctRate,
    errorRate,
  }
}

export function useScoring() {
  return {
    getLineStats,
    getTotalStats,
  }
}
