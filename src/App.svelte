<script>
    import DateCalculator from "./DateCalculator.svelte";
    import DateReminder from "./DateReminder.svelte";
    import ChartComponent from './ChartComponent.svelte';
    import Map from "./Map.svelte";
</script>

<main >
    <Map/>
    <div class="wrap">
        <DateCalculator/>
        <DateReminder/>
    </div>
    <div class="chart">
        <ChartComponent/>
    </div>
</main>

<style>
    :global(*) {
        box-sizing: border-box;
    }

    :global(body) {
        background-color: rgb(231, 231, 231);
    }

    .wrap {
        display: flex;
        justify-content: space-around;
        margin: 0 auto;
    }
</style>
