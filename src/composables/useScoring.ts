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

export function getTotalStats(lines: TextLine[]): TotalStatsData {
  let totalCount = 0
  let errorCount = 0

  for (const line of lines) {
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
