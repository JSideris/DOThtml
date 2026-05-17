/**
 * A simple markdown parser that converts markdown strings to HTML.
 * Supports headings, bold, italic, links, lists, and paragraphs.
 */
export default class MarkdownParser {
	/**
	 * Parses a markdown string and returns the corresponding HTML.
	 * @param markdown The markdown string to parse.
	 * @returns The generated HTML string.
	 */
	public static parse(markdown: string): string {
		if (!markdown) return "";

		// Normalize newlines
		let html = markdown.replace(/\r\n/g, "\n").trim();

		// 0. Pre-process: Code Blocks (```language ... ```)
		// We do this first and replace with placeholders to avoid other rules touching the code content
		const codeBlocks: string[] = [];
		html = html.replace(/^(\s*)```(\w+)?\n([\s\S]*?)\n\s*```/gm, (match, indent, lang, code) => {
			const index = codeBlocks.length;
			const languageClass = lang ? ` class="language-${lang}"` : "";

			let lines = code.split("\n");

			// Strip the leading indentation of the backticks from all lines if present
			if (indent) {
				lines = lines.map((line) => (line.startsWith(indent) ? line.substring(indent.length) : line));
			}

			// Find minimum remaining indentation of non-empty lines
			const minIndent = lines.reduce((min, line) => {
				if (line.trim().length === 0) return min;
				const match = line.match(/^(\s*)/);
				const count = match ? match[1].length : 0;
				return Math.min(min, count);
			}, Infinity);

			if (minIndent !== Infinity && minIndent > 0) {
				lines = lines.map((line) => line.substring(Math.min(line.length, minIndent)));
			}

			const escapedCode = this.escapeHtml(lines.join("\n").trim());
			const highlightedCode = this.highlight(escapedCode, lang);
			codeBlocks.push(`<pre><code${languageClass}>${highlightedCode}</code></pre>`);
			return `${indent}:::CB-ID-${index}:::`;
		});

		// Escape HTML tags in the remaining markdown to prevent unintended rendering
		html = this.escapeHtml(html);

		// 1. Block Elements

		// Horizontal Rules
		html = html.replace(/^---$/gm, "<hr />");

		// Headings (# h1, ## h2, etc.)
		html = html.replace(/^###### (.*$)/gm, "<h6>$1</h6>");
		html = html.replace(/^##### (.*$)/gm, "<h5>$1</h5>");
		html = html.replace(/^#### (.*$)/gm, "<h4>$1</h4>");
		html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
		html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
		html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

		// Blockquotes
		// Matches one or more lines starting with &gt;
		html = html.replace(/((?:^(?:[ \t]*)&gt;[ \t]?.*(?:\n|$))+)/gm, (match) => {
			const lines = match.split("\n");
			const content = lines
				.map((line) => line.trim().replace(/^&gt;[ \t]?/, ""))
				.filter((line) => line !== null)
				.join("\n")
				.trim();

			if (!content) return "";

			// Check for callouts
			let className = "";
			if (content.startsWith("**Note**:") || content.startsWith("**Note** :")) {
				className = ' class="blockquote-note"';
			} else if (content.startsWith("**Warning**:") || content.startsWith("**Warning** :")) {
				className = ' class="blockquote-warning"';
			}

			return `<blockquote${className}>${content.replace(/\n/g, "<br />")}</blockquote>\n`;
		});

		// Tables
		// Matches header, separator, and data rows
		html = html.replace(
			/^(\|.*\|)\n[ \t]*(\|[ \t]*:?---*:?[ \t]*(?:\|[ \t]*:?---*:?[ \t]*)*\|)[ \t]*\n((?:\|.*\|(?:\n|$))*)/gm,
			(match, header, separator, rows) => {
				const getCells = (row: string) => {
					const cells = row.trim().split("|");
					// Remove empty strings at start and end if they exist (due to leading/trailing pipes)
					if (cells[0] === "") cells.shift();
					if (cells[cells.length - 1] === "") cells.pop();
					return cells.map((c) => c.trim());
				};

				const headerCells = getCells(header);
				const sepCells = getCells(separator);
				const alignments = sepCells.map((c) => {
					if (c.startsWith(":") && c.endsWith(":")) return "center";
					if (c.endsWith(":")) return "right";
					if (c.startsWith(":")) return "left";
					return "";
				});

				let tableHtml = "<table><thead><tr>";
				headerCells.forEach((cell, i) => {
					const align = alignments[i] ? ` align="${alignments[i]}"` : "";
					tableHtml += `<th${align}>${cell}</th>`;
				});
				tableHtml += "</tr></thead><tbody>";

				const rowLines = rows.trim().split("\n");
				rowLines.forEach((rowLine) => {
					if (!rowLine.trim()) return;
					const cells = getCells(rowLine);
					tableHtml += "<tr>";
					headerCells.forEach((_, i) => {
						const align = alignments[i] ? ` align="${alignments[i]}"` : "";
						tableHtml += `<td${align}>${cells[i] || ""}</td>`;
					});
					tableHtml += "</tr>";
				});

				tableHtml += "</tbody></table>";
				return tableHtml;
			},
		);

		// 1. Task List Checkboxes
		html = html.replace(/^([ \t]*[\-\*\d\.]+[ \t]+)\[ \] /gm, '$1<input type="checkbox" disabled /> ');
		html = html.replace(/^([ \t]*[\-\*\d\.]+[ \t]+)\[[xX]\] /gm, '$1<input type="checkbox" checked disabled /> ');

		// 2. List Items (single line)
		// Mark them so we can wrap them later
		html = html.replace(/^([ \t]*)[\-\*] (.*)/gm, '$1<li data-list="ul">$2</li>');
		html = html.replace(/^([ \t]*)\d+\. (.*)/gm, '$1<li data-list="ol">$2</li>');

		// 3. List Wrapping
		// We process the lines to handle nesting and proper UL/OL wrapping
		const lines = html.split("\n");
		const processedLines: string[] = [];
		const listStack: { indent: number; type: string }[] = [];
		let liOpen = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const liMatch = line.match(/^([ \t]*)<li data-list="(ul|ol)">(.*)<\/li>/);

			if (liMatch) {
				const indent = liMatch[1].replace(/\t/g, "    ").length;
				const type = liMatch[2];
				const content = liMatch[3];

				if (listStack.length > 0 && indent > listStack[listStack.length - 1].indent) {
					// Nesting: Open new list inside the current LI
					listStack.push({ indent, type });
					processedLines.push(`${" ".repeat(indent)}<${type}>`);
					processedLines.push(`${" ".repeat(indent)}<li>${content}`);
					liOpen = true;
				} else {
					// Not nesting: Close previous items/lists
					if (liOpen) {
						processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
						liOpen = false;
					}

					while (listStack.length > 0 && indent < listStack[listStack.length - 1].indent) {
						const closed = listStack.pop()!;
						processedLines.push(`${" ".repeat(closed.indent)}</${closed.type}>`);
						if (listStack.length > 0) {
							processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
						}
					}

					if (listStack.length === 0 || listStack[listStack.length - 1].type !== type || indent !== listStack[listStack.length - 1].indent) {
						// New list level or type change
						if (listStack.length > 0 && indent === listStack[listStack.length - 1].indent) {
							const closed = listStack.pop()!;
							processedLines.push(`${" ".repeat(closed.indent)}</${closed.type}>`);
						}
						listStack.push({ indent, type });
						processedLines.push(`${" ".repeat(indent)}<${type}>`);
					}

					processedLines.push(`${" ".repeat(indent)}<li>${content}`);
					liOpen = true;
				}
			} else if (line.trim() === "" && listStack.length > 0) {
				processedLines.push(line);
			} else {
				// Not a list item, close everything
				if (liOpen) {
					processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
					liOpen = false;
				}
				while (listStack.length > 0) {
					const closed = listStack.pop()!;
					processedLines.push(`${" ".repeat(closed.indent)}</${closed.type}>`);
					if (listStack.length > 0) {
						processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
					}
				}
				processedLines.push(line);
			}
		}

		if (liOpen) {
			processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
		}
		while (listStack.length > 0) {
			const closed = listStack.pop()!;
			processedLines.push(`${" ".repeat(closed.indent)}</${closed.type}>`);
			if (listStack.length > 0) {
				processedLines.push(`${" ".repeat(listStack[listStack.length - 1].indent)}</li>`);
			}
		}
		html = processedLines.join("\n");

		// 2. Inline Elements

		// Bold (**text** or __text__)
		html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
		html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

		// Italic (*text* or _text_)
		html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
		html = html.replace(/_(.*?)_/g, "<em>$1</em>");

		// Links ([text](url))
		html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
			// Convert relative .md links to hashes for our docs viewer
			if (url.endsWith(".md") && !url.startsWith("http") && !url.startsWith("//") && !url.startsWith("/")) {
				const hash = url.replace(".md", "").replace("./", "");
				return `<a href="#/docs/${hash}">${text}</a>`;
			}
			return `<a href="${url}">${text}</a>`;
		});

		// Inline Code (`code`)
		html = html.replace(/`(.*?)`/g, "<code>$1</code>");

		// 3. Paragraphs
		// Split by double newlines and wrap in <p>, excluding already wrapped blocks
		const blocks = html.split(/\n\n+/);
		html = blocks
			.map((block) => {
				block = block.trim();
				if (!block) return "";

				// If it's a code block placeholder, return as is
				if (block.startsWith(":::CB-ID-") && block.endsWith(":::")) {
					return block;
				}

				// If it starts with a block-level tag, don't wrap in <p>
				// We use \/? to match both opening and closing tags (like </ul>)
				if (/^<\/?(h[1-6]|ul|ol|li|hr|code|pre|blockquote|table|thead|tbody|tr|th|td)/i.test(block)) {
					return block;
				}
				return `<p>${block.replace(/\n/g, "<br />")}</p>`;
			})
			.join("\n");

		// 4. Restore Code Blocks
		codeBlocks.forEach((codeHtml, index) => {
			// Using split/join instead of replace to avoid $ special character issues in replacement string
			html = html.split(`:::CB-ID-${index}:::`).join(codeHtml);
		});

		return html;
	}

