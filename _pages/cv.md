---
permalink: /cv/
layout: single
---


<div id="adobe-dc-view" style="max-width: 800px;"></div>
<script src="https://documentcloud.adobe.com/view-sdk/viewer.js"></script>
<script type="text/javascript">
	document.addEventListener("adobe_dc_view_sdk.ready", function(){
		var adobeDCView = new AdobeDC.View({clientId: "11b63b23cecc43a99e8669ed7d8d47a3", divId: "adobe-dc-view"});
		adobeDCView.previewFile({
			content:{location: {url: "https://harveybarnhard.com/assets/cv-harvey-barnhard.pdf"}},
			metaData:{fileName: "cv-harvey-barnhard.pdf"}
		}, {embedMode: "IN_LINE"});
	});
</script>
