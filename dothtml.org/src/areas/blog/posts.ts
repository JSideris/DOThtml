// Blog posts index
// Add new posts here when creating blog content
export interface BlogPost {
	slug: string;
	filename: string;
	title: string;
	date: string;
	summary?: string;
	draft?: boolean;
}

export const posts: BlogPost[] = [
	{
		slug: "why-dothtml-exists",
		filename: "2026-09-30-why-dothtml-exists.md",
		title: "Why DOThtml exists",
		date: "2026-09-30",
		summary: "A UI engine for hosts that already own the app, from a multiplayer shooter HUD to preferred reactive paths today."
	},
	{
		slug: "how-out-of-the-way-got-stricter",
		filename: "2026-10-06-how-out-of-the-way-got-stricter.md",
		title: "How \"out of the way\" got stricter",
		date: "2026-10-06",
		summary: "Three times DOThtml redefined staying out of the way: nested builders, router-as-citizen, signals, and what fail-early means for coding agents."
	}
];
