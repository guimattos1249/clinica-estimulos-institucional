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

const aboutSection = document.getElementById('sobre');
if (aboutSection) {
	const slides = aboutSection.querySelectorAll('.about-carousel-slide');
	const topicTabs = aboutSection.querySelectorAll('[data-about-topic-tab]');
	const topicPanels = aboutSection.querySelectorAll('[data-about-topic-panel]');
	const mediaDots = aboutSection.querySelector('.about-media-dots');
	const mediaPrevButton = aboutSection.querySelector('.about-media-prev');
	const mediaNextButton = aboutSection.querySelector('.about-media-next');
	const caseModal = aboutSection.querySelector('#about-case-modal');
	const openCaseButton = aboutSection.querySelector('[data-open-case-modal]');
	const closeCaseButtons = aboutSection.querySelectorAll('[data-close-case-modal]');
	const videoModal = aboutSection.querySelector('#about-video-modal');
	const openVideoButtons = aboutSection.querySelectorAll('[data-open-video-modal]');
	const videoModalCloseButtons = aboutSection.querySelectorAll('[data-close-video-modal]');
	const videoModalTitle = aboutSection.querySelector('#about-video-title');
	const videoModalPlayer = aboutSection.querySelector('.about-video-full');
	const videoModalSource = videoModalPlayer?.querySelector('source');
	const slidesByTopic = new Map();
	const mediaIndexByTopic = new Map();
	let currentTopic = 0;
	let topicMediaIntervalId = null;

	slides.forEach((slide) => {
		const topic = Number(slide.getAttribute('data-about-topic'));
		if (!slidesByTopic.has(topic)) {
			slidesByTopic.set(topic, []);
		}
		slidesByTopic.get(topic).push(slide);
	});

	const pauseSlideMedia = (slide) => {
		const video = slide.querySelector('video');
		if (!video) {
			return;
		}
		video.pause();
	};

	const playSlideMedia = (slide) => {
		const video = slide.querySelector('video');
		if (!video) {
			return;
		}
		video.currentTime = 0;
	};

	const stopTopicAutoplay = () => {
		if (topicMediaIntervalId) {
			window.clearInterval(topicMediaIntervalId);
			topicMediaIntervalId = null;
		}
	};

	const renderMediaDots = (topic, activeIndex) => {
		if (!mediaDots) {
			return;
		}

		const topicSlides = slidesByTopic.get(topic) || [];
		mediaDots.innerHTML = '';

		if (topicSlides.length <= 1) {
			mediaDots.hidden = true;
			return;
		}

		mediaDots.hidden = false;
		if (mediaPrevButton) {
			mediaPrevButton.hidden = false;
		}
		if (mediaNextButton) {
			mediaNextButton.hidden = false;
		}
		topicSlides.forEach((_, index) => {
			const dot = document.createElement('button');
			dot.type = 'button';
			dot.className = `about-media-dot${index === activeIndex ? ' active' : ''}`;
			dot.setAttribute('aria-label', `Midia ${index + 1} de ${topicSlides.length}`);
			dot.addEventListener('click', () => {
				stopTopicAutoplay();
				setActiveMedia(topic, index);
				startTopicAutoplay(topic);
			});
			mediaDots.appendChild(dot);
		});
	};

	const setActiveMedia = (topic, nextMediaIndex) => {
		const topicSlides = slidesByTopic.get(topic) || [];
		if (!topicSlides.length) {
			return;
		}

		const normalizedIndex = ((nextMediaIndex % topicSlides.length) + topicSlides.length) % topicSlides.length;
		mediaIndexByTopic.set(topic, normalizedIndex);

		slides.forEach((slide) => {
			slide.classList.remove('active');
			pauseSlideMedia(slide);
		});

		const activeSlide = topicSlides[normalizedIndex];
		activeSlide.classList.add('active');
		playSlideMedia(activeSlide);
		renderMediaDots(topic, normalizedIndex);
	};

	const startTopicAutoplay = (topic) => {
		stopTopicAutoplay();
		const topicSlides = slidesByTopic.get(topic) || [];
		if (topicSlides.length <= 1) {
			if (mediaPrevButton) {
				mediaPrevButton.hidden = true;
			}
			if (mediaNextButton) {
				mediaNextButton.hidden = true;
			}
			return;
		}

		topicMediaIntervalId = window.setInterval(() => {
			if (videoModal && !videoModal.hidden) {
				return;
			}
			const currentMediaIndex = mediaIndexByTopic.get(topic) || 0;
			setActiveMedia(topic, currentMediaIndex + 1);
		}, 4200);
	};

	const setActiveTopic = (nextTopic) => {
		if (!slides.length) {
			return;
		}

		currentTopic = ((nextTopic % slides.length) + slides.length) % slides.length;

		topicTabs.forEach((tab, index) => {
			const isActive = index === currentTopic;
			tab.classList.toggle('active', isActive);
			tab.setAttribute('aria-pressed', String(isActive));
		});

		topicPanels.forEach((panel, index) => {
			panel.classList.toggle('active', index === currentTopic);
		});

		setActiveMedia(currentTopic, mediaIndexByTopic.get(currentTopic) || 0);
		startTopicAutoplay(currentTopic);
	};

	topicTabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			setActiveTopic(Number(tab.getAttribute('data-about-topic-tab')));
		});

		tab.addEventListener('keydown', (event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				tab.click();
			}
		});
	});

	if (mediaPrevButton && mediaNextButton) {
		mediaPrevButton.addEventListener('click', () => {
			stopTopicAutoplay();
			setActiveMedia(currentTopic, (mediaIndexByTopic.get(currentTopic) || 0) - 1);
			startTopicAutoplay(currentTopic);
		});

		mediaNextButton.addEventListener('click', () => {
			stopTopicAutoplay();
			setActiveMedia(currentTopic, (mediaIndexByTopic.get(currentTopic) || 0) + 1);
			startTopicAutoplay(currentTopic);
		});
	}

	setActiveTopic(currentTopic);

	if (caseModal && openCaseButton) {
		const openCaseModal = () => {
			caseModal.hidden = false;
			document.body.classList.add('about-case-open');
		};

		const closeCaseModal = () => {
			caseModal.hidden = true;
			document.body.classList.remove('about-case-open');
		};

		// Defensive initialization: always start with the case modal closed.
		closeCaseModal();

		openCaseButton.addEventListener('click', openCaseModal);
		closeCaseButtons.forEach((button) => {
			button.addEventListener('click', closeCaseModal);
		});

		caseModal.addEventListener('click', (event) => {
			if (event.target.closest('[data-close-case-modal]')) {
				closeCaseModal();
			}
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !caseModal.hidden) {
				closeCaseModal();
			}
		});
	}

	if (videoModal && videoModalPlayer) {
		const openVideoModal = (event) => {
			const trigger = event?.currentTarget;
			const selectedVideoSrc = trigger?.getAttribute('data-video-src') || '';
			const selectedVideoTitle = trigger?.getAttribute('data-video-title') || 'Vídeo';

			if (videoModalSource && selectedVideoSrc) {
				videoModalSource.src = selectedVideoSrc;
				videoModalPlayer.load();
			}
			if (videoModalTitle) {
				videoModalTitle.textContent = selectedVideoTitle;
			}

			videoModal.hidden = false;
			document.body.classList.add('about-case-open');
			videoModalPlayer.currentTime = 0;
			videoModalPlayer.play().catch(() => {
				// Playback can still be started manually from controls.
			});
		};

		const closeVideoModal = () => {
			videoModal.hidden = true;
			videoModalPlayer.pause();
			videoModalPlayer.currentTime = 0;
			document.body.classList.remove('about-case-open');
		};

		closeVideoModal();

		openVideoButtons.forEach((button) => {
			button.addEventListener('click', openVideoModal);
		});

		videoModalCloseButtons.forEach((button) => {
			button.addEventListener('click', closeVideoModal);
		});

		videoModal.addEventListener('click', (event) => {
			if (event.target.closest('[data-close-video-modal]')) {
				closeVideoModal();
			}
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !videoModal.hidden) {
				closeVideoModal();
			}
		});
	}
}

