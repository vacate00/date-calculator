<script>
    import { onMount } from 'svelte';
    import { Lunar, Solar } from 'lunar-javascript';

    import { toFixed } from "./utils.js";
    import dayjs from "dayjs";

    const date = new Date();
    let toSolar = true;
    let reminderDate = [
        {
            month: 1,
            day: 1,
            label: 'z'
        },
        {
            month: 3,
            day: 12,
            label: 'z'
        },
        {
            month: 8,
            day: 24,
            label: 'z'
        },
        {
            month: 10,
            day: 8,
            label: 'z'
        },
        {
            month: 10,
            day: 16,
            label: 'z'
        }
    ];

    const targetDate = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        solar: null,
        lunar: null,
        constellation: null
    }

    const handleLunarToSolar = () => {
        toSolar = true;

        const lunar = Lunar.fromYmd(targetDate.year, targetDate.month, targetDate.day);
        const solar = lunar.getSolar();

        targetDate.lunar = lunar;
        targetDate.solar = solar.toString();
        targetDate.constellation = solar.getXingZuo();
    }

    const handleSolarToLunar = () => {
        toSolar = false;
        const solar = Solar.fromDate(new Date(`${targetDate.year}-${targetDate.month}-${targetDate.day}`));

        targetDate.lunar = solar.getLunar().toString();
        targetDate.solar = solar.toString();
        targetDate.constellation = solar.getXingZuo();
    }

    onMount(() => {
        const now = date.getTime();
        const dayJsDate = dayjs();

        reminderDate = reminderDate.map(current => {
            const { month, day } = current;
            const year = date.getFullYear();
            const lunar = Lunar.fromYmd(year, month, day);
            const solar = lunar.getSolar();

            current.solar = solar.toString();
            current.lunar = lunar;
            current.expire = now > new Date(current.solar).getTime();

            current.diffDay = toFixed(dayjs(current.solar).diff(dayJsDate, 'day', true))
            return current
        })
    })
</script>

<main>
    <h3>日期</h3>
    <div>
        {#each reminderDate as reminder}
            {#if (reminder.expire)}
                <p><del>农历 {reminder.lunar ?? ''} -> 阳历 {reminder.solar ?? ''}</del></p>
                {:else}
                <p>农历 {reminder.lunar ?? ''} -> 阳历 {reminder.solar ?? ''} |  <span> 还有 {reminder?.diffDay ?? 0} 天</span></p>

            {/if}
        {/each}
    </div>
    <h3>农历 ⇄ 阳历</h3>
    <div class="select-date">
        <p>
            <input bind:value={targetDate.year} type="number"> 年
            <input bind:value={targetDate.month} type="number"> 月
            <input bind:value={targetDate.day} type="number"> 日
        </p>
        <p>
            <button on:click={handleLunarToSolar}>转阳历</button>
            <button on:click={handleSolarToLunar}>转农历</button>
        </p>

        {#if (toSolar)}
            <p>农历 {targetDate.lunar ?? ''} -> 阳历 {`${targetDate.solar ?? ''} ${targetDate.constellation ?? ''}`}</p>
            {:else}
            <p>阳历 {`${targetDate.solar ?? ''} ${targetDate.constellation ?? ''}`} ->  农历 {targetDate.lunar ?? ''}</p>
        {/if}
    </div>
</main>

<style>
    main {
        width: 40%;
    }

    .select-date input {
        width: 60px;
        height: 30px;
        font-size: 16px;
    }

    button {
        min-width: 60px;
        height: 30px;
        cursor: pointer;
    }
</style>
