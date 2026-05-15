import { dot } from "dothtml";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import styles from "./quick-start-part.css?inline";
import MarkdownViewer from "../../../../components/MarkdownViewer/MarkdownViewer";

const QuickStartPart = dot.component(
	class implements IDotComponent{
		events?: string[];
		_?: FrameworkItems;
		build() {
			return dot.div(
				{id: "content"},
				new MarkdownViewer("/docs/quick-start.md")
			)
		}
	}, [styles]
);

export default QuickStartPart;
