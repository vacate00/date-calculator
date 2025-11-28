<script>
    // --- 导入与注册 ---
    import {Line} from 'svelte-chartjs';
    import {Chart, registerables} from 'chart.js';
    // 保持 date-fns 导入，因为它仍然用于数据格式化和解析
    import 'chartjs-adapter-date-fns';
    import {initialData} from './data.js';

    Chart.register(...registerables);

    let currentPlatform = 'xiaohongshu';
    let chartData;

    $: currentStats = initialData[currentPlatform];

    // *** 更改点 1: 提取所有有数据的日期作为标签 ***
    // X 轴标签将使用当前粉丝数数据集中的日期
    $: allDates = currentStats.followers.map(d => d.x);

    // --- 响应式数据生成 ---
    $: datasets = [
        // 1. 粉丝数
        {
            label: '粉丝数',
            // *** 更改点 2: 仅传递 Y 轴数值，对应于 allDates 标签 ***
            data: currentStats.followers.map(d => d.y),
            borderColor: currentStats.color_f,
            backgroundColor: currentStats.color_f.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            tension: 0.3,
            fill: false,
        },
        // 2. 获赞与收藏
        {
            label: '获赞与收藏',
            data: currentStats.likes_collections.map(d => d.y),
            borderColor: currentStats.color_lc,
            backgroundColor: currentStats.color_lc.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            tension: 0.3,
            fill: false,
        },
        // 3. 播放量 (仅 B 站显示)
        ...(currentPlatform === 'bilibili' ? [{
            label: '播放量',
            data: currentStats.play_count.map(d => d.y),
            borderColor: currentStats.color_pc,
            backgroundColor: currentStats.color_pc.replace('rgb', 'rgba').replace(')', ', 0.2)'),
            tension: 0.3,
            fill: false,
        }] : []),
    ];

    // 构造最终的 Chart.js 数据对象
    $: chartData = {
        labels: allDates, // 使用提取出的日期作为 X 轴刻度
        datasets
    };


    // --- 图表选项配置 ---
    $: chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                // *** 更改点 3: 将类型改为 'category' ***
                type: 'category',
                title: {
                    display: true,
                    text: '日期'
                },
                // 移除 time 相关的配置
            },
            y: {
                beginAtZero: true,
                // title: {
                //     display: true,
                //     text: '数量 (人/次)'
                // },
                // Y 轴标签保持显示完整数值
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();
                    }
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `${currentStats.name} - 关键数据趋势`,
                font: {size: 18}
            },
            tooltip: {
                callbacks: {
                    // 由于我们使用的是 category scale，tooltip title 现在直接显示 label
                    title: (context) => context[0].label,
                    // 工具提示标签显示完整数值
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toLocaleString();
                        }
                        return label;
                    }
                }
            }
        }
    };
</script>

<div class="chart-container">
    <div class="platform-switcher">
        <button
                class:active={currentPlatform === 'xiaohongshu'}
                on:click={() => currentPlatform = 'xiaohongshu'}
        >
            小红书数据
        </button>
<!--        <button-->
<!--                class:active={currentPlatform === 'bilibili'}-->
<!--                on:click={() => currentPlatform = 'bilibili'}-->
<!--        >-->
<!--            B站数据 (含播放量)-->
<!--        </button>-->
    </div>

    {#key currentPlatform}
        <div style="height: 400px; width: 800px;">
            <Line
                    data={chartData}
                    options={chartOptions}
            />
        </div>
    {/key}
</div>

<style>
    .chart-container {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        max-width: 850px;
        margin: 0 auto;
    }

    .platform-switcher {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
    }

    .platform-switcher button {
        padding: 10px 15px;
        font-size: 16px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #f8f8f8;
        transition: background-color 0.3s;
    }

    .platform-switcher button.active {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
        font-weight: bold;
    }
</style>