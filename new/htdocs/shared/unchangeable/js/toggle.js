{
const removeStyleProperties = (element, properties) => {
	properties.forEach((property) => {
		element.style.removeProperty(property);
	});
};

const slideDown = (element, speed = 400) => {
	const elem = element;

	if (elem.classList.contains("is-sliding")) {
		return;
	}
	if (window.getComputedStyle(elem).display !== "none") {
		return;
	}
	elem.classList.add("is-sliding");
	elem.previousElementSibling.classList.add("is-open");
	elem.style.removeProperty("display");
	const { display } = window.getComputedStyle(elem);
	if (display === "none") {
		elem.style.display = "block";
	}
	const height = elem.offsetHeight;
	elem.style.overflow = "hidden";
	elem.style.height = 0;
	elem.style.paddingTop = 0;
	elem.style.paddingBottom = 0;
	elem.style.marginTop = 0;
	elem.style.marginBottom = 0;

	setTimeout(() => {
		elem.style.transitionProperty =
			"height, margin-top, margin-bottom, padding-top, padding-bottom";
		elem.style.transitionDuration = `${speed}ms`;
		elem.style.height = `${height}px`;
		removeStyleProperties(elem, [
			"margin-top",
			"margin-bottom",
			"padding-top",
			"padding-bottom",
		]);
	}, 0);

	setTimeout(() => {
		removeStyleProperties(elem, [
			"height",
			"overflow",
			"transition-property",
			"transition-duration",
		]);
		elem.classList.remove("is-sliding");
	}, speed);
};

const slideUp = (element, speed = 400) => {
	const elem = element;

	if (elem.classList.contains("is-sliding")) {
		return;
	}
	if (window.getComputedStyle(elem).display === "none") {
		return;
	}
	elem.classList.add("is-sliding");
	elem.previousElementSibling.classList.remove("is-open");
	elem.style.overflow = "hidden";
	elem.style.height = `${elem.offsetHeight}px`;

	setTimeout(() => {
		elem.style.transitionProperty =
			"height, margin-top, margin-bottom, padding-top, padding-bottom";
		elem.style.transitionDuration = `${speed}ms`;
		elem.style.height = 0;
		elem.style.paddingTop = 0;
		elem.style.paddingBottom = 0;
		elem.style.marginTop = 0;
		elem.style.marginBottom = 0;
	}, 0);

	setTimeout(() => {
		elem.style.display = "none";

		removeStyleProperties(elem, [
			"height",
			"overflow",
			"transition-property",
			"transition-duration",
			"margin-top",
			"margin-bottom",
			"padding-top",
			"padding-bottom",
		]);
		elem.classList.remove("is-sliding");
	}, speed);
};

const slideToggle = (element, speed = 400) => {
	const elem = element;

	if (window.getComputedStyle(elem).display === "none") {
		slideDown(elem, speed);
	} else {
		slideUp(elem, speed);
	}
};

const footerToggleMenu = document.querySelectorAll(
	".footer-toggle-menu__ttl--parent",
);

footerToggleMenu.forEach((element) => {
	const elem = element;

	elem.addEventListener("click", () => {
		const toggleItem = element.nextElementSibling;
		slideToggle(toggleItem, 300);
	});
});
}