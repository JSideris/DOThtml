import { dot } from "dothtml";
import styles from "./contribute.css?inline";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

const Contribute = dot.component(
	class implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div(
				new MarkdownViewer("/docs/contribute.md")
			);
		}

	}, [styles]
);

export default Contribute;
