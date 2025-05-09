/**
 * FIFA Club Website JavaScript
 * This file contains all interactive functionality for the FIFA Club website
 * including page initialization, sorting, filtering and UI enhancements
 */

// Main initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize common functionality across all pages
    initCommonFunctionality();
    
    // Page specific initializations based on page elements
    if (document.querySelector('.tournaments-grid')) {
        initTournamentsPage();
    }
    
    if (document.getElementById('schedule-tabs')) {
        initSchedulePage();
    }
    
    if (document.querySelector('.schedule-table')) {
        initStandingsPage();
    }
    
    if (document.getElementById('club-registration')) {
        initRegistrationPage();
    }
    
    // Initialize FIFA news section if present
    if (document.getElementById('fifa-news-section')) {
        initFifaNewsSection();
    }
});

/**
 * Initialize common functionality across all pages
 * - Mobile navigation toggle
 * - Smooth scrolling for anchor links
 * - Active section highlighting
 * - Back to top button
 */
function initCommonFunctionality() {
    // Create mobile navigation toggle button
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-nav-toggle');
    mobileToggle.innerHTML = '☰';
    
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.parentNode.insertBefore(mobileToggle, navbar);
        
        // Toggle navigation menu on mobile
        mobileToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.innerHTML = navbar.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    // Setup smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip certain anchor types
            if (href === '#' || href.startsWith('#/')) {
                return;
            }
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section on scroll
    highlightActiveSection();
    
    // Add back to top button
    createBackToTopButton();
}

/**
 * Initialize the tournaments page functionality
 * - Tournament sorting
 * - Tournament filtering
 */
function initTournamentsPage() {
    const tournamentCards = document.querySelectorAll('.tournament-card');
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    // Setup sorting functionality
    if (sortButtons.length) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sortType = this.getAttribute('data-sort');
                const arrow = this.querySelector('.arrow');
                const isAscending = arrow.textContent === '↓';
                
                // Reset all arrows and update current one
                sortButtons.forEach(btn => btn.querySelector('.arrow').textContent = '↓');
                arrow.textContent = isAscending ? '↑' : '↓';
                
                // Sort tournaments
                sortTournaments(sortType, isAscending);
            });
        });
    }
    
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.classList.add('tournament-filters');
    filterContainer.innerHTML = `
        <label for="filter-tournaments">Filter:</label>
        <select id="filter-tournaments">
            <option value="all">All Tournaments</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Only</option>
        </select>
    `;
    
    // Add filter to page
    const tournamentsSection = document.getElementById('tournaments');
    if (tournamentsSection) {
        const controlsDiv = tournamentsSection.querySelector('.tournament-controls');
        if (controlsDiv) {
            controlsDiv.prepend(filterContainer);
            
            // Add filter change event listener
            document.getElementById('filter-tournaments').addEventListener('change', function() {
                filterTournaments(this.value);
            });
        }
    }
}

/**
 * Sort tournaments based on name or date
 * @param {string} sortType - Type of sorting (name or date)
 * @param {boolean} ascending - Sort order
 */
function sortTournaments(sortType, ascending) {
    const tournamentsGrid = document.querySelector('.tournaments-grid');
    const tournaments = Array.from(tournamentsGrid.querySelectorAll('.tournament-card'));
    
    // Sort tournaments based on criteria
    tournaments.sort((a, b) => {
        if (sortType === 'name') {
            const nameA = a.querySelector('h3').textContent.trim();
            const nameB = b.querySelector('h3').textContent.trim();
            
            return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        } else if (sortType === 'date') {
            const dateA = a.querySelector('p:nth-of-type(1)').textContent.replace('Date:', '').trim();
            const dateB = b.querySelector('p:nth-of-type(1)').textContent.replace('Date:', '').trim();
            
            return ascending ? dateA.localeCompare(dateB) : dateB.localeCompare(dateA);
        }
        return 0;
    });
    
    // Reorder DOM elements based on sort
    tournaments.forEach(tournament => tournamentsGrid.appendChild(tournament));
    
    // Add fade-in animation effect
    tournaments.forEach(tournament => {
        tournament.style.opacity = '0';
        setTimeout(() => {
            tournament.style.transition = 'opacity 0.3s ease-in-out';
            tournament.style.opacity = '1';
        }, 50);
    });
}

