import { dot } from "dothtml";
import styles from "./main-features.css?inline";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

const MainFeatures = dot.component(
	class MainFeatures implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div(
				new MarkdownViewer("/docs/main-features.md")
			);
		}

	}, [styles]
);

export default MainFeatures;
