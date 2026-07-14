import { useMemo } from 'react'
import styles from './Map.module.css'

const isLeapYear = (year: number) =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

const computeProgress = (now: Date): number => {
  const year = now.getFullYear()
  const daysInYear = isLeapYear(year) ? 366 : 365
  const startOfYear = new Date(year, 0, 0)
  const diff = now.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  return (dayOfYear / daysInYear) * 100
}

export default function Map() {
  // 计算一次（组件挂载时），避免每次 render 都跑 new Date()
  const progressPercentage = useMemo(() => computeProgress(new Date()), [])

  return (
    <main className={styles.container}>
      <div
        className={styles.progressBar}
        title={`${Math.round(progressPercentage)}%`}
      >
        <div
          className={styles.progress}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </main>
  )
}
