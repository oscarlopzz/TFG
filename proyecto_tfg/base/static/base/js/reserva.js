// Navbar toggle functionality
const navbarToggle = document.querySelector('.navbar-toggle');
const navbar = document.querySelector('.navbar');

navbarToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// "Ver más" button functionality
const galleryMoreButton = document.querySelector('.image-gallery-more');
galleryMoreButton.addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" aria-label="Cerrar">&times;</span>
            <img src="../../Imagenes/sushi3.jpg" alt="Imagen adicional de sushi">
            <img src="../../Imagenes/sushi4.jpg" alt="Imagen adicional de sushi">
        </div>
    `;
    document.body.appendChild(modal);

    const closeModal = modal.querySelector('.modal-close');
    closeModal.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
});

// Dynamic calendar generation with month and year navigation
const calendarContainer = document.querySelector('.calendar');
const currentDate = new Date();
let calendarMonth = currentDate.getMonth();
let calendarYear = currentDate.getFullYear();

const calendarTitle = document.querySelector('.calendar-title');
const prevMonthButton = document.querySelector('.prev-month');
const nextMonthButton = document.querySelector('.next-month');

function updateCalendarTitle(month, year) {
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    calendarTitle.textContent = `${monthNames[month]} de ${year}`;
}

function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarContainer = document.querySelector('.calendar');
    calendarContainer.innerHTML = `
        <span class="day-header">lun</span>
        <span class="day-header">mar</span>
        <span class="day-header">mié</span>
        <span class="day-header">jue</span>
        <span class="day-header">vie</span>
        <span class="day-header">sáb</span>
        <span class="day-header">dom</span>
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarContainer.innerHTML += `<span></span>`;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const isPast = dayDate < currentDate.setHours(0, 0, 0, 0);
        const dayClass = isPast ? 'day disabled' : 'day';

        calendarContainer.innerHTML += `<span class="${dayClass}">${day}</span>`;
    }

    attachDayClickHandlers();
}

function attachDayClickHandlers() {
    const calendarDays = document.querySelectorAll('.calendar .day:not(.disabled)');
    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            document.querySelector('.calendar .day.selected')?.classList.remove('selected');
            day.classList.add('selected');
            const dayNumber = parseInt(day.textContent, 10);
            updateAvailableHours(new Date(calendarYear, calendarMonth, dayNumber));
        });
    });
}

prevMonthButton.addEventListener('click', () => {
    calendarMonth--;
    if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
    }
    updateCalendarTitle(calendarMonth, calendarYear);
    generateCalendar(calendarMonth, calendarYear);
});

nextMonthButton.addEventListener('click', () => {
    calendarMonth++;
    if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
    }
    updateCalendarTitle(calendarMonth, calendarYear);
    generateCalendar(calendarMonth, calendarYear);
});

updateCalendarTitle(calendarMonth, calendarYear);
generateCalendar(calendarMonth, calendarYear);

// Update available hours based on the selected day
function updateAvailableHours(selectedDate) {
    const hourSelect = document.querySelector('.reservation-section select:nth-of-type(1)');
    const currentHour = currentDate.getHours();
    const isToday = selectedDate.toDateString() === currentDate.toDateString();

    // Clear existing options
    hourSelect.innerHTML = '';

    // Add available hours
    const hours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    hours.forEach(hour => {
        if (!isToday || hour > currentHour) {
            const option = document.createElement('option');
            option.value = `${hour}:30`;
            option.textContent = `${hour}:30`;
            hourSelect.appendChild(option);
        }
    });

    // If no hours are available
    if (!hourSelect.options.length) {
        const noOption = document.createElement('option');
        noOption.textContent = 'No hay horas disponibles';
        noOption.disabled = true;
        hourSelect.appendChild(noOption);
    }
}

// Populate people selection (1 to 50)
const peopleSelect = document.querySelector('.reservation-section select:nth-of-type(2)');
for (let i = 1; i <= 50; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    peopleSelect.appendChild(option);
}

// Restrict reservation code input to 8 digits
const reservationCodeInput = document.querySelector('.reservation-section input[type="text"]');
reservationCodeInput.addEventListener('input', () => {
    reservationCodeInput.value = reservationCodeInput.value.slice(0, 8).replace(/[^0-9]/g, '');
});

// Reservation confirmation functionality
const reservationButton = document.querySelector('.reservation-section .btn-primary');
reservationButton.addEventListener('click', () => {
    const selectedDay = document.querySelector('.calendar .day.selected');
    const selectedHour = document.querySelector('.reservation-section select:nth-of-type(1)').value;
    const selectedPeople = document.querySelector('.reservation-section select:nth-of-type(2)').value;
    const reservationCode = document.querySelector('.reservation-section input[type="text"]').value;

    if (!selectedDay || !selectedHour || !selectedPeople) {
        alert('Por favor, complete todos los campos obligatorios antes de reservar.');
        return;
    }

    if (reservationCode && reservationCode.length !== 8) {
        alert('El código promocional debe tener exactamente 8 dígitos si se ingresa.');
        return;
    }

    const confirmationModal = document.createElement('div');
    confirmationModal.classList.add('modal');
    confirmationModal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" aria-label="Cerrar">&times;</span>
            <h2>Reserva Confirmada</h2>
            <p>Día: ${selectedDay.textContent}/${calendarMonth + 1}/${calendarYear}</p>
            <p>Hora: ${selectedHour}</p>
            <p>Personas: ${selectedPeople}</p>
            ${reservationCode ? `<p>Código Promocional: ${reservationCode}</p>` : ''}
        </div>
    `;
    document.body.appendChild(confirmationModal);

    const closeModal = confirmationModal.querySelector('.modal-close');
    closeModal.addEventListener('click', () => {
        confirmationModal.remove();
    });

    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) confirmationModal.remove();
    });
});

// Highlight the current day
generateCalendar(calendarMonth, calendarYear);

// "Valorar" button functionality
const rateButton = document.querySelector('.rate-button');
rateButton.addEventListener('click', () => {
    alert('Gracias por valorar este restaurante.');
});

// Favorite heart functionality
const heartIcon = document.querySelector('.heart-icon');
heartIcon.addEventListener('click', () => {
    heartIcon.classList.toggle('favorited');
});
