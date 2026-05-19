import { createApp, ref, shallowRef } from 'vue';
import { generateStylingData, FPSMeter } from '../../shared/styling-utils';

const BenchmarkApp = {
    setup() {
        const items = shallowRef(generateStylingData(1000));

        const updateStyles = () => {
            items.value = generateStylingData(1000);
        };

        return { items, updateStyles };
    },
    template: `
        <div class="container">
            <div class="jumbotron">
                <div class="row">
                    <div class="col-md-6"><h1>Vue Styling</h1></div>
                    <div class="col-md-6">
                        <div class="row">
                            <button id="update-styles" class="btn btn-primary" @click="updateStyles">Update Styles</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="grid">
                <div v-for="(item, i) in items" :key="i" class="box" 
                     :style="{ backgroundColor: item.color, transform: 'scale(' + item.scale + ') rotate(' + item.rotation + 'deg)' }">
                </div>
            </div>
        </div>
    `
};

createApp(BenchmarkApp).mount('#app');