/**
 * Filter tournaments (all, upcoming, past)
 * @param {string} filterValue - Filter value
 */
function filterTournaments(filterValue) {
    const upcomingSection = document.getElementById('tournaments');
    const pastSection = document.getElementById('past-tournaments');
    
    if (!upcomingSection || !pastSection) return;
    
    // Show/hide sections based on filter
    if (filterValue === 'all') {
        upcomingSection.style.display = 'block';
        pastSection.style.display = 'block';
    } else if (filterValue === 'upcoming') {
        upcomingSection.style.display = 'block';
        pastSection.style.display = 'none';
    } else if (filterValue === 'past') {
        upcomingSection.style.display = 'none';
        pastSection.style.display = 'block';
    }
}

/**
 * Initialize schedule page functionality
 * - Tab switching
 * - Group selection
 */
function initSchedulePage() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Setup tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Remove active class from all buttons
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Show selected tab content and mark button as active
            document.getElementById(targetId).style.display = 'block';
            this.classList.add('active');
        });
    });
    
    // Auto-click first tab button to show initial content
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
    
    // Add group selector if there are multiple groups
    const groups = document.querySelectorAll('.group-table');
    if (groups.length > 1) {
        const groupSelector = document.createElement('div');
        groupSelector.classList.add('group-selector');
        groupSelector.innerHTML = `
            <label for="group-select">Select Group:</label>
            <select id="group-select">
                <option value="all">All Groups</option>
                <option value="group-a">Group A</option>
                <option value="group-b">Group B</option>
            </select>
        `;
        
        const groupMatchesTab = document.getElementById('group-matches');
        if (groupMatchesTab) {
            groupMatchesTab.insertBefore(groupSelector, groupMatchesTab.querySelector('h4') || groupMatchesTab.firstChild);
            
            // Add group filter change event listener
            document.getElementById('group-select').addEventListener('change', function() {
                const selectedGroup = this.value;
                
                groups.forEach(group => {
                    if (selectedGroup === 'all' || group.id === selectedGroup) {
                        group.style.display = 'block';
                    } else {
                        group.style.display = 'none';
                    }
                });
            });
        }
    }
}

/**
 * Initialize standings page functionality
 * - Last updated timestamp
 * - Player search and filtering
 */
