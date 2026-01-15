export interface Segment {
  id: string
  text: string
  isError: boolean
  isDeleted: boolean // 標記為不計入統計（無底線）
  startIndex: number
  endIndex: number
}

export interface TextLine {
  id: string
  originalText: string
  segments: Segment[]
}

export interface LineStats {
  totalCount: number
  errorCount: number
}

export interface TotalStatsData {
  totalCount: number
  errorCount: number
  correctRate: number
  errorRate: number
}

export interface Selection {
  lineId: string | null
  segmentId: string | null
}

export interface StoredState {
  lines: TextLine[]
  inputText: string
}
