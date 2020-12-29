app.controller('mathRender', function() {
	// Load LaTeX rendering
	MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	// Load code highlighting
	document.querySelectorAll('pre code').forEach((block) => {
		hljs.highlightBlock(block);
	});
})