function initStandingsPage() {
    // Update last updated timestamp
    const lastUpdatedSpan = document.getElementById('last-updated');
    if (lastUpdatedSpan) {
        const now = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        lastUpdatedSpan.textContent = now.toLocaleDateString('en-US', options);
    }
    
    const tables = document.querySelectorAll('.schedule-table');
    if (tables.length >= 2) {
        const topPlayersTable = tables[0];
        const standingsTable = tables[1];
        
        if (standingsTable) {
            // Create search container
            const searchContainer = document.createElement('div');
            searchContainer.classList.add('search-container');
            const searchWrapper = document.createElement('div');
            searchWrapper.classList.add('search-wrapper');
            
            // Create search input
            const playerSearchInput = document.createElement('input');
            playerSearchInput.type = 'text';
            playerSearchInput.id = 'player-search';
            playerSearchInput.placeholder = 'Search players by name...';
            
            // Create clear search button
            const clearButton = document.createElement('button');
            clearButton.id = 'clear-search';
            clearButton.classList.add('clear-search');
            clearButton.title = 'Clear search';
            const clearSpan = document.createElement('span');
            clearSpan.textContent = '×';
            clearButton.appendChild(clearSpan);
            
            searchWrapper.appendChild(playerSearchInput);
            searchWrapper.appendChild(clearButton);
            
            // Create search filters
            const searchFilters = document.createElement('div');
            searchFilters.classList.add('search-filters');
            
            const filterLabel = document.createElement('label');
            filterLabel.textContent = 'Filter by:';
            
            const searchFilterSelect = document.createElement('select');
            searchFilterSelect.id = 'search-filter';
            
            // Create filter options
            const filterOptions = [
                { value: 'all', text: 'All Players' },
                { value: 'top', text: 'Top 3 Players' },
                { value: 'highPoints', text: 'Players with 10+ Points' }
            ];
            
            filterOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                searchFilterSelect.appendChild(optionElement);
            });
            
            // Create sort options
            const sortLabel = document.createElement('label');
            sortLabel.textContent = 'Sort by:';
            
            const sortBySelect = document.createElement('select');
            sortBySelect.id = 'sort-by';
            
            const sortOptions = [
                { value: 'rank', text: 'Rank (Default)' },
                { value: 'name', text: 'Player Name' },
                { value: 'points', text: 'Points (High to Low)' },
                { value: 'wins', text: 'Wins (High to Low)' }
            ];
            
            sortOptions.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.textContent = option.text;
                sortBySelect.appendChild(optionElement);
            });
            
            // Assemble search filters
            searchFilters.appendChild(filterLabel);
            searchFilters.appendChild(searchFilterSelect);
            searchFilters.appendChild(sortLabel);
            searchFilters.appendChild(sortBySelect);
            
            // Create search results display
            const searchResults = document.createElement('div');
            searchResults.id = 'search-results';
            searchResults.classList.add('search-results');
            searchResults.textContent = 'Showing all players';
            
            // Create search tip
            const searchTip = document.createElement('div');
            searchTip.id = 'search-tip';
            searchTip.classList.add('search-tip');
            searchTip.textContent = 'Tip: Type a player\'s name to find them quickly';
            
            // Assemble search container
            searchContainer.appendChild(searchWrapper);
            searchContainer.appendChild(searchFilters);
            searchContainer.appendChild(searchResults);
            searchContainer.appendChild(searchTip);
            
            // Add search container to the page
            standingsTable.parentNode.insertBefore(searchContainer, standingsTable);
            
            // Setup search and filter functionality
            const tableRows = Array.from(standingsTable.querySelectorAll('tbody tr'));
            let visibleRows = [...tableRows];
            
            // Search input event handler
            playerSearchInput.addEventListener('input', function() {
                applyFiltersAndSort();
                
                if (this.value.length === 0) {
                    searchTip.style.display = 'block';
                } else {
                    searchTip.style.display = 'none';
                }
            });
            
            // Clear search button event handler
            const clearSearchBtn = document.getElementById('clear-search');
            clearSearchBtn.addEventListener('click', function() {
                playerSearchInput.value = '';
                applyFiltersAndSort();
                playerSearchInput.focus();
            });
            
            // Filter change event handler
            const searchFilter = document.getElementById('search-filter');
            searchFilter.addEventListener('change', function() {
                applyFiltersAndSort();
            });
            
            // Sort change event handler
            const sortBy = document.getElementById('sort-by');
            sortBy.addEventListener('change', function() {
                applyFiltersAndSort();
            });
            
            /**
             * Apply filters and sorting to player table
             */
            function applyFiltersAndSort() {
                const searchText = playerSearchInput.value.toLowerCase();
                const filterValue = searchFilter.value;
                const sortValue = sortBy.value;
                
                // Apply search and filter
                visibleRows = tableRows.filter(row => {
                    const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    const matchesSearch = searchText === '' || playerName.includes(searchText);
                    
                    // Reset highlighted text
                    Array.from(row.querySelectorAll('td')).forEach(cell => {
                        if (cell.hasAttribute('data-original-text')) {
                            cell.textContent = cell.getAttribute('data-original-text');
                        } else {
                            cell.setAttribute('data-original-text', cell.textContent);
                        }
                    });
                    
                    // Highlight search matches
                    if (matchesSearch && searchText !== '') {
                        const nameCell = row.querySelector('td:nth-child(2)');
                        const name = nameCell.textContent;
                        const highlightedText = name.replace(
                            new RegExp('(' + searchText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'gi'),
                            '<span class="highlight">$1</span>'
                        );
                        nameCell.innerHTML = highlightedText;
                    }
                    
                    return matchesSearch;
                });
                
                // Apply additional filters
                if (filterValue === 'top') {
                    visibleRows = visibleRows.filter(row => {
                        const rank = parseInt(row.querySelector('td:first-child').textContent);
                        return rank <= 3;
                    });
                } else if (filterValue === 'highPoints') {
                    visibleRows = visibleRows.filter(row => {
                        const points = parseInt(row.querySelector('td:last-child').textContent);
                        return points >= 10;
                    });
                }
                
                // Apply sorting
                if (sortValue !== 'rank') {
                    visibleRows.sort((a, b) => {
                        if (sortValue === 'name') {
                            const nameA = a.querySelector('td:nth-child(2)').textContent.toLowerCase();
                            const nameB = b.querySelector('td:nth-child(2)').textContent.toLowerCase();
                            return nameA.localeCompare(nameB);
                        } else if (sortValue === 'points') {
                            const pointsA = parseInt(a.querySelector('td:last-child').textContent);
                            const pointsB = parseInt(b.querySelector('td:last-child').textContent);
                            return pointsB - pointsA;
                        } else if (sortValue === 'wins') {
                            const winsA = parseInt(a.querySelector('td:nth-child(3)').textContent);
                            const winsB = parseInt(b.querySelector('td:nth-child(3)').textContent);
                            return winsB - winsA;
                        }
                        return 0;
                    });
                } else {
                    visibleRows.sort((a, b) => {
                        const rankA = parseInt(a.querySelector('td:first-child').textContent);
                        const rankB = parseInt(b.querySelector('td:first-child').textContent);
                        return rankA - rankB;
                    });
                }
                
                // Update DOM with filtered and sorted rows
                const tbody = standingsTable.querySelector('tbody');
                
                tableRows.forEach(row => row.style.display = 'none');
                
                visibleRows.forEach(row => {
                    row.style.display = '';
                    tbody.appendChild(row);
                });
                
                // Update search results text
                updateSearchResults();
                
                // Toggle clear button visibility
                clearSearchBtn.style.visibility = playerSearchInput.value.length > 0 ? 'visible' : 'hidden';
            }
            
            /**
             * Update the search results message
             */
            function updateSearchResults() {
                const resultsElement = document.getElementById('search-results');
                if (playerSearchInput.value.length > 0) {
                    if (visibleRows.length === 0) {
                        resultsElement.textContent = `No players found matching "${playerSearchInput.value}"`;
                        resultsElement.classList.add('no-results');
                    } else if (visibleRows.length === 1) {
                        resultsElement.textContent = `Found 1 player matching "${playerSearchInput.value}"`;
                        resultsElement.classList.remove('no-results');
                    } else {
                        resultsElement.textContent = `Found ${visibleRows.length} players matching "${playerSearchInput.value}"`;
                        resultsElement.classList.remove('no-results');
                    }
                } else {
                    if (visibleRows.length === tableRows.length) {
                        resultsElement.textContent = `Showing all ${tableRows.length} players`;
                        resultsElement.classList.remove('no-results');
                    } else {
                        resultsElement.textContent = `Showing ${visibleRows.length} of ${tableRows.length} players`;
                        resultsElement.classList.remove('no-results');
                    }
                }
            }
            
            // Initialize clear button visibility
            clearSearchBtn.style.visibility = 'hidden';
            updateSearchResults();
        }
    }
}