	private static highlight(code: string, lang?: string): string {
		if (lang !== "ts" && lang !== "js" && lang !== "javascript" && lang !== "typescript") {
			return code;
		}

		const tokens: string[] = [];
		
		// 1. Protect strings and comments by replacing them with placeholders
		let highlighted = code
			.replace(/(".*?"|'.*?'|`[\s\S]*?`|(\/\/.*$|\/\*[\s\S]*?\*\/))/gm, (match) => {
				const id = `:::TOKEN-${tokens.length}:::`;
				// Determine if it's a string or a comment for later styling
				const className = (match.startsWith("//") || match.startsWith("/*")) ? "token-comment" : "token-string";
				tokens.push(`<span class="${className}">${match}</span>`);
				return id;
			});

		// 2. Now it's safe to highlight keywords, types, and functions
		highlighted = highlighted
			.replace(/\b(const|let|var|function|class|extends|export|import|from|return|if|else|for|while|new|this|async|await|static|private|public|protected|get|set|type|interface|as)\b/g, '<span class="token-keyword">$1</span>')
			.replace(/\b(string|number|boolean|any|void|never|unknown|Record|Map|Set|Array|Promise)\b/g, '<span class="token-type">$1</span>')
			.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>')
			.replace(/\b([a-zA-Z_]\w*)(?=\s*\()/g, '<span class="token-function">$1</span>');

		// 3. Restore the protected strings and comments
		tokens.forEach((tokenHtml, i) => {
			highlighted = highlighted.split(`:::TOKEN-${i}:::`).join(tokenHtml);
		});

		return highlighted;
	}

	private static escapeHtml(text: string): string {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}
}
