import { useState } from 'react'
import dayjs from 'dayjs'
import { toFixed } from '../../utils'
import styles from './DateCalculator.module.css'

type Unit = 'hours' | 'day' | 'week' | 'month' | 'year'
type Status = 'add' | 'subtract'

interface DateParts {
  year: number
  month: number
  day: number
  hour: number
}

const today = dayjs()
const makeDate = (d: dayjs.Dayjs): DateParts => ({
  year: d.year(),
  month: d.month() + 1,
  day: d.date(),
  hour: 0,
})

const options: { value: Status; label: string; selected?: boolean }[] = [
  { value: 'subtract', label: '往前' },
  { value: 'add', label: '往后', selected: true },
]

const unitOptions: { value: Unit; label: string }[] = [
  { value: 'hours', label: '小时' },
  { value: 'day', label: '天' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
]

const toNum = (v: string) => Number(v) || 0

export default function DateCalculator() {
  // 两个日期差值
  const [preDate, setPreDate] = useState<DateParts>(makeDate(today))
  const [lastDate, setLastDate] = useState<DateParts>(makeDate(today))
  const [diffResult, setDiffResult] = useState<string | null>(null)

  // N 单位后的日期
  const [calculation, setCalculation] = useState<DateParts>(makeDate(today))
  const [calculationResult, setCalculationResult] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('add')
  const [unit, setUnit] = useState<Unit>('day')
  const [unitLabel, setUnitLabel] = useState('天')
  const [num, setNum] = useState(3)

  const handleDiff = () => {
    const date = dayjs(
      `${lastDate.year}-${lastDate.month}-${lastDate.day}`,
    )
    const day = toFixed(
      date.diff(
        `${preDate.year}-${preDate.month}-${preDate.day}`,
        'day',
        true,
      ),
    ) as number
    const week = toFixed(
      date.diff(
        `${preDate.year}-${preDate.month}-${preDate.day}`,
        'week',
        true,
      ),
    ) as number
    const month = toFixed(
      date.diff(
        `${preDate.year}-${preDate.month}-${preDate.day}`,
        'month',
        true,
      ),
    ) as number
    const year = toFixed(
      date.diff(
        `${preDate.year}-${preDate.month}-${preDate.day}`,
        'year',
        true,
      ),
    ) as number

    setDiffResult(
      `${year}年 = ${month}月 = ${week}周 = ${day}天 = ${day * 24}小时`,
    )
  }

  const handleCalculation = () => {
    const date = dayjs(
      `${calculation.year}-${calculation.month}-${calculation.day} ${calculation.hour}`,
    )
    const result =
      status === 'add' ? date.add(num, unit) : date.subtract(num, unit)
    setCalculationResult(result.format('YYYY-MM-DD HH:mm:ss'))
  }

  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as Status)
  }

  const handleChangeUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value as Unit
    setUnit(v)
    const found = unitOptions.find((o) => o.value === v)
    if (found) setUnitLabel(found.label)
  }

  return (
    <main className={styles.root}>
      <h3>日期计算器</h3>
      <div className={styles.section}>
        <h4>计算两个日期之间相差多少天</h4>
        <p>
          <input
            min={0}
            type="number"
            className={styles.input}
            value={preDate.year}
            onChange={(e) =>
              setPreDate({ ...preDate, year: toNum(e.target.value) })
            }
          />{' '}
          年
          <input
            min={0}
            max={12}
            type="number"
            className={styles.input}
            value={preDate.month}
            onChange={(e) =>
              setPreDate({ ...preDate, month: toNum(e.target.value) })
            }
          />{' '}
          月
          <input
            min={0}
            max={31}
            type="number"
            className={styles.input}
            value={preDate.day}
            onChange={(e) =>
              setPreDate({ ...preDate, day: toNum(e.target.value) })
            }
          />{' '}
          日
        </p>
        <p>
          <input
            min={0}
            type="number"
            className={styles.input}
            value={lastDate.year}
            onChange={(e) =>
              setLastDate({ ...lastDate, year: toNum(e.target.value) })
            }
          />{' '}
          年
          <input
            min={0}
            max={12}
            type="number"
            className={styles.input}
            value={lastDate.month}
            onChange={(e) =>
              setLastDate({ ...lastDate, month: toNum(e.target.value) })
            }
          />{' '}
          月
          <input
            min={0}
            max={31}
            type="number"
            className={styles.input}
            value={lastDate.day}
            onChange={(e) =>
              setLastDate({ ...lastDate, day: toNum(e.target.value) })
            }
          />{' '}
          日
        </p>
        <p>
          <button onClick={handleDiff} className={styles.button}>
            相差
          </button>
          {diffResult && <p>{diffResult}</p>}
        </p>
      </div>

      <div className={styles.section}>
        <h4>推算几{unitLabel}后的日期</h4>
        <p>
          <input
            min={0}
            type="number"
            className={styles.input}
            value={calculation.year}
            onChange={(e) =>
              setCalculation({ ...calculation, year: toNum(e.target.value) })
            }
          />{' '}
          年
          <input
            min={0}
            max={12}
            type="number"
            className={styles.input}
            value={calculation.month}
            onChange={(e) =>
              setCalculation({ ...calculation, month: toNum(e.target.value) })
            }
          />{' '}
          月
          <input
            min={0}
            max={31}
            type="number"
            className={styles.input}
            value={calculation.day}
            onChange={(e) =>
              setCalculation({ ...calculation, day: toNum(e.target.value) })
            }
          />{' '}
          日
          <input
            min={0}
            max={24}
            type="number"
            className={styles.input}
            value={calculation.hour}
            onChange={(e) =>
              setCalculation({ ...calculation, hour: toNum(e.target.value) })
            }
          />{' '}
          时
        </p>
        <p>
          <select
            className={styles.select}
            value={status}
            onChange={handleChangeStatus}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            min={0}
            type="number"
            className={styles.input}
            value={num}
            onChange={(e) => setNum(toNum(e.target.value))}
          />
          <select
            className={styles.select}
            value={unit}
            onChange={handleChangeUnit}
          >
            {unitOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </p>
        <p>
          <button onClick={handleCalculation} className={styles.button}>
            推算
          </button>
          {calculationResult && <span>{calculationResult}</span>}
        </p>
      </div>
    </main>
  )
}
