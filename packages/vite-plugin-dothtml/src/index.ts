import { Plugin } from 'vite';

export default function dothtmlPlugin(): Plugin {
  return {
    name: 'vite-plugin-dothtml',
    transform(code, id) {
      if (!id.endsWith('.ts') && !id.endsWith('.js')) return;
      if (id.includes('node_modules')) return;

      // Simple regex to find classes that might be DOThtml components
      // We look for classes that have a build() method or extend DotComponent
      const componentRegex = /class\s+(\w+)(?:\s+extends\s+[\w.]+)?(?:\s+implements\s+[\w.]+)?\s*\{/g;
      let match;
      let hasComponent = false;
      let newCode = code;
      const componentNames: string[] = [];

      while ((match = componentRegex.exec(code)) !== null) {
        const className = match[1];
        // Check if it has a build method
        const classBodyStart = match.index + match[0].length;
        // This is a very basic check, but should work for most cases
        // A more robust way would be to use a proper parser
        if (code.includes('build', classBodyStart)) {
          hasComponent = true;
          componentNames.push(className);
          const hmrId = `${id}:${className}`;
          // Inject __hmrId
          newCode = newCode.replace(
            match[0],
            `${match[0]}\n  static __hmrId = ${JSON.stringify(hmrId)};`
          );
        }
      }

      if (hasComponent) {
        const hmrSnippet = `
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    if (newModule) {
      ${componentNames.map(name => `
      if (newModule.${name}) {
        const dot = (window as any).dot;
        if (dot && dot.hmr) {
          dot.hmr.swap(${JSON.stringify(`${id}:${name}`)}, newModule.${name});
        }
      }`).join('\n')}
    }
  });
}
`;
        return {
          code: newCode + hmrSnippet,
          map: null
        };
      }

      return null;
    }
  };
}
