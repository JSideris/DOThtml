import dothtmlPlugin from '../src/index';

describe('vite-plugin-dothtml', () => {
  const plugin = dothtmlPlugin() as any;

  test('injects __hmrId and HMR snippet into component classes', () => {
    const code = `
      export class MyComponent extends DotComponent {
        build() {
          return dot.div("Hello");
        }
      }
    `;
    const id = '/src/components/MyComponent.ts';
    const result = plugin.transform(code, id);

    expect(result).not.toBeNull();
    expect(result.code).toContain('static __hmrId = "/src/components/MyComponent.ts:MyComponent";');
    expect(result.code).toContain('import.meta.hot.accept');
    expect(result.code).toContain('dot.hmr.swap("/src/components/MyComponent.ts:MyComponent", newModule.MyComponent)');
  });

  test('skips files without components', () => {
    const code = `
      export const helper = () => {
        return "not a component";
      };
    `;
    const id = '/src/utils/helper.ts';
    const result = plugin.transform(code, id);

    expect(result).toBeNull();
  });

  test('handles multiple components in one file', () => {
    const code = `
      class Comp1 {
        build() {}
      }
      class Comp2 {
        build() {}
      }
    `;
    const id = '/src/components/Multiple.ts';
    const result = plugin.transform(code, id);

    expect(result.code).toContain('static __hmrId = "/src/components/Multiple.ts:Comp1";');
    expect(result.code).toContain('static __hmrId = "/src/components/Multiple.ts:Comp2";');
    expect(result.code).toContain('dot.hmr.swap("/src/components/Multiple.ts:Comp1", newModule.Comp1)');
    expect(result.code).toContain('dot.hmr.swap("/src/components/Multiple.ts:Comp2", newModule.Comp2)');
  });
});
