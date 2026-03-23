// ===== CONFIGURACIÓN =====
const CONFIG = {
    // 🔴 ¡IMPORTANTE! CAMBIA ESTE NÚMERO POR TU WHATSAPP REAL
    adminWhatsapp: "5215551234567", // Ejemplo México: 521 + 10 dígitos
    
    eventTitle: "Primera Comunión - Ximena Morán Vaquero",
    eventDate: "20260425T130000",
    eventEnd: "20260425T180000",
    eventLocation: "Parroquia de San Francisco de Asís, S. Juan de Aragón 53, Nezahualcóyotl",
    eventDetails: "Ceremonia religiosa a las 13:00 hrs. Recepción en Rio Blanco 101, Col. José Vicente Villada, Nezahualcóyotl, Edo. Méx.",
    
    maps: {
        church: "https://maps.app.goo.gl/9v51MvW3mRwUNvQe8",
        house: "https://maps.app.goo.gl/E6y12i9pdHkCctSf9"
    }
};

// ===== GESTIÓN DE CONFIRMACIONES =====
let confirmations = [];

function loadConfirmations() {
    const saved = localStorage.getItem('comunion_confirmations');
    if (saved) {
        confirmations = JSON.parse(saved);
    }
}

function saveConfirmations() {
    localStorage.setItem('comunion_confirmations', JSON.stringify(confirmations));
}

function addConfirmation(name, count, message) {
    const newConfirm = {
        id: Date.now(),
        name: name.trim(),
        count: parseInt(count),
        message: message.trim(),
        date: new Date().toLocaleString('es-MX')
    };
    confirmations.unshift(newConfirm);
    saveConfirmations();
    return newConfirm;
}

function sendWhatsAppNotification(name, count, message) {
    const peopleText = count === 1 ? "1 persona" : `${count} personas`;
    
    let whatsappMsg = `🎉 *NUEVA CONFIRMACIÓN* 🎉%0A%0A`;
    whatsappMsg += `👤 *Invitado:* ${name}%0A`;
    whatsappMsg += `👥 *Asistentes:* ${peopleText}%0A`;
    whatsappMsg += `📅 *Evento:* Primera Comunión de Ximena%0A`;
    whatsappMsg += `📍 *Fecha:* Sábado 25 de abril a las 13:00 hrs%0A`;
    
    if (message) {
        whatsappMsg += `💬 *Mensaje:* "${message}"%0A`;
    }
    
    whatsappMsg += `%0A✨ *¡Gracias por confirmar!* ✨`;
    
    const url = `https://wa.me/${CONFIG.adminWhatsapp}?text=${whatsappMsg}`;
    window.open(url, '_blank');
}

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    
    AOS.init({
        duration: 1000,
        once: false,
        offset: 80,
        easing: 'ease-out-quad',
        mirror: true
    });
    
    loadConfirmations();
    
    // ===== MODAL =====
    const modal = document.getElementById('rsvpModal');
    const openModalBtn = document.getElementById('openRsvpModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const rsvpForm = document.getElementById('rsvpForm');
    const modalMessage = document.getElementById('rsvpModalMessage');
    
    if (openModalBtn) {
        openModalBtn.addEventListener('click', function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        if (rsvpForm) rsvpForm.reset();
        if (modalMessage) {
            modalMessage.className = 'rsvp-status-modal';
            modalMessage.textContent = '';
        }
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(e) {
        if (modal && modal.classList.contains('show')) {
            if (e.target === modal) {
                closeModal();
            }
        }
    });
    
    // ===== FORMULARIO =====
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('guestName').value;
            const count = document.getElementById('guestCount').value;
            const message = document.getElementById('guestMessage').value;
            
            if (!name) {
                modalMessage.textContent = 'Por favor, ingresa tu nombre o el de tu familia';
                modalMessage.className = 'rsvp-status-modal error';
                return;
            }
            
            addConfirmation(name, count, message);
            
            modalMessage.textContent = '✅ ¡Confirmación enviada! Gracias por acompañarnos.';
            modalMessage.className = 'rsvp-status-modal success';
            
            sendWhatsAppNotification(name, count, message);
            
            rsvpForm.reset();
            
            setTimeout(() => {
                closeModal();
            }, 2000);
        });
    }
    
    // ===== RECORDATORIO =====
    const reminderBtn = document.getElementById('reminderBtn');
    const reminderMessage = document.getElementById('reminderMessage');
    
    function showReminderMessage(text) {
        if (reminderMessage) {
            const msgSpan = reminderMessage.querySelector('span');
            if (msgSpan) msgSpan.textContent = text;
            reminderMessage.classList.add('show');
            setTimeout(() => {
                reminderMessage.classList.remove('show');
            }, 5000);
        }
    }
    
    if (reminderBtn) {
        reminderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
            
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Ximena Comunion//ES',
                'BEGIN:VEVENT',
                `UID:${Date.now()}@ximena-comunion`,
                `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
                `DTSTART:${CONFIG.eventDate.replace(/[-:]/g, '')}`,
                `DTEND:${CONFIG.eventEnd.replace(/[-:]/g, '')}`,
                `SUMMARY:${CONFIG.eventTitle}`,
                `LOCATION:${CONFIG.eventLocation}`,
                `DESCRIPTION:${CONFIG.eventDetails}`,
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\n');
            
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            if (isIOS) {
                const encodedData = encodeURIComponent(icsContent);
                window.location.href = `data:text/calendar;charset=utf8,${encodedData}`;
                setTimeout(() => {
                    showReminderMessage("¡Evento agregado a tu calendario!");
                }, 500);
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'comunion_ximena.ics';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showReminderMessage("¡Archivo descargado! Ábrelo para agregar a tu calendario.");
            }
        });
    }
    
    // ===== MAPAS =====
    const mapButtons = document.querySelectorAll('.map-btn');
    mapButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const mapType = this.getAttribute('data-map');
            const url = CONFIG.maps[mapType];
            if (url) {
                window.open(url, '_blank');
                showReminderMessage("Abriendo Google Maps");
            }
        });
    });
    
    // ===== PARALLAX =====
    const bgImage = document.querySelector('.bg-image');
    if (bgImage) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            const moveX = (mouseX - 0.5) * 12;
            const moveY = (mouseY - 0.5) * 12;
            bgImage.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
        });
    }
    
    // ===== PARTÍCULAS =====
    function adjustParticles() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            const size = Math.random() * 70 + 25;
            const left = Math.random() * 100;
            const duration = Math.random() * 18 + 10;
            const delay = Math.random() * 12;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
        });
    }
    adjustParticles();
    
    // Animación entrada
    const card = document.querySelector('.invitation-card');
    if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }
});