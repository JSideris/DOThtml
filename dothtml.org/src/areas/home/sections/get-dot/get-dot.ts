import { dot } from "dothtml";
import styles from "./get-dot.css?inline";
import { FrameworkItems, IDotComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

@dot.component
@dot.component.useStyles(styles)
class GetDot implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div(
			new MarkdownViewer("/docs/get-dot.md")
		);
	}

}

export default GetDot;
