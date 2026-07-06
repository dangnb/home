export const setupReveal = () => {
    if (typeof window === 'undefined') return;
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
};
