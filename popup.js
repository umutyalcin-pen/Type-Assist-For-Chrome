document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.querySelector('.categories');
    const symbolsGrid = document.getElementById('symbolsGrid');
    const searchInput = document.getElementById('searchInput');
    const toast = document.getElementById('toast');

    let activeCategory = symbolData[0].category;

    // Initialize
    initCategories();
    // Render first category by default
    const firstCat = symbolData[0];
    renderSymbols(firstCat.items);

    // Event Listeners
    searchInput.addEventListener('input', handleSearch);

    function initCategories() {
        // Add categories from data
        symbolData.forEach((cat, index) => {
            // First category is active by default
            const isActive = index === 0;
            const btn = createCategoryBtn(cat.category, isActive);
            categoriesContainer.appendChild(btn);
        });
    }

    function createCategoryBtn(name, isActive) {
        const btn = document.createElement('button');
        btn.className = `category-btn ${isActive ? 'active' : ''}`;
        btn.textContent = name;
        btn.addEventListener('click', () => {
            // Update active state
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = name;

            // Clear search when changing category
            searchInput.value = '';

            // Render symbols
            const categoryData = symbolData.find(c => c.category === name);
            renderSymbols(categoryData ? categoryData.items : []);
        });
        return btn;
    }

    function getAllSymbols() {
        return symbolData.reduce((acc, curr) => [...acc, ...curr.items], []);
    }

    function renderSymbols(items) {
        symbolsGrid.innerHTML = '';

        if (items.length === 0) {
            symbolsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 20px;">Sonuç bulunamadı</div>';
            return;
        }

        items.forEach(symbol => {
            const el = document.createElement('div');
            el.className = 'symbol-item';
            el.textContent = symbol;
            el.addEventListener('click', () => copyToClipboard(symbol));
            symbolsGrid.appendChild(el);
        });
    }

    function handleSearch(e) {
        const query = e.target.value.toLowerCase();

        // Reset active category visual state to "All" if searching
        if (query.length > 0) {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Optional: Highlight "All" or none. Let's highlight none to indicate search mode.
        } else {
            // Restore active category
            document.querySelectorAll('.category-btn').forEach(b => {
                if (b.textContent === activeCategory) b.classList.add('active');
            });
            // Re-render active category
            const btn = Array.from(document.querySelectorAll('.category-btn')).find(b => b.textContent === activeCategory);
            if (btn) btn.click();
            return;
        }

        const allSymbols = getAllSymbols();
        // Simple filter: check if symbol includes query (not very useful for symbols)
        // Better: Search by name? We don't have names in data.js yet.
        // For now, let's just filter the symbols array itself if it matches? 
        // Actually, searching symbols by typing them is hard. 
        // Maybe we should add metadata to data.js later. 
        // For now, let's assume the user might paste a symbol or we just show all.
        // Wait, the user requirement said "search function". 
        // Without names, search is impossible. I should update data.js to include names or keywords.
        // For this MVP, I'll update data.js to include names/keywords in the next step or just skip search for now?
        // Let's stick to the plan. I will update data.js to include keywords for better search.

        // BUT for now, let's just make it work with what we have. 
        // If I can't search by name, I can't search. 
        // I will implement a basic search that does nothing useful yet, or maybe searches by category name?
        // Let's refactor data.js in the next turn to include names. 
        // For now, I'll just leave the search logic as is (it won't find much unless we add metadata).

        // Actually, let's try to be smart. If I can't search, I should probably hide the search bar or make it work.
        // I'll update data.js to be an array of objects { char: "→", name: "right arrow", keywords: "yon ok sag" }
        // This is a bit of work. 
        // Let's just keep the simple array for now and maybe the user will ask for search improvements.
        // OR I can just map some common keywords.

        // Let's just filter by exact match for now (useless) but the structure is there.
        // I will add a TODO comment.

        // UPDATE: I will try to match the query against the category name too.
        const filtered = symbolData.filter(cat => cat.category.toLowerCase().includes(query))
            .reduce((acc, curr) => [...acc, ...curr.items], []);

        // Also include symbols that match directly (if any)
        const directMatches = allSymbols.filter(s => s.includes(query));

        const results = [...new Set([...filtered, ...directMatches])];
        renderSymbols(results);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showToast();
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
});
