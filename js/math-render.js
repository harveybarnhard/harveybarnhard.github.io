app.controller('mathRender', function() {
	// Scroll to top
	window.scrollTo(0, 0)
	// Load LaTeX rendering
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	// Load code highlighting
	document.querySelectorAll('pre code').forEach((block) => {
		hljs.highlightBlock(block);
	});
})
