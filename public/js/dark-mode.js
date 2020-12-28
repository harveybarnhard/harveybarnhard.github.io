document.addEventListener('DOMContentLoaded', () => {

		const themeStylesheet = document.getElementById('theme');
		const themeToggle = document.getElementById('theme-toggle');
		themeToggle.addEventListener('click', () => {
				// if it's light -> go dark
				if(themeToggle.className.includes('light')){
					document.querySelector(":root").style.setProperty('--main-bg-color', "#333333");
					document.querySelector(":root").style.setProperty('--accent-bg-color', "#e3e3e3");
					document.querySelector(":root").style.setProperty('--text-color', "#e3e3e3");
					document.querySelector(":root").style.setProperty('--link-color', "white");
					document.querySelector(":root").style.setProperty('--link-hover-color', "#00aae8");
					themeToggle.innerHTML = '<i class="fa fa-moon-o fa-2x"></i>';
					themeToggle.className = 'dark';
				} else {
					// if it's dark -> go light
					document.querySelector(":root").style.setProperty('--main-bg-color', "#e6e6e6");
					document.querySelector(":root").style.setProperty('--accent-bg-color', "#333333");
					document.querySelector(":root").style.setProperty('--text-color', "#333333");
					document.querySelector(":root").style.setProperty('--link-color', "#222222");
					document.querySelector(":root").style.setProperty('--link-hover-color', "#949494");
					themeToggle.innerHTML = '<i class="fa fa-sun fa-2x"></i>';
					themeToggle.className = 'light';
				}
		})
})
