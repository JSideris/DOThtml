<script>
    import { generateStylingData } from '../../shared/styling-utils';

    let items = generateStylingData(1000);

    function updateStyles() {
        items = generateStylingData(1000);
    }
</script>

<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6"><h1>Svelte Styling</h1></div>
            <div class="col-md-6">
                <div class="row">
                    <button id="update-styles" class="btn btn-primary" on:click={updateStyles}>Update Styles</button>
                </div>
            </div>
        </div>
    </div>
    <div class="grid">
        {#each items as item, i (i)}
            <div class="box" 
                 style="background-color: {item.color}; transform: scale({item.scale}) rotate({item.rotation}deg)">
            </div>
        {/each}
    </div>
</div>
