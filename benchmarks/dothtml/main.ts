import { dot, DotComponent } from 'dothtml';
import { buildData } from '../shared/data-generator';

dot.setSync(true);

@dot.component
class BenchmarkApp extends DotComponent {
    data = dot.state([]);
    selected = dot.state(null);

    run() {
        this.data.value = buildData(1000);
        this.selected.value = null;
    }

    runLots() {
        this.data.value = buildData(10000);
        this.selected.value = null;
    }

    add() {
        this.data.value = [...this.data.value, ...buildData(1000)];
    }

    update() {
        const d = this.data.value;
        for (let i = 0; i < d.length; i += 10) {
            d[i].label += ' !!!';
        }
        this.data.value = [...d];
    }

    clear() {
        this.data.value = [];
        this.selected.value = null;
    }

    swapRows() {
        const d = this.data.value;
        if (d.length > 998) {
            const temp = d[1];
            d[1] = d[998];
            d[998] = temp;
            this.data.value = [...d];
        }
    }

    select(id) {
        this.selected.value = id;
    }

    remove(id) {
        this.data.value = this.data.value.filter(d => d.id !== id);
    }

    build() {
        return dot.div({ class: 'container' },
            dot.div({ class: 'jumbotron' },
                dot.div({ class: 'row' },
                    dot.div({ class: 'col-md-6' }, dot.h1('DOThtml')),
                    dot.div({ class: 'col-md-6' },
                        dot.div({ class: 'row' },
                            dot.button({ id: 'run', class: 'btn btn-primary', onClick: () => this.run() }, 'Create 1,000 rows'),
                            dot.button({ id: 'runlots', class: 'btn btn-primary', onClick: () => this.runLots() }, 'Create 10,000 rows'),
                            dot.button({ id: 'add', class: 'btn btn-primary', onClick: () => this.add() }, 'Append 1,000 rows'),
                            dot.button({ id: 'update', class: 'btn btn-primary', onClick: () => this.update() }, 'Update every 10th row'),
                            dot.button({ id: 'clear', class: 'btn btn-primary', onClick: () => this.clear() }, 'Clear'),
                            dot.button({ id: 'swaprows', class: 'btn btn-primary', onClick: () => this.swapRows() }, 'Swap Rows')
                        )
                    )
                )
            ),
            dot.table({ class: 'table table-hover table-striped test-data' },
                dot.tBody(
                    dot.each(this.data, d => 
                        dot.tr({ class: this.selected.bindAs(s => s === d.id ? 'selected' : '') },
                            dot.td({ class: 'col-md-1' }, d.id),
                            dot.td({ class: 'col-md-4' }, 
                                dot.a({ onClick: () => this.select(d.id) }, d.label)
                            ),
                            dot.td({ class: 'col-md-1' }, 
                                dot.a({ onClick: () => this.remove(d.id) }, 
                                    dot.span({ class: 'glyphicon glyphicon-remove danger', 'aria-hidden': 'true' }, 'x')
                                )
                            ),
                            dot.td({ class: 'col-md-6' })
                        )
                    )
                )
            )
        );
    }
}

dot('#app').mount(new BenchmarkApp());
