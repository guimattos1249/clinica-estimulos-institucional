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

	const updateFloatingState = () => {
		siteHeader.classList.toggle('is-floating', window.scrollY > 0);
	};

	window.addEventListener('scroll', updateActiveLinkFromScroll, { passive: true });
	window.addEventListener('scroll', updateFloatingState, { passive: true });
	window.addEventListener('hashchange', updateActiveLinkFromScroll);

	updateActiveLinkFromScroll();
	updateFloatingState();
}

const galleryRoot = document.querySelector('.js-space-gallery');
const lightbox = document.querySelector('.space-lightbox');

if (galleryRoot && lightbox) {
	const galleryItems = Array.from(galleryRoot.querySelectorAll('img'));
	const lightboxImage = lightbox.querySelector('.space-lightbox-image');
	const lightboxCaption = lightbox.querySelector('.space-lightbox-caption');
	const closeButton = lightbox.querySelector('.space-lightbox-close');
	const prevButton = lightbox.querySelector('.space-lightbox-nav.prev');
	const nextButton = lightbox.querySelector('.space-lightbox-nav.next');

	let currentIndex = 0;

	const renderImage = (index) => {
		const safeIndex = (index + galleryItems.length) % galleryItems.length;
		const currentImage = galleryItems[safeIndex];

		currentIndex = safeIndex;
		lightboxImage.src = currentImage.getAttribute('src') || '';
		lightboxImage.alt = currentImage.getAttribute('alt') || 'Imagem da galeria';
		lightboxCaption.textContent = `${safeIndex + 1} de ${galleryItems.length}`;
	};

	const openLightbox = (index) => {
		renderImage(index);
		lightbox.classList.add('is-open');
		lightbox.setAttribute('aria-hidden', 'false');
		document.body.classList.add('lightbox-open');
	};

	const closeLightbox = () => {
		lightbox.classList.remove('is-open');
		lightbox.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('lightbox-open');
	};

	galleryItems.forEach((image, index) => {
		const card = image.closest('.space-gallery-item');
		if (card) {
			card.setAttribute('role', 'button');
			card.setAttribute('tabindex', '0');
			card.setAttribute('aria-label', `Ampliar ${image.alt || `imagem ${index + 1}`}`);

			card.addEventListener('click', () => {
				openLightbox(index);
			});

			card.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					openLightbox(index);
				}
			});
		}
	});

	closeButton?.addEventListener('click', closeLightbox);

	prevButton?.addEventListener('click', () => {
		renderImage(currentIndex - 1);
	});

	nextButton?.addEventListener('click', () => {
		renderImage(currentIndex + 1);
	});

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) {
			closeLightbox();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (!lightbox.classList.contains('is-open')) {
			return;
		}

		if (event.key === 'Escape') {
			closeLightbox();
		}

		if (event.key === 'ArrowLeft') {
			renderImage(currentIndex - 1);
		}

		if (event.key === 'ArrowRight') {
			renderImage(currentIndex + 1);
		}
	});
}
