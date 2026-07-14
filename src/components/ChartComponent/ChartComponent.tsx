import { useMemo, useState } from 'react'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import '../../lib/chartSetup'
import {
  DOUYIN,
  XHS,
  initialData,
  type Platform,
  type PlatformStats,
} from '../../data'
import styles from './ChartComponent.module.css'

const toRgba = (rgb: string) =>
  rgb.replace('rgb', 'rgba').replace(')', ', 0.2)')

export default function ChartComponent() {
  const [currentPlatform, setCurrentPlatform] = useState<Platform>(XHS)

  const currentStats: PlatformStats = useMemo(
    () => initialData[currentPlatform],
    [currentPlatform],
  )

  const allDates: string[] = useMemo(
    () => currentStats.followers.map((d) => d.x),
    [currentStats],
  )

  const chartData = useMemo(
    () => ({
      labels: allDates,
      datasets: [
        {
          label: '粉丝数',
          data: currentStats.followers.map((d) => d.y),
          borderColor: currentStats.color_f,
          backgroundColor: toRgba(currentStats.color_f),
          tension: 0.3,
          fill: false,
        },
        {
          label: '获赞与收藏',
          data: currentStats.likes_collections.map((d) => d.y),
          borderColor: currentStats.color_lc,
          backgroundColor: toRgba(currentStats.color_lc),
          tension: 0.3,
          fill: false,
        },
      ],
    }),
    [allDates, currentStats],
  )

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'category' as const,
          title: { display: true, text: '日期' },
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value: number | string) =>
              Number(value).toLocaleString(),
          },
        },
      },
      plugins: {
        legend: { display: true, position: 'top' as const },
        title: {
          display: true,
          text: `${currentStats.name}关键数据趋势`,
          font: { size: 18 },
        },
        tooltip: {
          callbacks: {
            title: (context: { label: string }[]) => context[0]?.label ?? '',
            label: (context: { dataset: { label?: string }; parsed: { y: number | null } }) => {
              const label = context.dataset.label ?? ''
              const y = context.parsed.y
              return `${label}: ${y === null ? '' : y.toLocaleString()}`
            },
          },
        },
      },
    }),
    [currentStats],
  )

  return (
    <div className={styles.container}>
      <div className={styles.switcher}>
        <button
          type="button"
          className={currentPlatform === XHS ? styles.active : ''}
          onClick={() => setCurrentPlatform(XHS)}
          disabled={currentPlatform === XHS}
        >
          小红书数据
        </button>
        <button
          type="button"
          className={currentPlatform === DOUYIN ? styles.active : ''}
          onClick={() => setCurrentPlatform(DOUYIN)}
          disabled={currentPlatform === DOUYIN}
        >
          抖音数据
        </button>
      </div>
      {/* key 强制切换平台时重建 canvas，避免动画残留 */}
      <div className={styles.chartBox} key={currentPlatform}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
