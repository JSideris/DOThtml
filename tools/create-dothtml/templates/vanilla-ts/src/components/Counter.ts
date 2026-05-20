import { dot, IDotComponent, IDotDocument, FrameworkItems } from 'dothtml';

export class Counter implements IDotComponent {
  count = dot.state(0);
  _: FrameworkItems;

  build(): IDotDocument {
    return dot.div({ class: 'card' })
      .h2('Interactive Counter')
      .p('The count is: ', this.count)
      .button({ 
        onClick: () => this.count.value++ 
      }, 'Increment')
      .button({ 
        onClick: () => this.count.value--,
        style: 'margin-left: 10px'
      }, 'Decrement');
  }
}
