# Documentation #

This readme is a place for planning DOThtml 6 documentation. There's a few approaches we can take for documentation.

1. Knowledge base. Users can search for topics they need help with. Allows us to build up a tremendous amount of misc documentation but gets messy, hard to follow, hard to learn, and difficult to modify.
2. Curriculum. The information will be presented in a way that facilitates learning the framework from scratch.

I think that because this is a brand-new framework, the curriculum method is probably preferrable. The topics can roughly follow the order of the test cases,
since generally speaking the tests go from testing basic functionality to increasingly complex functionality. It would also be cool if we colud have an inspection glass that could appear under certain user input which showed the underlying component structure of the website itself and possibly the source code.

## Website ##

The website will be "3D" HTML that's been transformed using CSS. It will be super modern with lots of pretty features and interactive components. 

For the documentation pages, it would be cool to have a pane resembling a holographic projection that vanishes then reappears with new content. We could also do an animated hue shift, etc.

Navbar:
- Docs
- Examples
- Blog

Content:

1. Hero Section.
<!-- 2. Where to get.
	a. NPM / Yarn.
	b. CDN? -->
3. Small code sample.
4. Main features.
	a. Pure TypeScript/JavaScript.
	b. Modern Features
		- Components.
		- Reactive.
	c. Built for DI 
		- Drop into any project.
		- Extendable.
	d. Just works.
		- Engineered to minimize syntactic salt.
		- 0 third party dependencies.
5. Detailed features breakdown (?).
	- Style builder.
	- DI.
	- Manage popup windows directly from your app.
	- Polymorpchic components.
	- Reacctivity.
	- 
6. Learn more.
7. Contribute.
	a. Bugs.
	b. Github.
8. Footer.

## Curriculum ##

### Quick Start ###

#### Installation ####
1. Build a DOThtml App
2. Add DOThtml to an Existing Project
3. Build a Component Library for DOThtml
4. Import <script>.


### Rendering Basics ###

1. Targetting & Rendering
2. Elements
3. Attributes

### Flow ###

1. `when`, `otherwise`, `otherwiseWhen`.
2. `each`.

### Reactivity & Bindings ###

### User Input & Events ###

### Components ###

### Styling ###

#### Exernal Scoped Stylesheets ####

- Samples.
- Suggested Webpack configuration.
	- CSS
	- SCSS / other (don't use CSS loader).
- CSS tips for styling within the Shadow DOM.
	- Basic concepts.
		- Shadow Roots
		- Adopted stylesheets.
		- Encaplusation & variables.
	- :host
	- :root
	- :host-context
- Other considerations.

#### Style Builder ####

### Backend Configuration & Routing ###

### Advanced Topics ###

#### Under the Hood ####

#### Building Extensions & Component Libraries ####

## Examples ##

The examples section will be a list of single-file examples. It would be REALLY cool if we could get typescript working but if not JavaScript would be pretty cool too. If typescript, might want to add a max file length to prevent insanity. Just upload the file you want to compile, build it, and send back the bundle. Should be pretty simple. Client-side building would be even cooler and I think it may be possible.

Examples can be taken from dothtml's test cases. Just dress them up to look better.
