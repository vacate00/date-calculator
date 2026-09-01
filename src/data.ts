export const XHS = 'xhs' as const
export const DOUYIN = 'douyin' as const

export type Platform = typeof XHS | typeof DOUYIN

export interface StatPoint {
  x: string
  y: number
}

export interface PlatformStats {
  name: string
  followers: StatPoint[]
  likes_collections: StatPoint[]
  color_f: string
  color_lc: string
  color_pc?: string
}

export const initialData: Record<Platform, PlatformStats> = {
  [XHS]: {
    name: '小红书',
    followers: [
      { x: '2026-08-09', y: 4 },
      { x: '2026-09-01', y: 7 },
    ],
    likes_collections: [
      { x: '2026-08-09', y: 47 },
      { x: '2026-09-01', y: 73 },
    ],
    color_f: 'rgb(255, 69, 0)',   // 粉丝颜色（小红书红）
    color_lc: 'rgb(255, 140, 0)', // 获赞颜色（深橙色）
  },
  [DOUYIN]: {
    name: '抖音',
    followers: [
      { x: '2026-07-14', y: 7 },
      { x: '2026-07-29', y: 7 },
      { x: '2026-08-09', y: 10 },
      { x: '2026-09-01', y: 11 },
    ],
    likes_collections: [
      { x: '2026-07-14', y: 667 },
      { x: '2026-07-29', y: 940 },
      { x: '2026-08-09', y: 1132 },
      { x: '2026-09-01', y: 1372 },
    ],
    color_f: 'rgb(0, 174, 236)',  // 粉丝颜色（B站蓝）
    color_lc: 'rgb(0, 139, 139)',  // 获赞颜色（青色）
  },
}
