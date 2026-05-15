import { dot } from "dothtml";
import styles from "./learn-more.css?inline";
import { FrameworkItems, IDotComponent, IDotCss, IDotGenericElement } from "dothtml-interfaces";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

@dot.component
@dot.component.useStyles(styles)
class LearnMore implements IDotComponent{
	events?: string[];
	_?: FrameworkItems;
	build(): IDotGenericElement {
		return dot.div(
			new MarkdownViewer("/docs/learn-more.md")
		);
	}

}

export default LearnMore;
