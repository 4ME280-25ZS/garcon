// Minimální JavaScript - jen pro kopírování kontaktů
document.addEventListener('DOMContentLoaded', function() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    // Přidej tooltip při hoveru na email a telefon
    [...emailLinks, ...phoneLinks].forEach(link => {
        link.title = 'Klikni pro kontakt';
    });
});

console.log('Digitální vizitka načtena! 📇');
