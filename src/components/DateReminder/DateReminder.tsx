import { useEffect, useState } from 'react'
import { Lunar, Solar } from 'lunar-javascript'
import dayjs from 'dayjs'
import { toFixed } from '../../utils'
import styles from './DateReminder.module.css'

interface RawReminder {
  month: number
  day: number
  label: string
}

interface Reminder extends RawReminder {
  solar: string | null
  lunar: Lunar | null
  expire: boolean
  diffDay: number | string
}

interface TargetDate {
  year: number
  month: number
  day: number
  solar: string | null
  lunar: Lunar | string | null
  constellation: string | null
}

const rawReminders: RawReminder[] = [
  { month: 1, day: 1, label: 'z' },
  { month: 3, day: 12, label: 'z' },
  { month: 8, day: 24, label: 'z' },
  { month: 10, day: 8, label: 'z' },
  { month: 10, day: 16, label: 'z' },
]

export default function DateReminder() {
  const [reminderDate, setReminderDate] = useState<Reminder[]>(
    rawReminders.map((r) => ({
      ...r,
      solar: null,
      lunar: null,
      expire: false,
      diffDay: 0,
    })),
  )

  const [targetDate, setTargetDate] = useState<TargetDate>(() => {
    const now = new Date()
    return {
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      solar: null,
      lunar: null,
      constellation: null,
    }
  })
  const [toSolar, setToSolar] = useState(true)

  useEffect(() => {
    const now = Date.now()
    const today = dayjs()
    const year = new Date().getFullYear()
    setReminderDate((prev) =>
      prev.map((r) => {
        const lunar = Lunar.fromYmd(year, r.month, r.day)
        const solar = lunar.getSolar()
        const solarMs = new Date(solar.toString()).getTime()
        return {
          ...r,
          lunar,
          solar: solar.toString(),
          expire: now > solarMs,
          diffDay: toFixed(dayjs(solar.toString()).diff(today, 'day', true)),
        }
      }),
    )
  }, [])

  const handleLunarToSolar = () => {
    setToSolar(true)
    const lunar = Lunar.fromYmd(targetDate.year, targetDate.month, targetDate.day)
    const solar = lunar.getSolar()
    setTargetDate((prev) => ({
      ...prev,
      lunar,
      solar: solar.toString(),
      constellation: solar.getXingZuo(),
    }))
  }

  const handleSolarToLunar = () => {
    setToSolar(false)
    const solar = Solar.fromDate(
      new Date(`${targetDate.year}-${targetDate.month}-${targetDate.day}`),
    )
    setTargetDate((prev) => ({
      ...prev,
      lunar: solar.getLunar().toString(),
      solar: solar.toString(),
      constellation: solar.getXingZuo(),
    }))
  }

  return (
    <main className={styles.root}>
      <h3>日期</h3>
      <div>
        <ul className={styles.list}>
          {reminderDate.map((reminder) => {
            const content = (
              <>
                农历 {String(reminder.lunar ?? '')} -&gt; 阳历{' '}
                {String(reminder.solar ?? '')}{' '}
                {!reminder.expire && (
                  <span> 还有 {reminder.diffDay ?? 0} 天</span>
                )}
              </>
            )
            return (
              <li key={`${reminder.month}-${reminder.day}`}>
                {reminder.expire ? <del>{content}</del> : <p>{content}</p>}
              </li>
            )
          })}
        </ul>
      </div>
      <h3>农历 ⇄ 阳历</h3>
      <div className={styles.selectDate}>
        <p>
          <input
            className={styles.input}
            type="number"
            value={targetDate.year}
            onChange={(e) =>
              setTargetDate({
                ...targetDate,
                year: Number(e.target.value) || 0,
              })
            }
          />{' '}
          年
          <input
            className={styles.input}
            type="number"
            value={targetDate.month}
            onChange={(e) =>
              setTargetDate({
                ...targetDate,
                month: Number(e.target.value) || 0,
              })
            }
          />{' '}
          月
          <input
            className={styles.input}
            type="number"
            value={targetDate.day}
            onChange={(e) =>
              setTargetDate({
                ...targetDate,
                day: Number(e.target.value) || 0,
              })
            }
          />{' '}
          日
        </p>
        <p>
          <button onClick={handleLunarToSolar} className={styles.button}>
            转阳历
          </button>
          <button onClick={handleSolarToLunar} className={styles.button}>
            转农历
          </button>
        </p>
        {toSolar ? (
          <p>
            农历 {String(targetDate.lunar ?? '')} -&gt; 阳历{' '}
            {`${targetDate.solar ?? ''} ${targetDate.constellation ?? ''}`}
          </p>
        ) : (
          <p>
            阳历 {`${targetDate.solar ?? ''} ${targetDate.constellation ?? ''}`}{' '}
            -&gt; 农历 {String(targetDate.lunar ?? '')}
          </p>
        )}
      </div>
    </main>
  )
}