/**
 * Initialize registration page functionality
 * - Form submission handlers
 * - Form validation
 */
function initRegistrationPage() {
    const clubForm = document.getElementById('club-registration');
    const tournamentForm = document.getElementById('tournament-registration-form');
    
    // Club registration form submission handler
    if (clubForm) {
        clubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                alert('Club registration successful! Welcome to the University FIFA Club!');
                this.reset();
            }
        });
    }
    
    // Tournament registration form submission handler
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                const tournamentSelect = document.getElementById('tournament');
                const tournamentName = tournamentSelect.options[tournamentSelect.selectedIndex].text;
                
                alert(`You have successfully registered for ${tournamentName}! Check your email for confirmation.`);
                this.reset();
            }
        });
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Highlight the active section based on scroll position
 */
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;
        
        // Find the current section based on scroll position
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('scroll-active');
            if (link.getAttribute('href') === `#${current}` || 
                (link.getAttribute('href').includes(current + '.html'))) {
                link.classList.add('scroll-active');
            }
        });
    });
}

/**
 * Create and add back to top button
 */
function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.classList.add('back-to-top');
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Initialize FIFA news section
 * - Fetch news from EA website
 * - Display news items
 */
function initFifaNewsSection() {
    const newsContainer = document.getElementById('fifa-news-container');
    if (!newsContainer) return;
    
    // Show loading indicator
    newsContainer.innerHTML = '<div class="loading-spinner">Loading latest FIFA news...</div>';
    
    // Fetch FIFA news
    fetchFifaNews()
        .then(newsItems => {
            if (newsItems && newsItems.length > 0) {
                displayFifaNews(newsItems, newsContainer);
            } else {
                newsContainer.innerHTML = '<p class="error-message">Unable to load FIFA news at this time. Please check back later.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching FIFA news:', error);
            newsContainer.innerHTML = '<p class="error-message">Error loading FIFA news. Please check back later.</p>';
        });
}

