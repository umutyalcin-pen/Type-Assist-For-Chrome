document.addEventListener('DOMContentLoaded', () => {
    const categoriesContainer = document.querySelector('.categories');
    const symbolsGrid = document.getElementById('symbolsGrid');
    const searchInput = document.getElementById('searchInput');
    const toast = document.getElementById('toast');

    let activeCategory = symbolData[0].category;

    
    initCategories();

    const firstCat = symbolData[0];
    renderSymbols(firstCat.items);


    searchInput.addEventListener('input', handleSearch);

    function initCategories() {

        symbolData.forEach((cat, index) => {
     
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
      
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = name;

         
            searchInput.value = '';

    
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

    
        if (query.length > 0) {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
   
        } else {
  
            document.querySelectorAll('.category-btn').forEach(b => {
                if (b.textContent === activeCategory) b.classList.add('active');
            });
            
            const btn = Array.from(document.querySelectorAll('.category-btn')).find(b => b.textContent === activeCategory);
            if (btn) btn.click();
            return;
        }

        const allSymbols = getAllSymbols();
        // Simple filter: check if symbol includes query (not very useful for symbols)
        
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
//eslem seni çok özledim

