const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

const currentYear = document.querySelector('#currentYear');
if (currentYear) currentYear.textContent = new Date().getFullYear();

window.addEventListener('scroll', () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
}, { passive: true });

menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = isOpen
        ? '<span class="sr-only">Close navigation</span><i class="fa-solid fa-xmark"></i>'
        : '<span class="sr-only">Toggle navigation</span><i class="fa-solid fa-bars"></i>';
});

navLinks?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.innerHTML = '<span class="sr-only">Toggle navigation</span><i class="fa-solid fa-bars"></i>';
}));

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

contactForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.classList.remove('error');

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Unable to send form');
        contactForm.reset();
        formStatus.textContent = 'Thanks. Your message is on its way.';
    } catch (error) {
        formStatus.textContent = 'The form could not send right now. Please email me directly.';
        formStatus.classList.add('error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send enquiry <i class="fa-solid fa-arrow-up-right-from-square"></i>';
    }
});
