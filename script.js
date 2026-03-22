// ===== CONFIGURACIÓN DEL EVENTO =====
const CONFIG = {
    eventTitle: "Primera Comunión - Ximena Morán Vaquero",
    eventDate: "20260425T140000",
    eventEnd: "20260425T180000",
    eventLocation: "Parroquia de San Francisco de Asís, S. Juan de Aragón 53, CDMX",
    eventDetails: "Ceremonia religiosa a las 14:00 hrs. Recepción en Rio Blanco 101, Col. José Vicente Villada, Nezahualcóyotl, Edo. Méx.",
    
    maps: {
        church: "https://maps.app.goo.gl/9v51MvW3mRwUNvQe8",
        house: "https://maps.app.goo.gl/E6y12i9pdHkCctSf9"
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar AOS con animaciones más fluidas
    AOS.init({
        duration: 1000,
        once: false,
        offset: 80,
        easing: 'ease-out-quad',
        mirror: true
    });
    
    const reminderBtn = document.getElementById('reminderBtn');
    const confirmMessage = document.getElementById('confirmMessage');
    const mapButtons = document.querySelectorAll('.map-btn');
    
    function showConfirmation(text = "¡Recordatorio agregado a tu calendario!") {
        const msgSpan = confirmMessage.querySelector('span');
        if (msgSpan) msgSpan.textContent = text;
        confirmMessage.classList.add('show');
        setTimeout(() => {
            confirmMessage.classList.remove('show');
        }, 5000);
    }
    
    // Botón recordatorio
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
                    showConfirmation("¡Evento agregado a tu calendario!");
                }, 500);
            } else {
                const link = document.createElement('a');
                link.href = url;
                link.download = 'comunion_ximena.ics';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                showConfirmation("¡Archivo descargado! Ábrelo para agregar a tu calendario.");
            }
        });
    }
    
    // Botones de mapas
    mapButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const mapType = this.getAttribute('data-map');
            const url = CONFIG.maps[mapType];
            if (url) {
                window.open(url, '_blank');
                showConfirmation("Abriendo Google Maps");
            }
        });
    });
    
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
    
    // Parallax
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
    
    // Partículas dinámicas
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
    
    // Scroll reveal adicional
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.section-title, .godparents-section, .family-section, .event-info, .action-buttons').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});