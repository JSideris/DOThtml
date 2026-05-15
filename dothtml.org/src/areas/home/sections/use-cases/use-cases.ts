import { dot } from "dothtml";
import styles from "./use-cases.css?inline";
import { FrameworkItems, IDotComponent } from "dothtml-interfaces";
import MarkdownViewer from "../../../components/MarkdownViewer/MarkdownViewer";

const UseCases = dot.component(
	class UseCases implements IDotComponent{
		_?: FrameworkItems;
		build() {
			return dot.div(
				new MarkdownViewer("/docs/use-cases.md")
			);
		}

	}, [styles]
);

export default UseCases;
