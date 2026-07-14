// lunar-javascript 没有官方类型，这里给出最小可用声明
declare module 'lunar-javascript' {
  export class Lunar {
    constructor()
    static fromYmd(year: number, month: number, day: number): Lunar
    getSolar(): Solar
    toString(): string
  }
  export class Solar {
    constructor()
    static fromDate(date: Date): Solar
    static fromYmd(year: number, month: number, day: number): Solar
    getLunar(): Lunar
    toString(): string
    getXingZuo(): string
  }
}
