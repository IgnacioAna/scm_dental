document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation (Enhanced)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Toast Notification Logic
    const ToastSystem = {
        container: null,
        init() {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);

            // Start random notifications after a delay
            setTimeout(() => this.startSimulation(), 4000);
        },

        show(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast-notification ${type}`;

            // Terminal/JSON style content
            const timestamp = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
            toast.innerHTML = `
                <div class="toast-header">
                    <span class="status-dot"></span>
                    <span class="sys-time">[${timestamp}]</span>
                </div>
                <div class="toast-body">
                    <span class="cmd">></span> ${message}
                </div>
            `;

            this.container.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => toast.classList.add('show'));

            // Remove after delay
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 5000);
        },

        startSimulation() {
            const events = [
                "Nueva consulta: Alineadores (Instagram DM)",
                "Evaluación agendada: Alineadores (Jueves 10:00)",
                "Recordatorio enviado — Turno confirmado",
                "Lead calificado: Interesado en alineadores",
                "Handoff a recepción: Lead solicita hablar",
                "Consulta respondida en <15s (Instagram DM)"
            ];

            const randomEvent = () => {
                const msg = events[Math.floor(Math.random() * events.length)];
                this.show(msg, 'success');

                // Schedule next event (random 5-15s)
                setTimeout(randomEvent, Math.random() * 10000 + 5000);
            };

            randomEvent();
        }
    };

    ToastSystem.init();

    // Animated Counters
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                const suffix = counter.getAttribute('data-suffix') || '';
                const prefix = counter.getAttribute('data-prefix') || '';

                let count = 0;
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.innerText = prefix + Math.ceil(count) + suffix;
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = prefix + target + suffix;
                    }
                };

                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
});
