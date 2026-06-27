import "./style.css";

const navbar = document.getElementById('navbar') as HTMLElement;
const triggerZone = document.getElementById('nav-trigger');
const navItems = document.querySelectorAll('.nav-item') as NodeListOf<HTMLElement>;

let lastScrollY = window.scrollY;
let isHovered = false;

// Utility function to trigger the staggered layout movement
function setNavState(hide: boolean) {
    if (hide) {
        // Hide entire navbar wrapper
        navbar.style.transform = 'translateY(-100%)';
        
        // Stagger individual child items upwards out of sight
        navItems.forEach((item, index) => {
            // Left to right disappear sequence: 0ms, 40ms, 80ms, 120ms
            item.style.transitionDelay = `${index * 40}ms`;
            item.style.transform = 'translateY(-30px)';
            item.style.opacity = '0';
        });
    } else {
        // Reveal entire navbar wrapper
        navbar.style.transform = 'translateY(0%)';
        
        // Stagger individual child items gracefully cascading back down
        navItems.forEach((item, index) => {
            // Reverse order or sequential drop-in delay
            item.style.transitionDelay = `${(navItems.length - 1 - index) * 40}ms`;
            item.style.transform = 'translateY(0px)';
            item.style.opacity = '1';
        });
    }
}

// Mouse Hover Intercept Triggers
triggerZone?.addEventListener('mouseenter', () => {
    isHovered = true;
    setNavState(false);
});

triggerZone?.addEventListener('mouseleave', () => {
    isHovered = false;
    if (window.scrollY >= window.innerHeight/2) {
        setNavState(true);
    }
});

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const isFirstPage = currentScrollY < window.innerHeight/2;

    if (isFirstPage) {
        // Keep completely active on the landing fold
        setNavState(false);
    } else if (!isHovered) {
        if (currentScrollY > lastScrollY) {
            // Scrolling down -> Trigger Staggered Hide Action
            setNavState(true);
        } else {
            // Scrolling up -> Trigger Staggered Reveal Action
            setNavState(false);
        }
    }

    lastScrollY = currentScrollY;
}, { passive: true });

// Initialize on page load
setNavState(false);
const slideElement = document.querySelector('.slide-target') as HTMLElement;
const sectionParent = slideElement?.closest('section') || slideElement?.parentElement;

const slideObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25 // Triggers precisely when 25% of the viewport section is visible
};

const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            slideElement.style.transform = 'translateX(128px)';
        } else {
            slideElement.style.transform = 'translateX(0px)';
        }
    });
}, slideObserverOptions);

if (sectionParent) {
    slideObserver.observe(sectionParent);
}

const openMenuBtn = document.getElementById('open-menu');
const closeMenuBtn = document.getElementById('close-menu');
const sidebarMenu = document.getElementById('sidebar-menu') as HTMLElement;
const sidebarBackdrop = document.getElementById('sidebar-backdrop') as HTMLElement;

function toggleMenu(isOpen: boolean) {
    if (isOpen) {
        // Open Sidebar Panel Layer
        sidebarMenu.style.transform = 'translateX(0%)';
        
        // Show Backdrop Fog Shield
        sidebarBackdrop.classList.remove('pointer-events-none');
        sidebarBackdrop.style.opacity = '1';
        
        // Lock main page screen body from scrolling behind panel view
        document.body.style.overflow = 'hidden';
    } else {
        // Hide Sidebar Panel Layer back out to the right boundary
        sidebarMenu.style.transform = 'translateX(100%)';
        
        // Dismiss Backdrop Shield
        sidebarBackdrop.classList.add('pointer-events-none');
        sidebarBackdrop.style.opacity = '0';
        
        // Restore natural scrolling snapping flow grid
        document.body.style.overflow = '';
    }
}

openMenuBtn?.addEventListener('click', () => toggleMenu(true));
closeMenuBtn?.addEventListener('click', () => toggleMenu(false));
sidebarBackdrop?.addEventListener('click', () => toggleMenu(false));

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggleMenu(false);
});
