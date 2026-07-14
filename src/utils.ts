/**
 * 数字保留 1 位小数；如果是整数则直接返回整数。
 */
export const toFixed = (num: number): number | string => {
  if (Number.isInteger(num)) return num
  return num.toFixed(1)
}