// Reviews Carousel
const reviewsCarousel = document.querySelector('.reviews-carousel');
if (reviewsCarousel) {
	const slides = reviewsCarousel.querySelectorAll('.reviews-slide');
	const dots = document.querySelectorAll('.reviews-dot');
	const prevBtn = document.getElementById('reviews-prev');
	const nextBtn = document.getElementById('reviews-next');
	const cards = reviewsCarousel.querySelectorAll('.review-card');
	let currentSlide = 0;

	const syncCardHeights = () => {
		if (!slides.length || !cards.length) {
			return;
		}

		reviewsCarousel.classList.add('is-measuring');
		cards.forEach((card) => {
			card.style.setProperty('--review-card-height', 'auto');
		});

		let maxHeight = 0;
		slides.forEach((slide, slideIndex) => {
			slides.forEach((item) => item.classList.remove('active'));
			dots.forEach((dot) => dot.classList.remove('active'));
			slide.classList.add('active');
			if (dots[slideIndex]) {
				dots[slideIndex].classList.add('active');
			}

			slide.querySelectorAll('.review-card').forEach((card) => {
				maxHeight = Math.max(maxHeight, card.getBoundingClientRect().height);
			});
		});

		slides.forEach((item) => item.classList.remove('active'));
		dots.forEach((dot) => dot.classList.remove('active'));
		slides[currentSlide].classList.add('active');
		if (dots[currentSlide]) {
			dots[currentSlide].classList.add('active');
		}

		const fixedHeight = `${Math.ceil(maxHeight)}px`;
		cards.forEach((card) => {
			card.style.setProperty('--review-card-height', fixedHeight);
		});

		reviewsCarousel.classList.remove('is-measuring');
	};

	const goToSlide = (index) => {
		slides[currentSlide].classList.remove('active');
		if (dots[currentSlide]) {
			dots[currentSlide].classList.remove('active');
		}
		currentSlide = (index + slides.length) % slides.length;
		slides[currentSlide].classList.add('active');
		if (dots[currentSlide]) {
			dots[currentSlide].classList.add('active');
		}
	};

	if (prevBtn && nextBtn) {
		prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
		nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
	}

	dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

	syncCardHeights();
	window.addEventListener('resize', syncCardHeights);
}
