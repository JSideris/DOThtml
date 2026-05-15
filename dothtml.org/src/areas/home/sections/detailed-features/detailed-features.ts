import { dot } from "dothtml";
import styles from "./detailed-features.css?inline";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import LargeLogoPart from "../hero-section/large-logo-part/large-logo-part";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

const DetailedFeatures = dot.component(
	class DetailedFeatures implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div(
				new MarkdownViewer("/docs/detailed-features.md"),
				dot.button({
					onClick: ()=>{
						let w = dot.window({
							content: new LargeLogoPart() as any
						});

						w.open();
					}
				}, "Click me!")
			);
		}
	}
);

export default DetailedFeatures;
