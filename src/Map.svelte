<script>
    import dayjs from "dayjs";

    // const maps = ["世界尽头", "电力区", "奥林匹斯","诸王峡谷","风暴点", "残月"];

    const config = {
        anchorDate: dayjs('2025-11-07'),
        offset: 0
    }

    const getSeasonEndTime = () => {
        return dayjs('2025-12-15').diff(new Date(), 'days');
    }

    const maps = ["残月", "世界尽头", "奥林匹斯", ];

    function getMap() {
        const today = dayjs();
        const daysDiff = today.diff(config.anchorDate, 'day');
        const startIndex = (daysDiff + config.offset) % maps.length;

        const sevenDays = [];
        for (let i = 0; i < 7; i++) {
            const date = today.add(i, 'day').toDate();

            sevenDays.push({
                label: formatDayLabel(date, i),
                map: maps[(startIndex + i) % maps.length]
            });
        }

        return sevenDays;
    }

    function formatDayLabel(date, offset) {
        const daysOfWeek = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        if (offset === 0) return "今天";
        if (offset === 1) return "明天";
        if (offset === 2) return "后天";
        return daysOfWeek[date.getDay()];
    }

    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    function getProgress() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const daysInYear = isLeapYear(year) ? 366 : 365;
        const startOfYear = new Date(year, 0, 0);
        const diff = currentDate - startOfYear;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        return (dayOfYear / daysInYear) * 100;
    }

    const sevenDays = getMap();
    const progressPercentage = getProgress();
    const seasonEndTime = getSeasonEndTime();
</script>

<main>
    <div class="map-container">
        <div class="progress-bar">
            <div class="progress" title="{Math.round(progressPercentage)}%" style="width: {progressPercentage}%"></div>
        </div>
<!--        <span class="day-item">赛季结束 {seasonEndTime}天</span>-->
<!--        {#each sevenDays as day}-->
<!--            <span class="day-item">-->
<!--                {day.label}：<span class="map-name">{day.map}</span>-->
<!--            </span>-->
<!--        {/each}-->
    </div>
</main>

<style>
    .map-container {
        font-size: 20px;
        font-weight: bold;
        margin: 20px;
        padding: 12px 8px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 8px;
        text-align: center;
        position: relative;
        overflow: hidden;
    }

    .progress-bar {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .progress {
        height: 100%;
        background-color: rgba(121, 134, 203, 0.3);
        transition: width 0.5s ease;
    }

    .day-item {
        display: inline-block;
        margin: 0 6px;
        position: relative;
        z-index: 1;
    }

    .day-item:not(:last-child)::after {
        content: "|";
        margin-left: 10px;
        color: #666;
        opacity: 0.7;
    }

    .map-name {
        color: #2c3e50;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: rgba(255, 255, 255, 0.3);
    }
</style>
