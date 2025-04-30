document.addEventListener('DOMContentLoaded', function() {
    
    initCommonFunctionality();
    
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
});

function initCommonFunctionality() {
    const mobileToggle = document.createElement('button');
    mobileToggle.classList.add('mobile-nav-toggle');
    mobileToggle.innerHTML = '☰';
    
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.parentNode.insertBefore(mobileToggle, navbar);
        
        mobileToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.innerHTML = navbar.classList.contains('active') ? '✕' : '☰';
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
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
    
    highlightActiveSection();
    createBackToTopButton();
}

function initTournamentsPage() {
    const tournamentCards = document.querySelectorAll('.tournament-card');
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    if (sortButtons.length) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sortType = this.getAttribute('data-sort');
                const arrow = this.querySelector('.arrow');
                const isAscending = arrow.textContent === '↓';
                
                sortButtons.forEach(btn => btn.querySelector('.arrow').textContent = '↓');
                arrow.textContent = isAscending ? '↑' : '↓';
                
                sortTournaments(sortType, isAscending);
            });
        });
    }
    
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
    
    const tournamentsSection = document.getElementById('tournaments');
    if (tournamentsSection) {
        const controlsDiv = tournamentsSection.querySelector('.tournament-controls');
        if (controlsDiv) {
            controlsDiv.prepend(filterContainer);
            
            document.getElementById('filter-tournaments').addEventListener('change', function() {
                filterTournaments(this.value);
            });
        }
    }
}

function sortTournaments(sortType, ascending) {
    const tournamentsGrid = document.querySelector('.tournaments-grid');
    const tournaments = Array.from(tournamentsGrid.querySelectorAll('.tournament-card'));
    
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
    
    tournaments.forEach(tournament => tournamentsGrid.appendChild(tournament));
    
    tournaments.forEach(tournament => {
        tournament.style.opacity = '0';
        setTimeout(() => {
            tournament.style.transition = 'opacity 0.3s ease-in-out';
            tournament.style.opacity = '1';
        }, 50);
    });
}

function filterTournaments(filterValue) {
    const upcomingSection = document.getElementById('tournaments');
    const pastSection = document.getElementById('past-tournaments');
    
    if (!upcomingSection || !pastSection) return;
    
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

function initSchedulePage() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(targetId).style.display = 'block';
            this.classList.add('active');
        });
    });
    
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
    
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

function initStandingsPage() {
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
            const searchContainer = document.createElement('div');
            searchContainer.classList.add('search-container');
            const searchWrapper = document.createElement('div');
            searchWrapper.classList.add('search-wrapper');
            
            const playerSearchInput = document.createElement('input');
            playerSearchInput.type = 'text';
            playerSearchInput.id = 'player-search';
            playerSearchInput.placeholder = 'Search players by name...';
            
            const clearButton = document.createElement('button');
            clearButton.id = 'clear-search';
            clearButton.classList.add('clear-search');
            clearButton.title = 'Clear search';
            const clearSpan = document.createElement('span');
            clearSpan.textContent = '×';
            clearButton.appendChild(clearSpan);
            
            searchWrapper.appendChild(playerSearchInput);
            searchWrapper.appendChild(clearButton);
            
            const searchFilters = document.createElement('div');
            searchFilters.classList.add('search-filters');
            
            const filterLabel = document.createElement('label');
            filterLabel.textContent = 'Filter by:';
            
            const searchFilterSelect = document.createElement('select');
            searchFilterSelect.id = 'search-filter';
            
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
            
            searchFilters.appendChild(filterLabel);
            searchFilters.appendChild(searchFilterSelect);
            searchFilters.appendChild(sortLabel);
            searchFilters.appendChild(sortBySelect);
            
            const searchResults = document.createElement('div');
            searchResults.id = 'search-results';
            searchResults.classList.add('search-results');
            searchResults.textContent = 'Showing all players';
            
            const searchTip = document.createElement('div');
            searchTip.id = 'search-tip';
            searchTip.classList.add('search-tip');
            searchTip.textContent = 'Tip: Type a player\'s name to find them quickly';
            
            searchContainer.appendChild(searchWrapper);
            searchContainer.appendChild(searchFilters);
            searchContainer.appendChild(searchResults);
            searchContainer.appendChild(searchTip);
            
            standingsTable.parentNode.insertBefore(searchContainer, standingsTable);
            
            const tableRows = Array.from(standingsTable.querySelectorAll('tbody tr'));
            let visibleRows = [...tableRows];
            
            playerSearchInput.addEventListener('input', function() {
                applyFiltersAndSort();
                
                if (this.value.length === 0) {
                    searchTip.style.display = 'block';
                } else {
                    searchTip.style.display = 'none';
                }
            });
            
            const clearSearchBtn = document.getElementById('clear-search');
            clearSearchBtn.addEventListener('click', function() {
                playerSearchInput.value = '';
                applyFiltersAndSort();
                playerSearchInput.focus();
            });
            
            const searchFilter = document.getElementById('search-filter');
            searchFilter.addEventListener('change', function() {
                applyFiltersAndSort();
            });
            
            const sortBy = document.getElementById('sort-by');
            sortBy.addEventListener('change', function() {
                applyFiltersAndSort();
            });
            
            function applyFiltersAndSort() {
                const searchText = playerSearchInput.value.toLowerCase();
                const filterValue = searchFilter.value;
                const sortValue = sortBy.value;
                
                visibleRows = tableRows.filter(row => {
                    const playerName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    const matchesSearch = searchText === '' || playerName.includes(searchText);
                    
                    Array.from(row.querySelectorAll('td')).forEach(cell => {
                        if (cell.hasAttribute('data-original-text')) {
                            cell.textContent = cell.getAttribute('data-original-text');
                        } else {
                            cell.setAttribute('data-original-text', cell.textContent);
                        }
                    });
                    
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
                
                const tbody = standingsTable.querySelector('tbody');
                
                tableRows.forEach(row => row.style.display = 'none');
                
                visibleRows.forEach(row => {
                    row.style.display = '';
                    tbody.appendChild(row);
                });
                
                updateSearchResults();
                
                clearSearchBtn.style.visibility = playerSearchInput.value.length > 0 ? 'visible' : 'hidden';
            }
            
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
            
            clearSearchBtn.style.visibility = 'hidden';
            updateSearchResults();
        }
    }
}

function initRegistrationPage() {
    const clubForm = document.getElementById('club-registration');
    const tournamentForm = document.getElementById('tournament-registration-form');
    
    if (clubForm) {
        clubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                alert('Club registration successful! Welcome to the University FIFA Club!');
                this.reset();
            }
        });
    }
    
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


function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbar a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPos = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('scroll-active');
            if (link.getAttribute('href') === `#${current}` || 
                (link.getAttribute('href').includes(current + '.html'))) {
                link.classList.add('scroll-active');
            }
        });
    });
}

function createBackToTopButton() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.classList.add('back-to-top');
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
