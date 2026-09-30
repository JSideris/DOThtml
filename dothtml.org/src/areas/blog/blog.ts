import { dot, DotComponent } from "dothtml";
import MarkdownViewer from "../../components/MarkdownViewer/MarkdownViewer";
import { posts } from "./posts";

interface BlogProps {
	routeParams: {
		slug?: string;
	};
}

@dot.component
export default class Blog extends DotComponent<BlogProps> {
	static props = {
		routeParams: { type: Object, default: () => ({}) }
	};

	stylize(s: any) {
		return s.class("blog-container", c => c
			.minHeightPx(800)
			.paddingPx(100, 40, 40, 40)
			.maxWidthPx(900)
			.margin("0 auto")
			.position("relative")
			.zIndex(1)
		).class("blog-header", h => h
			.marginBottomPx(60)
			.textAlign("center")
		).class("blog-header h1", h => h
			.fontSizePx(48)
			.marginBottomPx(20)
			.color(s.v("primary"))
		).class("blog-header p", p => p
			.fontSizePx(18)
			.color(s.v("text-dim"))
		).class("blog-post-list", l => l
			.display("flex")
			.flexDirection("column")
			.gapPx(30)
		).class("blog-post-card", c => c
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.paddingPx(30)
			.borderRadiusPx(12)
			.border("1px solid rgba(255, 255, 255, 0.05)")
			.transition("all 0.3s")
			.cursor("pointer")
		).class("blog-post-card:hover", c => c
			.backgroundColor("rgba(255, 255, 255, 0.04)")
			.borderColor("rgba(255, 152, 0, 0.3)")
			.transform("translateY(-2px)")
		).class("blog-post-card h2", h => h
			.fontSizePx(28)
			.marginBottomPx(10)
			.color(s.v("primary"))
		).class("blog-post-card .post-date", d => d
			.fontSizePx(14)
			.color(s.v("text-dim"))
			.marginBottomPx(15)
		).class("blog-post-card .post-summary", su => su
			.fontSizePx(16)
			.color(s.v("text"))
			.lineHeight(1.6)
		).class("blog-empty-state", e => e
			.textAlign("center")
			.paddingPx(80, 40)
			.backgroundColor("rgba(255, 255, 255, 0.02)")
			.borderRadiusPx(12)
			.border("1px solid rgba(255, 255, 255, 0.05)")
		).class("blog-empty-state h2", h => h
			.fontSizePx(32)
			.marginBottomPx(15)
			.color(s.v("text-dim"))
		).class("blog-empty-state p", p => p
			.fontSizePx(16)
			.color(s.v("text-dim"))
		).class("blog-post-content", c => c
			.backgroundColor("rgba(255, 255, 255, 0.01)")
			.paddingPx(40)
			.borderRadiusPx(12)
			.border("1px solid rgba(255, 255, 255, 0.03)")
		).class("blog-post-header", h => h
			.marginBottomPx(40)
			.paddingBottomPx(20)
			.borderBottom("1px solid rgba(255, 255, 255, 0.1)")
		).class("blog-post-header h1", h => h
			.fontSizePx(36)
			.marginBottomPx(10)
			.color(s.v("primary"))
		).class("blog-post-header .post-date", d => d
			.fontSizePx(14)
			.color(s.v("text-dim"))
		).class("blog-back-link", l => l
			.display("inline-block")
			.marginBottomPx(30)
			.color(s.v("text-dim"))
			.transition("color 0.2s")
		).class("blog-back-link:hover", l => l
			.color(s.v("primary"))
		).media("screen and (max-width: 800px)", m => m
			.class("blog-container", bc => bc
				.paddingPx(60, 20, 20, 20)
			).class("blog-header h1", h => h
				.fontSizePx(36)
			).class("blog-post-card", c => c
				.paddingPx(20)
			)
		);
	}

	private buildPostList() {
		const publishedPosts = posts.filter(p => !p.draft);

		if (publishedPosts.length === 0) {
			return dot.div({ class: "blog-empty-state" },
				dot.h2("No posts yet"),
				dot.p("Check back soon for updates and announcements!")
			);
		}

		return dot.div({ class: "blog-post-list" },
			dot.each(publishedPosts, post => 
				dot.div({ 
					class: "blog-post-card",
					onClick: () => {
						(dot as any).navigate(`/blog/${post.slug}`);
					}
				},
					dot.h2(post.title),
					dot.div({ class: "post-date" }, this.formatDate(post.date)),
					post.summary ? dot.div({ class: "post-summary" }, post.summary) : dot.div()
				)
			)
		);
	}

	private buildPostView(slug: string) {
		const post = posts.find(p => p.slug === slug);
		
		if (!post) {
			return dot.div({ class: "blog-post-content" },
				dot.h1("Post not found"),
				dot.p("The requested blog post could not be found."),
				dot.a({ 
					href: "/blog",
					class: "blog-back-link",
					onClick: (e: MouseEvent) => {
						e.preventDefault();
						(dot as any).navigate("/blog");
					}
				}, "← Back to blog")
			);
		}

		return dot.div(
			dot.a({ 
				href: "/blog",
				class: "blog-back-link",
				onClick: (e: MouseEvent) => {
					e.preventDefault();
					(dot as any).navigate("/blog");
				}
			}, "← Back to blog"),
			dot.div({ class: "blog-post-content" },
				dot.div({ class: "blog-post-header" },
					dot.h1(post.title),
					dot.div({ class: "post-date" }, this.formatDate(post.date))
				),
				dot.mount(new MarkdownViewer({ src: `/blog/${post.filename}` }))
			)
		);
	}

	private formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString("en-US", { 
			year: "numeric", 
			month: "long", 
			day: "numeric" 
		});
	}

	build() {
		const slug = this.props.routeParams.slug;

		if (slug) {
			return dot.div({ class: "blog-container" },
				this.buildPostView(slug)
			);
		}

		return dot.div({ class: "blog-container" },
			dot.header({ class: "blog-header" },
				dot.h1("Blog"),
				dot.p("Updates, announcements, and insights from the DOThtml team")
			),
			this.buildPostList()
		);
	}
}
