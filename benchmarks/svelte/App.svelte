<script>
    import { buildData } from '../shared/data-generator';

    let data = [];
    let selected = null;

    function run() {
        data = buildData(1000);
        selected = null;
    }

    function runLots() {
        data = buildData(10000);
        selected = null;
    }

    function add() {
        data = [...data, ...buildData(1000)];
    }

    function update() {
        for (let i = 0; i < data.length; i += 10) {
            data[i].label += ' !!!';
        }
        data = data;
    }

    function clear() {
        data = [];
        selected = null;
    }

    function swapRows() {
        if (data.length > 998) {
            const temp = data[1];
            data[1] = data[998];
            data[998] = temp;
            data = data;
        }
    }

    function select(id) {
        selected = id;
    }

    function remove(id) {
        data = data.filter(d => d.id !== id);
    }
</script>

<div class="container">
    <div class="jumbotron">
        <div class="row">
            <div class="col-md-6"><h1>Svelte</h1></div>
            <div class="col-md-6">
                <div class="row">
                    <button id="run" class="btn btn-primary" on:click={run}>Create 1,000 rows</button>
                    <button id="runlots" class="btn btn-primary" on:click={runLots}>Create 10,000 rows</button>
                    <button id="add" class="btn btn-primary" on:click={add}>Append 1,000 rows</button>
                    <button id="update" class="btn btn-primary" on:click={update}>Update every 10th row</button>
                    <button id="clear" class="btn btn-primary" on:click={clear}>Clear</button>
                    <button id="swaprows" class="btn btn-primary" on:click={swapRows}>Swap Rows</button>
                </div>
            </div>
        </div>
    </div>
    <table class="table table-hover table-striped test-data">
        <tbody>
            {#each data as d (d.id)}
                <tr class={selected === d.id ? 'selected' : ''}>
                    <td class="col-md-1">{d.id}</td>
                    <td class="col-md-4">
                        <a on:click={() => select(d.id)}>{d.label}</a>
                    </td>
                    <td class="col-md-1">
                        <a on:click={() => remove(d.id)}>
                            <span class="glyphicon glyphicon-remove danger" aria-hidden="true">x</span>
                        </a>
                    </td>
                    <td class="col-md-6"></td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
