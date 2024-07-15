---
permalink: /photography/
layout: single
author_profile: false
---

<div class="container">
<!-- Filter Buttons -->
<div class="filter-buttons">
        <button onclick="filterPortfolio('places')">Places</button>
        <!-- <button onclick="filterPortfolio('people')">People</button> -->
        <!-- <button onclick="filterPortfolio('animals')">Animals</button> -->
        <button onclick="filterPortfolio('things')">Things</button>
</div>

<div class="portfolio-section">
            <div class="portfolio lightbox-portfolio" id="portfolio">
                <!-- Portfolio items will be dynamically inserted here -->
            </div>
</div>

<!-- Modal -->
<div id="myModal" class="custom-modal" onclick="closeModal(event)">
        <span class="prev" onclick="changeSlide(-1)">&#10094;</span>
        <span class="next" onclick="changeSlide(1)">&#10095;</span>
        <span class="close" onclick="closeModal(event)">&times;</span>
        <div class="custom-modal-content" onclick="event.stopPropagation()">
            <img id="modal-image" src="">
            <div id="modal-caption" class="custom-modal-caption">
                <div class="modal-title"></div>
                <div class="modal-description"></div>         
            </div>
        </div>
</div>

<script>
    const apiKey = 'bf211338ce87cec202a72defdd2e112b'; // Replace with your Flickr API key
    const userId = '201018555@N05'; // Replace with your Flickr user ID
    let currentIndex = 0;
    let photos = [];
    async function fetchPhotosets() {
            const url = `https://www.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${apiKey}&user_id=${userId}&format=json&nojsoncallback=1`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.stat === 'ok' && data.photosets && data.photosets.photoset) {
                    return data.photosets.photoset;
                } else {
                    console.error('Failed to fetch photosets:', data.message);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching photosets:', error);
                return [];
            }
    }
    async function fetchPhotos(photosetId) {
            const url = `https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${apiKey}&photoset_id=${photosetId}&user_id=${userId}&format=json&nojsoncallback=1&extras=url_h,url_z,url_s,description`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.stat === 'ok' && data.photoset && data.photoset.photo) {
                    return data.photoset.photo;
                } else {
                    console.error('Failed to fetch photos:', data.message);
                    return [];
                }
            } catch (error) {
                console.error('Error fetching photos:', error);
                return [];
            }
    }
    async function renderPortfolio() {
        const photosets = await fetchPhotosets();
        const portfolioContainer = document.getElementById('portfolio');
        for (const photoset of photosets) {
            const photosFromSet = await fetchPhotos(photoset.id);
            photos = photos.concat(photosFromSet);
            for (const photo of photosFromSet) {
                const portfolioItem = document.createElement('div');
                portfolioItem.className = `portfolio-item ${photoset.title._content.toLowerCase()}`;
                portfolioItem.innerHTML = `
                            <img src="${photo.url_z}" alt="${photo.title}" data-large="${photo.url_h}" data-title="${photo.title}" data-description="${photo.description._content}" onclick="openModal(this, ${photos.indexOf(photo)})" loading="lazy" onerror="this.onerror=null; this.src='default.jpg';">
                        </a>
                    `;
                portfolioContainer.appendChild(portfolioItem);
            }
        }
        // Lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        });
    }
    function filterPortfolio(category) {
        const items = document.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            if (category === 'all' || item.classList.contains(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    function openModal(img, index) {
        currentIndex = index;
        const modal = document.getElementById('myModal');
        const modalImg = document.getElementById('modal-image');
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-description');
        const masthead = document.querySelector('.masthead');
        const pagefooter = document.getElementById('footer');
        if (modal && modalImg) {
            modal.style.display = 'block';
            modalImg.src = img.dataset.large;
            setModalPadding(modalImg);
            modalTitle.innerHTML = img.dataset.title;
            modalDescription.innerHTML = img.dataset.description;
            if (masthead && pagefooter) {
                masthead.style.zIndex = '0';
                pagefooter.style.zIndex = '-1';
            }
        } else {
            console.error('Modal elements not found.');
        }
        // Add event listener for keyboard navigation
        document.addEventListener('keydown', handleKeydown);
    }
    function closeModal(event) {
        const modal = document.getElementById('myModal');
        const masthead = document.querySelector('.masthead');
        if(modal || event.target.id === 'myModal') {
            const pagefooter = document.getElementById('footer');
            if (modal) {
                modal.style.display = 'none';
                if (masthead && pagefooter) {
                    masthead.style.zIndex = '20';
                    pagefooter.style.zIndex = '20';
                }
            } else {
                console.error('Modal element not found.');
            }
            // Remove event listener for keyboard navigation
            document.removeEventListener('keydown', handleKeydown);
        }
    }
    function changeSlide(direction) {
        event.stopPropagation();
        currentIndex += direction;
        if (currentIndex < 0) {
            currentIndex = photos.length - 1;
        } else if (currentIndex >= photos.length) {
            currentIndex = 0;
        }
        const modalImg = document.getElementById('modal-image');
        const modalTitle = document.querySelector('.modal-title');
        const modalDescription = document.querySelector('.modal-description');
        modalImg.src = photos[currentIndex].url_h;
        setModalPadding(modalImg);
        modalTitle.innerHTML = photos[currentIndex].title;
        modalDescription.innerHTML = photos[currentIndex].description._content;
    }
    function setModalPadding(img) {
            img.onload = function () {
                const modal = document.getElementById('myModal');
                const caption = document.querySelector('.custom-modal-caption');
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                const modalWidth = modal.clientWidth - 80; // Subtracting 40px padding from both sides
                const modalHeight = modal.clientHeight - 160; // Subtracting 40px padding from top and bottom

                let paddingTop, paddingSides;
                if (modalWidth / aspectRatio <= modalHeight) {
                    paddingSides = 40; // Minimum horizontal padding
                    paddingTop = (modalHeight - (modalWidth / aspectRatio)) / 2;
                } else {
                    paddingTop = 80; // Minimum vertical padding
                    paddingSides = (modalWidth - (modalHeight * aspectRatio)) / 2;
                }

                modal.style.padding = `${paddingTop}px ${paddingSides}px`;
                imgWidth = img.offsetWidth;
                caption.style.width = `${imgWidth}px`;
            };
    }
    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            filterPortfolio(hash);
        } else {
            filterPortfolio('places');
        }
    }

    function handleKeydown(event) {

        if (event.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (event.key === 'ArrowRight') {
            changeSlide(1);
        } else if(event.key === 'Escape') {
            const modal = document.getElementById('myModal');
            closeModal({ target: modal });
        }
    }
    // Initialize with showing places
    document.addEventListener('DOMContentLoaded', function() {
        renderPortfolio().then(() => handleHashChange());
    });

    window.addEventListener('hashchange', handleHashChange);
</script>