const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};


// Show Modal, Focus on  Input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal Event listeners
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => { modal.classList.remove('show-modal')});
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false));

// Validate form
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if (!urlValue.match(regex)) {
        alert('Please provide a valid web address');
    }
    // Valid
    return true;
}


// Build Bookmarks DOM
function buildBookmarks() {
    // Remove all bookmark elements
    bookmarksContainer.textContent = '';
    
    // Build items
    Object.keys(bookmarks).forEach((id) => {
       const { name, url } = bookmarks[id];
       
        // Item
        const item = document.createElement('div');
        item.classList.add('item');
        
        // Close Icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onClick', `deleteBookmark('${id}')`);

        // FavIcon / Link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', 'https://img.icons8.com/?size=512&id=dxoYK8bxqiJr&format=png');
        favicon.setAttribute('alt', 'Favicon');
        
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        // Append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
        
    });
}

// Fetch bookmarks
function fetchBookmarks() {
    // Get bookmarks from localStorage if available
    if  (localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
    // Loop through the bookmarks
    if (bookmarks[id]) {
        delete bookmarks[id];
    }
    
    // Update bookmarks array in localStorage, re-populate DOM
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    
    if (!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    
    if (!validate(nameValue, urlValue)) {
        return false;
    }
    
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    
    bookmarks[urlValue] = bookmark;
    
    // Set bookmarks in localStorage, fetch, reset input fields
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    
    fetchBookmarks();
    
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, fetch bookmarks
fetchBookmarks();