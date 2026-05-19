import { dot, DotComponent } from 'dothtml';
import { generateStylingData, FPSMeter } from '../../shared/styling-utils';

dot.setSync(true);

@dot.component
class StylingBenchmark extends DotComponent {
	private items = dot.state(generateStylingData(1000).map(d => ({
		color: dot.state(d.color),
		scale: dot.state(d.scale),
		rotation: dot.state(d.rotation)
	})));

	updateStyles() {
		const newData = generateStylingData(1000);
		const currentItems = this.items.value;
		for (let i = 0; i < 1000; i++) {
			currentItems[i].color.value = newData[i].color;
			currentItems[i].scale.value = newData[i].scale;
			currentItems[i].rotation.value = newData[i].rotation;
		}
	}

	build() {
		return dot.div({ class: 'container' },
			dot.div({ class: 'jumbotron' },
				dot.div({ class: 'row' },
					dot.div({ class: 'col-md-6' }, dot.h1('DOThtml Styling')),
					dot.div({ class: 'col-md-6' },
						dot.div({ class: 'row' },
							dot.button({ id: 'update-styles', class: 'btn btn-primary', onClick: () => this.updateStyles() }, 'Update Styles')
						)
					)
				)
			),
			dot.div({ class: 'grid' },
				dot.each(this.items, item => 
					dot.div({ 
						class: 'box',
						style: s => s
							.backgroundColor(item.color)
							.transform(item.scale.bindAs(sc => item.rotation.bindAs(r => ({ scale: sc, rotate: r }))))
					})
				)
			)
		);
	}
}

dot('#app').mount(new StylingBenchmark());
