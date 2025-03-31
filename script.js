// Get all necessary elements
const searchInput = document.querySelector('.search-input');
const sortDropdown = document.querySelector('.sort-dropdown');
const categoryDropdown = document.querySelector('.category-dropdown');
const cardHolder = document.querySelector('.card-holder-1');
const cards = document.querySelectorAll('.card');

// Store original order of cards
let originalCards = Array.from(cards);

// Get modal elements
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalCategory = document.getElementById('modal-category');
const modalPrice = document.getElementById('modal-price');
const closeModal = document.querySelector('.close-modal');

// Function to highlight text
function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    
    const text = element.textContent;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>');
}

// Function to remove highlights
function removeHighlights(element) {
    const text = element.textContent;
    element.innerHTML = text;
}

// Function to filter cards based on search term and category
function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryDropdown.value;
    
    cards.forEach(card => {
        const title = card.querySelector('h4');
        const description = card.querySelector('p');
        const cardCategory = card.classList[1]; // Get the category class
        
        const titleText = title.textContent.toLowerCase();
        const descriptionText = description.textContent.toLowerCase();
        
        const matchesSearch = titleText.includes(searchTerm) || descriptionText.includes(searchTerm);
        const matchesCategory = !selectedCategory || cardCategory === selectedCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = '';
            if (searchTerm) {
                highlightText(title, searchTerm);
                highlightText(description, searchTerm);
            } else {
                removeHighlights(title);
                removeHighlights(description);
            }
        } else {
            card.style.display = 'none';
            removeHighlights(title);
            removeHighlights(description);
        }
    });
}

// Search functionality
searchInput.addEventListener('input', filterCards);

// Category filter functionality
categoryDropdown.addEventListener('change', filterCards);

// Sort functionality
sortDropdown.addEventListener('change', function(e) {
    const sortValue = e.target.value;
    const cardsArray = Array.from(cards).filter(card => card.style.display !== 'none');
    
    cardsArray.sort((a, b) => {
        switch(sortValue) {
            case 'price-low-high':
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceA - priceB;
                
            case 'price-high-low':
                const priceHighA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceHighB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                return priceHighB - priceHighA;
                
            case 'name-a-z':
                const nameA = a.querySelector('h4').textContent;
                const nameB = b.querySelector('h4').textContent;
                return nameA.localeCompare(nameB);
                
            case 'name-z-a':
                const nameZA = a.querySelector('h4').textContent;
                const nameZB = b.querySelector('h4').textContent;
                return nameZB.localeCompare(nameZA);
                
            default:
                return 0;
        }
    });
    
    // Clear and re-append sorted cards
    cardHolder.innerHTML = '';
    cardsArray.forEach(card => cardHolder.appendChild(card));
});

// Function to open modal
function openModal(card) {
    // Get card details
    const img = card.querySelector('img');
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    const category = card.querySelector('.category').textContent;
    const price = card.querySelector('.price').textContent;

    // Set modal content
    modalImage.src = img.src;
    modalImage.alt = img.alt;
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalCategory.textContent = category;
    modalPrice.textContent = price;

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

// Function to close modal
function closeModalFunction() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
}

// Close modal when clicking the X button
closeModal.addEventListener('click', closeModalFunction);

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModalFunction();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        closeModalFunction();
    }
});
