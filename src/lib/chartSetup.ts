// 集中注册 chart.js 组件（执行一次即可）。
// 在需要 chart.js 的模块顶部 `import './chartSetup'` 触发副作用。
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)
