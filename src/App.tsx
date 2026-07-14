import Map from './components/Map/Map'
import DateCalculator from './components/DateCalculator/DateCalculator'
import DateReminder from './components/DateReminder/DateReminder'
import ChartComponent from './components/ChartComponent/ChartComponent'
import styles from './App.module.css'

export default function App() {
  return (
    <main>
      <Map />
      <div className={styles.wrap}>
        <DateCalculator />
        <DateReminder />
      </div>
      <div className={styles.chart}>
        <ChartComponent />
      </div>
    </main>
  )
}
