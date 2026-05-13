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

const initializeImageLightbox = ({ gallerySelector, lightboxSelector, triggerSelector, imageSelector }) => {
	const galleryRoot = document.querySelector(gallerySelector);
	const lightbox = document.querySelector(lightboxSelector);

	if (!galleryRoot || !lightbox) {
		return;
	}

	const galleryItems = Array.from(galleryRoot.querySelectorAll(imageSelector));
	const lightboxImage = lightbox.querySelector('.space-lightbox-image');
	const lightboxCaption = lightbox.querySelector('.space-lightbox-caption');
	const closeButton = lightbox.querySelector('.space-lightbox-close');
	const prevButton = lightbox.querySelector('.space-lightbox-nav.prev');
	const nextButton = lightbox.querySelector('.space-lightbox-nav.next');

	if (galleryItems.length === 0 || !lightboxImage || !lightboxCaption) {
		return;
	}

	let currentIndex = 0;

	const renderImage = (index) => {
		const safeIndex = (index + galleryItems.length) % galleryItems.length;
		const currentImage = galleryItems[safeIndex];

		currentIndex = safeIndex;
		lightboxImage.src = currentImage.getAttribute('src') || '';
		lightboxImage.alt = currentImage.getAttribute('alt') || 'Imagem ampliada';
		lightboxCaption.textContent = currentImage.getAttribute('alt') || `${safeIndex + 1} de ${galleryItems.length}`;
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
		const trigger = image.closest(triggerSelector);
		if (!trigger) {
			return;
		}

		if (!trigger.matches('button')) {
			trigger.setAttribute('role', 'button');
			trigger.setAttribute('tabindex', '0');
		}

		trigger.addEventListener('click', () => {
			openLightbox(index);
		});

		trigger.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openLightbox(index);
			}
		});
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
};

initializeImageLightbox({
	gallerySelector: '.js-space-gallery',
	lightboxSelector: '.space-lightbox:not(.team-lightbox)',
	triggerSelector: '.space-gallery-item',
	imageSelector: 'img'
});

initializeImageLightbox({
	gallerySelector: '.js-team-gallery',
	lightboxSelector: '.team-lightbox',
	triggerSelector: '.team-avatar',
	imageSelector: '.team-avatar img'
});

const createScrollTopFab = () => {
	const fabButton = document.createElement('button');
	fabButton.type = 'button';
	fabButton.className = 'scroll-top-fab';
	fabButton.setAttribute('aria-label', 'Voltar ao topo da página');
	fabButton.setAttribute('title', 'Voltar ao topo');
	fabButton.innerHTML = '<svg viewBox="0 0 24 24" role="img" aria-hidden="true"><path d="M12 5.5 5.8 11.7a1 1 0 1 0 1.4 1.4l3.8-3.8V18a1 1 0 1 0 2 0V9.3l3.8 3.8a1 1 0 0 0 1.4-1.4L12 5.5Z" /></svg>';
	document.body.appendChild(fabButton);

	const toggleFabVisibility = () => {
		const shouldShow = window.scrollY > 320;
		fabButton.classList.toggle('is-visible', shouldShow);
	};

	fabButton.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	});

	window.addEventListener('scroll', toggleFabVisibility, { passive: true });
	toggleFabVisibility();
};

if (document.body) {
	createScrollTopFab();
}

// Reviews Carousel
const reviewsCarousel = document.querySelector('.reviews-carousel');
if (reviewsCarousel) {
	const slides = reviewsCarousel.querySelectorAll('.reviews-slide');
	const dots = document.querySelectorAll('.reviews-dot');
	const prevBtn = document.getElementById('reviews-prev');
	const nextBtn = document.getElementById('reviews-next');
	let currentSlide = 0;

	const goToSlide = (index) => {
		slides[currentSlide].classList.remove('active');
		dots[currentSlide].classList.remove('active');
		currentSlide = (index + slides.length) % slides.length;
		slides[currentSlide].classList.add('active');
		dots[currentSlide].classList.add('active');
	};

	prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
	nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
	dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));
}
