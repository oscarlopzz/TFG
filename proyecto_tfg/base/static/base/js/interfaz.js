// Navbar responsive
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar-toggle');
    const links = document.querySelector('.navbar-links');
    toggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });

    // Carousel Destacados: muestra 3 tarjetas a la vez (1 en móvil)
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselCards = carouselTrack ? carouselTrack.children : [];
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let carouselIndex = 0;

    function getCardsToShow() {
        return window.innerWidth < 900 ? 1 : 3;
    }

    function updateCarousel() {
        if (!carouselTrack) return;
        const cardsToShow = getCardsToShow();
        let visibleCount = 0;

        Array.from(carouselCards).forEach((card, idx) => {
            // Mostrar las tarjetas dentro del rango visible
            const isVisible = idx >= carouselIndex && idx < carouselIndex + cardsToShow;
            card.classList.toggle('active', isVisible);
            if (isVisible) visibleCount++;
        });

        // Mostrar mensaje si no hay tarjetas visibles
        const noRestaurantsMsg = document.querySelector('.no-restaurants-msg');
        if (noRestaurantsMsg) {
            noRestaurantsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }
    updateCarousel();

    if (prevBtn && nextBtn && carouselTrack) {
        prevBtn.addEventListener('click', () => {
            // Retrocede una tarjeta
            carouselIndex = Math.max(0, carouselIndex - 1);
            updateCarousel();
        });
        nextBtn.addEventListener('click', () => {
            // Avanza una tarjeta
            const cardsToShow = getCardsToShow();
            carouselIndex = Math.min(carouselCards.length - cardsToShow, carouselIndex + 1);
            updateCarousel();
        });
        window.addEventListener('resize', () => {
            // Ajusta el índice si cambia el tamaño de pantalla
            const cardsToShow = getCardsToShow();
            if (carouselIndex > carouselCards.length - cardsToShow) {
                carouselIndex = Math.max(0, carouselCards.length - cardsToShow);
            }
            updateCarousel();
        });
    }

    // Opiniones Slider SOLO flechas, muestra una a la vez
    const opinionesTrack = document.querySelector('.opiniones-track');
    const opinionCards = opinionesTrack ? opinionesTrack.children : [];
    const opPrev = document.querySelector('.opiniones-btn.prev');
    const opNext = document.querySelector('.opiniones-btn.next');
    let opIndex = 0;

    function updateOpiniones() {
        if (!opinionesTrack) return;
        Array.from(opinionCards).forEach((card, idx) => {
            card.classList.toggle('active', idx === opIndex);
        });
    }
    updateOpiniones();

    if (opPrev && opNext && opinionesTrack) {
        opPrev.addEventListener('click', () => {
            opIndex = Math.max(0, opIndex - 1);
            updateOpiniones();
        });
        opNext.addEventListener('click', () => {
            opIndex = Math.min(opinionCards.length - 1, opIndex + 1);
            updateOpiniones();
        });
    }

    // Loader visual para búsqueda
    let loader;
    if (carouselTrack) {
        loader = document.createElement('div');
        loader.className = 'search-loader';
        loader.style.display = 'none';
        loader.innerHTML = '<span class="loader"></span>';
        carouselTrack.parentNode.insertBefore(loader, carouselTrack);
    }

    // 1. Funcionalidad de búsqueda real mejorada
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm ? searchForm.querySelector('input') : null;
    let noResultsMsg;
    if (carouselTrack) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.textContent = 'No se encontraron restaurantes.';
        noResultsMsg.style.display = 'none';
        noResultsMsg.style.margin = '24px auto';
        noResultsMsg.style.color = '#e63946';
        noResultsMsg.style.fontWeight = 'bold';
        carouselTrack.parentNode.appendChild(noResultsMsg);
    }

    // Botón limpiar búsqueda/filtros
    let clearBtn;
    if (searchForm) {
        clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.textContent = 'Limpiar';
        clearBtn.className = 'clear-btn';
        clearBtn.style.marginLeft = '10px';
        searchForm.appendChild(clearBtn);
    }

    // NUEVA barra de búsqueda de restaurantes por nombre
    const restaurantSearchForm = document.querySelector('.restaurant-search-bar');
    const restaurantSearchInput = restaurantSearchForm ? restaurantSearchForm.querySelector('input') : null;
    let restaurantClearBtn;
    let restaurantLoader;
    let restaurantNoResultsMsg;

    if (carouselTrack) {
        restaurantLoader = document.createElement('div');
        restaurantLoader.className = 'search-loader';
        restaurantLoader.style.display = 'none';
        restaurantLoader.innerHTML = '<span class="loader"></span>';
        carouselTrack.parentNode.insertBefore(restaurantLoader, carouselTrack);

        restaurantNoResultsMsg = document.createElement('div');
        restaurantNoResultsMsg.textContent = 'No se encontraron restaurantes.';
        restaurantNoResultsMsg.style.display = 'none';
        restaurantNoResultsMsg.style.margin = '24px auto';
        restaurantNoResultsMsg.style.color = '#e63946';
        restaurantNoResultsMsg.style.fontWeight = 'bold';
        carouselTrack.parentNode.appendChild(restaurantNoResultsMsg);
    }

    if (restaurantSearchForm) {
        restaurantClearBtn = document.createElement('button');
        restaurantClearBtn.type = 'button';
        restaurantClearBtn.textContent = 'Limpiar';
        restaurantClearBtn.className = 'clear-btn';
        restaurantClearBtn.style.marginLeft = '10px';
        restaurantSearchForm.appendChild(restaurantClearBtn);
    }

    // Estado de filtros
    let activeCategories = new Set();

    function filterAndSearch() {
        if (!carouselTrack) return;
        restaurantLoader.style.display = 'block';
        setTimeout(() => {
            const query = restaurantSearchInput.value.trim().toLowerCase();
            let found = false;
            Array.from(carouselTrack.children).forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const cat = card.dataset.category;
                // Si hay categorías activas, filtra por ellas (multi-selección)
                const catMatch = activeCategories.size === 0 || activeCategories.has(cat);
                const searchMatch = (name.includes(query) || query === '');
                const show = catMatch && searchMatch;
                card.style.opacity = show ? '1' : '0';
                setTimeout(() => { card.style.display = show ? '' : 'none'; }, show ? 0 : 300);
                if (show) found = true;
            });
            restaurantNoResultsMsg.style.display = found ? 'none' : '';
            restaurantLoader.style.display = 'none';
        }, 350); // Simula tiempo de búsqueda
    }

    if (restaurantSearchForm && restaurantSearchInput && carouselTrack) {
        restaurantSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterAndSearch();
        });
        restaurantClearBtn.addEventListener('click', function() {
            restaurantSearchInput.value = '';
            activeCategories.clear();
            document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
            filterAndSearch();
        });
    }

    // 2. Filtrado por categorías con selección múltiple y botón activo
    const categoryButtons = document.querySelectorAll('.cat-btn');
    if (carouselTrack) {
        Array.from(carouselTrack.children).forEach(card => {
            const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
            if (name.includes('goiko')) card.dataset.category = 'burgers';
            else if (name.includes('carvalho')) card.dataset.category = 'pizza';
            else if (name.includes('cobos')) card.dataset.category = 'sushi';
            else if (name.includes('restaurante')) card.dataset.category = 'mexicana';
            // Puedes ajustar las categorías según tus datos
        });
        categoryButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
            btn.addEventListener('click', () => {
                const cat = btn.textContent.trim().toLowerCase();
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                    activeCategories.delete(cat);
                } else {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                    activeCategories.add(cat);
                }
                filterAndSearch();
            });
        });
    }

    // Input de ubicación (solo muestra alerta, no filtra restaurantes)
    const locationForm = document.querySelector('.location-bar');
    const locationInput = locationForm ? locationForm.querySelector('input') : null;
    if (locationForm && locationInput) {
        locationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const location = locationInput.value.trim();
            const confirmationMessage = document.getElementById('confirmation-message');
            const confirmationText = document.getElementById('confirmation-text');
            const confirmationClose = document.getElementById('confirmation-close');

            if (location) {
                confirmationText.textContent = `Ubicación guardada: ${location}`;
                confirmationMessage.classList.add('visible');

                // Oculta el mensaje automáticamente después de 5 segundos
                setTimeout(() => {
                    confirmationMessage.classList.remove('visible');
                }, 5000);
            } else {
                confirmationText.textContent = 'Por favor, ingresa una ubicación válida.';
                confirmationMessage.classList.add('visible');

                // Oculta el mensaje automáticamente después de 5 segundos
                setTimeout(() => {
                    confirmationMessage.classList.remove('visible');
                }, 5000);
            }

            // Permite cerrar el mensaje manualmente
            confirmationClose.addEventListener('click', () => {
                confirmationMessage.classList.remove('visible');
            });
        });
    }

    // 3. Animación de apertura/cierre del menú móvil
    if (toggle && links) {
        toggle.addEventListener('click', () => {
            links.style.transition = 'max-height 0.4s cubic-bezier(0.4,0,0.2,1)';
            if (navbar.classList.contains('active')) {
                links.style.maxHeight = '0';
            } else {
                links.style.maxHeight = links.scrollHeight + 'px';
            }
        });
    }

    // Mejora: Agregar funcionalidad para cerrar el menú móvil al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        const isClickInsideNavbar = navbar.contains(event.target);
        const isClickOnToggle = toggle.contains(event.target);
        if (!isClickInsideNavbar && !isClickOnToggle && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            links.style.maxHeight = '0';
        }
    });

    // 4. Scroll automático en sliders
    let opAutoScroll = setInterval(() => {
        if (!opinionesTrack) return;
        opIndex = (opIndex + 1) % opinionCards.length;
        showOpinion(opIndex);
    }, 5000);
    opinionesTrack?.addEventListener('mouseenter', () => clearInterval(opAutoScroll));
    opinionesTrack?.addEventListener('mouseleave', () => {
        opAutoScroll = setInterval(() => {
            opIndex = (opIndex + 1) % opinionCards.length;
            showOpinion(opIndex);
        }, 5000);
    });

    // Mejora: Agregar soporte para navegación con teclado en el carrusel de destacados
    [prevBtn, nextBtn].forEach((btn) => {
        if (btn) {
            btn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    btn.click();
                }
            });
        }
    });

    // Mejora: Agregar soporte para navegación con teclado en el slider de opiniones
    [opPrev, opNext].forEach((btn) => {
        if (btn) {
            btn.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    btn.click();
                }
            });
        }
    });

    // 5. Modal de registro/inicio de sesión
    function createModal(type) {
        let modal = document.createElement('div');
        modal.className = 'modal-bg';
        modal.innerHTML = `
        <div class="modal">
            <button class="modal-close" aria-label="Cerrar">&times;</button>
            <h2>${type === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
            <form class="modal-form">
                <input type="email" placeholder="Correo electrónico" required><br>
                <input type="password" placeholder="Contraseña" required><br>
                ${type === 'register' ? '<input type="text" placeholder="Nombre" required><br>' : ''}
                <button type="submit">${type === 'login' ? 'Entrar' : 'Registrarse'}</button>
            </form>
        </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('.modal-close').onclick = () => modal.remove();
        modal.querySelector('.modal-form').onsubmit = (e) => {
            e.preventDefault();
            alert('¡Simulación de envío!');
            setTimeout(() => modal.remove(), 2000); // Cierra el modal después de 2 segundos
        };
        modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    }
    document.querySelector('.btn-outline')?.addEventListener('click', e => { e.preventDefault(); createModal('register'); });
    document.querySelector('.btn-primary')?.addEventListener('click', e => { e.preventDefault(); createModal('login'); });

    // Mejora: Agregar un mensaje de confirmación al enviar el formulario de ubicación
    if (locationForm && locationInput) {
        locationForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const location = locationInput.value.trim();
            const confirmationMessage = document.getElementById('confirmation-message');
            const confirmationText = document.getElementById('confirmation-text');
            const confirmationClose = document.getElementById('confirmation-close');

            if (location) {
                confirmationText.textContent = `Ubicación guardada: ${location}`;
                confirmationMessage.classList.add('visible');

                // Oculta el mensaje automáticamente después de 5 segundos
                setTimeout(() => {
                    confirmationMessage.classList.remove('visible');
                }, 5000);
            } else {
                confirmationText.textContent = 'Por favor, ingresa una ubicación válida.';
                confirmationMessage.classList.add('visible');

                // Oculta el mensaje automáticamente después de 5 segundos
                setTimeout(() => {
                    confirmationMessage.classList.remove('visible');
                }, 5000);
            }

            // Permite cerrar el mensaje manualmente
            confirmationClose.addEventListener('click', () => {
                confirmationMessage.classList.remove('visible');
            });
        });
    }

    // Mejora: Agregar un indicador visual de progreso en el slider de opiniones
    const opinionProgress = document.createElement('div');
    opinionProgress.className = 'opinion-progress';
    opinionProgress.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 4px;
        background: var(--primary);
        transition: width 5s linear;
    `;
    opinionesTrack?.parentNode.appendChild(opinionProgress);

    function showOpinion(index) {
        updateOpiniones();
        opinionProgress.style.width = `${((index + 1) / opinionCards.length) * 100}%`;
    }

    // 6. Accesibilidad básica
    // Roles ARIA para sliders
    carouselTrack?.setAttribute('role', 'list');
    Array.from(carouselTrack?.children || []).forEach(card => card.setAttribute('role', 'listitem'));
    opinionesTrack?.setAttribute('role', 'list');
    Array.from(opinionCards).forEach(card => card.setAttribute('role', 'listitem'));
    // Navegación con teclado en sliders
    [prevBtn, nextBtn, opPrev, opNext].forEach(btn => {
        if (btn) btn.setAttribute('tabindex', '0');
    });

    // Cierra el menú móvil al hacer clic en un enlace (mejora UX móvil)
    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 900 && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                links.style.maxHeight = '0';
            }
        });
    });

    // Crear mensaje de "No hay restaurantes disponibles"
    const noRestaurantsMsg = document.createElement('div');
    noRestaurantsMsg.className = 'no-restaurants-msg';
    noRestaurantsMsg.textContent = 'No hay restaurantes disponibles.';
    noRestaurantsMsg.style.cssText = `
        display: none;
        margin: 24px auto;
        color: #e63946;
        font-weight: bold;
        font-size: 1.2em;
    `;
    carouselTrack?.parentNode.insertBefore(noRestaurantsMsg, carouselTrack);
});
