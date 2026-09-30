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
	// Example (do not uncomment - no real posts yet):
	// { 
	//   slug: "hello-world",
	//   filename: "2026-10-01-hello-world.md",
	//   title: "Hello World",
	//   date: "2026-10-01",
	//   summary: "Welcome to the DOThtml blog"
	// }
];