/**
 * Fetch FIFA news from EA website
 * @returns {Promise<Array>} Array of news items
 */
function fetchFifaNews() {
    // For security and CORS reasons, we'd need a server-side proxy to fetch from EA's website
    const eaNewsUrl = 'https://www.ea.com/tr-tr/games/fifa/news';
    
    // In a production environment, you would use a server-side proxy like:
    // return fetch('/api/fifa-news')  // This would be your server endpoint that fetches from EA
    //   .then(response => response.json())
    //   .then(data => data.news);
    
    return new Promise((resolve, reject) => {
        // Simulate an API request with a delay
        setTimeout(() => {
            // For demonstration, we'll fetch from our local JSON file
            // In production, this would be replaced with actual EA API call
            fetch('data/ea_fifa_news.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch news data');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Fetched FIFA news from: ' + data.source);
                    resolve(data.news);
                })
                .catch(error => {
                    console.error('Error fetching EA FIFA news:', error);
                    
                    // Fallback to hard-coded data if JSON file is not available
                    const fallbackNews = [
                        {
                            title: "FC 24 Title Update 11 Yayın Notları",
                            description: "EA SPORTS FC 24 için en yeni Başlık Güncellemesi artık tüm platformlarda kullanılabilir.",
                            date: "2023-05-20",
                            image: "images/TOTS.png",
                            url: "https://www.ea.com/tr-tr/games/fc/fc-24/news/fc-24-title-update-11-release-notes"
                        },
                        {
                            title: "EA SPORTS FC Mobile Sezon 4",
                            description: "EA SPORTS FC Mobile Sezon 4, yeni oyun özellikleri ve iyileştirmeler getiriyor.",
                            date: "2023-05-15",
                            image: "images/TOTS.png",
                            url: "https://www.ea.com/tr-tr/games/fc/fc-mobile/news/ea-sports-fc-mobile-season-4"
                        },
                        {
                            title: "FC 24 TOTS (Sezonun Takımı)",
                            description: "Futbol dünyasından en istikrarlı performans gösterenler.",
                            date: "2023-05-10",
                            image: "images/TOTS.png",
                            url: "https://www.ea.com/tr-tr/games/fc/fc-24/news/fc-24-team-of-the-season"
                        }
                    ];
                    resolve(fallbackNews);
                });
        }, 800);
    });
}

/**
 * Display FIFA news in the container
 * @param {Array} newsItems - Array of news items to display
 * @param {HTMLElement} container - Container element to display news in
 */
function displayFifaNews(newsItems, container) {
    // Clear loading indicator
    container.innerHTML = '';
    
    // Create news header
    const newsHeader = document.createElement('div');
    newsHeader.classList.add('news-header');
    newsHeader.innerHTML = `
        <h2>Latest FIFA news</h2>
        <p class="news-source">EA SPORTS FC news</p>
    `;
    container.appendChild(newsHeader);
    
    // Create news grid
    const newsGrid = document.createElement('div');
    newsGrid.classList.add('news-grid');
    
    // Create news items
    newsItems.forEach(item => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');
        
        // Format date
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        newsCard.innerHTML = `
            <div class="news-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="news-content">
                <h3>${item.title}</h3>
                <p class="news-date">${formattedDate}</p>
                <p class="news-description">${item.description}</p>
                <a href="${item.url}" class="news-link" target="_blank">Read more</a>
            </div>
        `;
        
        newsGrid.appendChild(newsCard);
    });
    
    container.appendChild(newsGrid);
    
    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.classList.add('refresh-news-btn');
    refreshButton.innerHTML = 'Refresh news';
    refreshButton.addEventListener('click', function() {
        initFifaNewsSection();
    });
    
    container.appendChild(refreshButton);
    
    // Add fade-in animation
    const allCards = newsGrid.querySelectorAll('.news-card');
    allCards.forEach((card, index) => {
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease-in-out';
            card.style.opacity = '1';
        }, 100 * index);
    });
}



