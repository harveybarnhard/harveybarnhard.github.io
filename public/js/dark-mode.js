document.addEventListener('DOMContentLoaded', () => {
		const themeToggle = document.getElementById('theme-toggle');
		// If it's between 6am and 7pm, then use light background by default
		var today = new Date().getHours();
		if (today >= 6 && today <= 19) {
			if(themeToggle.className.includes('dark')){
				// if it's dark -> go light
				document.querySelector(":root").style.setProperty('--main-bg-color', "#e6e6e6");
				document.querySelector(":root").style.setProperty('--accent-bg-color', "#333333");
				document.querySelector(":root").style.setProperty('--second-bg-color', "#dcdcdc");
				document.querySelector(":root").style.setProperty('--text-color', "#333333");
				document.querySelector(":root").style.setProperty('--link-hover-color', "#949494");
				document.querySelector(":root").style.setProperty('--main-bg-color-trans', "rgba(240,240,240,0.9)");
				themeToggle.innerHTML = '<i class="fa fa-sun fa-2x"></i>';
				themeToggle.className = 'light';
			}
		}
		themeToggle.addEventListener('click', () => {
				// if it's light -> go dark
				if(themeToggle.className.includes('light')){
					document.querySelector(":root").style.setProperty('--main-bg-color', "#333333");
					document.querySelector(":root").style.setProperty('--accent-bg-color', "#e3e3e3");
					document.querySelector(":root").style.setProperty('--second-bg-color', "#444444");
					document.querySelector(":root").style.setProperty('--text-color', "#e3e3e3");
					document.querySelector(":root").style.setProperty('--link-hover-color', "#6c7b80");
					document.querySelector(":root").style.setProperty('--main-bg-color-trans', "rgba(68,68,68,0.9)");
					themeToggle.innerHTML = '<i class="fa fa-moon-o fa-2x"></i>';
					themeToggle.className = 'dark';
				} else {
					// if it's dark -> go light
					document.querySelector(":root").style.setProperty('--main-bg-color', "#e6e6e6");
					document.querySelector(":root").style.setProperty('--accent-bg-color', "#333333");
					document.querySelector(":root").style.setProperty('--second-bg-color', "#dcdcdc");
					document.querySelector(":root").style.setProperty('--text-color', "#333333");
					document.querySelector(":root").style.setProperty('--link-hover-color', "#949494");
					document.querySelector(":root").style.setProperty('--main-bg-color-trans', "rgba(240,240,240,0.9)");
					themeToggle.innerHTML = '<i class="fa fa-sun fa-2x"></i>';
					themeToggle.className = 'light';
				}
		})
})
