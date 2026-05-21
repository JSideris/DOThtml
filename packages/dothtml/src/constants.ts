export const DOT_VDOM_PROP_NAME = "_dotVDom";
export const IS_DEV = typeof process !== 'undefined' 
  ? process.env.NODE_ENV !== 'production' 
  : (() => {
		try {
			return (new Function("return import.meta.env?.DEV")());
		} catch {
			return false;
		}
	})() ?? false;