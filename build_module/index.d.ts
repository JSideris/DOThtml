import dot from "./dot";
declare global {
    interface Window {
        dot: typeof dot;
    }
}
export { dot };
