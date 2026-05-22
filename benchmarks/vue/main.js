import { createApp, ref, shallowRef } from 'vue';
import { buildData } from '../shared/data-generator';

const BenchmarkApp = {
    setup() {
        const data = shallowRef([]);
        const selected = ref(null);

        const run = () => {
            data.value = buildData(1000);
            selected.value = null;
        };

        const runLots = () => {
            data.value = buildData(10000);
            selected.value = null;
        };

        const add = () => {
            data.value = [...data.value, ...buildData(1000)];
        };

        const update = () => {
            const newData = [...data.value];
            for (let i = 0; i < newData.length; i += 10) {
                newData[i] = { ...newData[i], label: newData[i].label + ' !!!' };
            }
            data.value = newData;
        };

        const clear = () => {
            data.value = [];
            selected.value = null;
        };

        const swapRows = () => {
            if (data.value.length > 998) {
                const newData = [...data.value];
                const temp = newData[1];
                newData[1] = newData[998];
                newData[998] = temp;
                data.value = newData;
            }
        };

        const select = (id) => {
            selected.value = id;
        };

        const remove = (id) => {
            data.value = data.value.filter(d => d.id !== id);
        };

        return { data, selected, run, runLots, add, update, clear, swapRows, select, remove };
    },
    template: `
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6"><h1>Vue</h1></div>
                    <div class="col-md-6">
                        <div class="row">
                            <button id="run" class="btn btn-primary" @click="run">Create 1,000 rows</button>
                            <button id="runlots" class="btn btn-primary" @click="runLots">Create 10,000 rows</button>
                            <button id="add" class="btn btn-primary" @click="add">Append 1,000 rows</button>
                            <button id="update" class="btn btn-primary" @click="update">Update every 10th row</button>
                            <button id="clear" class="btn btn-primary" @click="clear">Clear</button>
                            <button id="swaprows" class="btn btn-primary" @click="swapRows">Swap Rows</button>
                        </div>
                    </div>
                </div>
            </div>
            <table class="table table-hover table-striped test-data">
                <tbody>
                    <tr v-for="d in data" :key="d.id" :class="{ selected: selected === d.id }">
                        <td class="col-md-1">{{ d.id }}</td>
                        <td class="col-md-4">
                            <a @click="select(d.id)">{{ d.label }}</a>
                        </td>
                        <td class="col-md-1">
                            <a @click="remove(d.id)">
                                <span class="glyphicon glyphicon-remove danger" aria-hidden="true">x</span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};

createApp(BenchmarkApp).mount('#app');
performance.mark('framework-ready');
