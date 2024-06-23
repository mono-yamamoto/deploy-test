const fadeIn = (element, duration = 500, display = "block") => {
	const delay = 40;
	const elem = element;
	return new Promise((resolve) => {
		if (elem.style.display === "none" || elem.style.display === "") {
			elem.style.display = display;
			elem.style.opacity = 0;
			let opacity = 0;
			const animation = setInterval(() => {
				opacity += 1 / (duration / delay);
				elem.style.opacity = opacity;
				if (opacity >= 1) {
					clearInterval(animation);
					resolve(true);
				}
			}, delay);
		}
	});
};

document.addEventListener("DOMContentLoaded", () => {
	const tabs = document.querySelectorAll(".tab-navigation > li");
	const contents = document.querySelectorAll(".tab-content");

	tabs.forEach((tab, index) => {
		tab.addEventListener("click", () => {
			if (tab.classList.contains("current")) {
				return;
			}
			tabs.forEach((innerTab) => innerTab.classList.remove("current"));
			tab.classList.add("current");

			contents.forEach((content) => {
				const contentItem = content;
				contentItem.style.display = "none";
			});

			if (index >= 0 && index < contents.length) {
				fadeIn(contents[parseInt(index, 10)], 600, "block");
			}
		});
	});
});
