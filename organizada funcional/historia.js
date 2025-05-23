document.addEventListener('DOMContentLoaded', () => {
    // Inicializa AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        easing: 'ease-in-out'
    });

    // Animação da Timeline
    const timelineItems = document.querySelectorAll('.timeline-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => observer.observe(item));

    // Contagem animada dos stats
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = +stat.getAttribute('data-count');
        const duration = 2000;
        const step = target / (duration / 10);

        let count = 0;
        const updateCount = () => {
            if(count < target) {
                count += step;
                stat.textContent = Math.ceil(count);
                requestAnimationFrame(updateCount);
            } else {
                stat.textContent = target;
            }
        }
        
        gsap.from(stat, {
            opacity: 0,
            y: 20,
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                onEnter: updateCount
            }
        });
    });

    // Parallax Effect
    window.addEventListener('scroll', () => {
        const parallax = document.querySelector('.parallax');
        const scrolled = window.pageYOffset;
        parallax.style.backgroundPositionY = (scrolled * 0.5) + 'px';
    });

    // Hover 3D nos cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${(y - rect.height/2) / 20}deg)
                rotateY(${-(x - rect.width/2) / 20}deg)
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
});