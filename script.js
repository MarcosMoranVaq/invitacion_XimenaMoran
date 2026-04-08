// Inicializar AOS
AOS.init({
    once: true,
    duration: 800,
    easing: 'ease-in-out'
});

// Modal RSVP
const modal = document.getElementById('rsvpModal');
const openModalBtn = document.getElementById('openRsvpModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const rsvpForm = document.getElementById('rsvpForm');
const rsvpModalMessage = document.getElementById('rsvpModalMessage');

const TU_NUMERO_WHATSAPP = "525652364122";  // <--- CAMBIA AQUÍ
// ============================================

// Abrir modal
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        if (rsvpModalMessage) rsvpModalMessage.innerHTML = '';
        if (rsvpForm) rsvpForm.reset();
    });
}

// Cerrar modal
function closeModal() {
    modal.style.display = 'none';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Cerrar al hacer clic fuera del modal
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Manejar el envío del formulario - ENVÍO A WHATSAPP
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener valores
        const guestName = document.getElementById('guestName')?.value.trim() || '';
        const guestCountSelect = document.getElementById('guestCount');
        const guestCount = guestCountSelect?.options[guestCountSelect.selectedIndex]?.text || '';
        const guestMessage = document.getElementById('guestMessage')?.value.trim() || '';
        
        // Validaciones
        if (!guestName) {
            mostrarMensajeModal('❌ Por favor, escribe el nombre del invitado o familia.', 'error');
            return;
        }
        
        // Construir mensaje para WhatsApp
        let mensajeWhatsApp = `🎉 *CONFIRMACIÓN DE ASISTENCIA - XIMENA* 🎉%0A%0A`;
        mensajeWhatsApp += `*👤 Nombre:* ${guestName}%0A`;
        mensajeWhatsApp += `*👥 Número de personas:* ${guestCount}%0A`;
        if (guestMessage) {
            mensajeWhatsApp += `*💝 Mensaje:* ${guestMessage}%0A`;
        }
        mensajeWhatsApp += `%0A✨ ¡Gracias por la invitación! ✨`;
        
        // Crear enlace de WhatsApp
        const urlWhatsApp = `https://wa.me/${TU_NUMERO_WHATSAPP}?text=${mensajeWhatsApp}`;
        
        // Abrir WhatsApp
        window.open(urlWhatsApp, '_blank');
        
        // Mostrar mensaje de éxito y cerrar modal
        mostrarMensajeModal('✅ ¡Confirmación enviada! Se abrirá WhatsApp para completar el envío.', 'success');
        
        // Limpiar formulario y cerrar modal después de 2 segundos
        setTimeout(() => {
            rsvpForm.reset();
            closeModal();
        }, 2000);
    });
}

function mostrarMensajeModal(mensaje, tipo) {
    if (rsvpModalMessage) {
        rsvpModalMessage.innerHTML = `<div class="alert-${tipo}">${mensaje}</div>`;
        setTimeout(() => {
            if (rsvpModalMessage) rsvpModalMessage.innerHTML = '';
        }, 3000);
    } else {
        alert(mensaje);
    }
}

// Botón de recordatorio / calendario
const reminderBtn = document.getElementById('reminderBtn');
const reminderMessage = document.getElementById('reminderMessage');

if (reminderBtn) {
    reminderBtn.addEventListener('click', () => {
        const eventDate = new Date(2026, 3, 25, 13, 0, 0); // 25 de abril 2026, 13:00 hrs
        const startDate = eventDate.toISOString().replace(/-|:|\.\d+/g, '');
        const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
        
        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Primera+Comunión+de+Ximena+Morán+Vaquero&dates=${startDate}/${endDate}&details=¡Celebremos+juntos+este+día+especial!+Ceremonia+en+Parroquia+de+San+Francisco+de+Asís,+recepción+en+Río+Blanco+101,+Nezahualcóyotl.&location=Parroquia+de+San+Francisco+de+Asís,+S.+Juan+de+Aragón+53,+Nezahualcóyotl.`;
        
        window.open(calendarUrl, '_blank');
        
        if (reminderMessage) {
            reminderMessage.classList.add('show');
            setTimeout(() => {
                reminderMessage.classList.remove('show');
            }, 3000);
        }
    });
}

// Botones de "Cómo llegar" (mapa)
const mapButtons = document.querySelectorAll('.map-btn');
if (mapButtons.length > 0) {
    mapButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const mapType = btn.getAttribute('data-map');
            let address = '';
            if (mapType === 'church') {
                address = 'S. Juan de Aragón 53, Nezahualcóyotl, Estado de México';
            } else {
                address = 'Rio Blanco 101, Col. José Vicente Villada, Nezahualcóyotl, Estado de México';
            }
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        });
    });
}

// Efecto de partículas (opcional, mejora el movimiento)
const particles = document.querySelectorAll('.particle');
if (particles.length > 0) {
    particles.forEach(particle => {
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const xMovement = Math.random() * 100 - 50;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.transform = `translateX(${xMovement}px)`;
    });
}