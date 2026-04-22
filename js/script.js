const siteHeader = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');

if (siteHeader && navToggle && mainNav) {
	const closeMenu = () => {
		siteHeader.classList.remove('menu-open');
		navToggle.setAttribute('aria-expanded', 'false');
	};

	const setActiveNavLink = (targetId) => {
		navLinks.forEach((link) => {
			const isActive = link.getAttribute('href') === `#${targetId}`;
			link.classList.toggle('active', isActive);
		});
	};

	const sectionIds = Array.from(navLinks)
		.map((link) => link.getAttribute('href'))
		.filter((href) => href && href.startsWith('#'))
		.map((href) => href.slice(1));

	const sections = sectionIds
		.map((id) => document.getElementById(id))
		.filter(Boolean)
		.sort((sectionA, sectionB) => sectionA.offsetTop - sectionB.offsetTop);

	const updateActiveLinkFromScroll = () => {
		if (sections.length === 0) {
			return;
		}

		const headerOffset = siteHeader.offsetHeight + 16;
		const scrollPosition = window.scrollY + headerOffset;

		let currentSectionId = sections[0].id;

		sections.forEach((section) => {
			if (scrollPosition >= section.offsetTop) {
				currentSectionId = section.id;
			}
		});

		setActiveNavLink(currentSectionId);
	};

	const toggleMenu = () => {
		const isOpen = siteHeader.classList.toggle('menu-open');
		navToggle.setAttribute('aria-expanded', String(isOpen));
	};

	navToggle.addEventListener('click', toggleMenu);

	navLinks.forEach((link) => {
		link.addEventListener('click', () => {
			const href = link.getAttribute('href') || '';
			if (href.startsWith('#')) {
				setActiveNavLink(href.slice(1));
			}
			closeMenu();
		});
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	});

	window.addEventListener('resize', () => {
		if (window.innerWidth > 1100) {
			closeMenu();
		}
	});

	window.addEventListener('scroll', updateActiveLinkFromScroll, { passive: true });
	window.addEventListener('hashchange', updateActiveLinkFromScroll);

	updateActiveLinkFromScroll();
}
