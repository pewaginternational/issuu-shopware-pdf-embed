//console.log("render.js running");

function renderIssuuEmbeds(data) {

    const wrapper = document.querySelector('.issuu_embed_wrapper');

    if (!wrapper || !Array.isArray(data)) return;

    

    //HEADLINE LANGUAGE DEFINITION

    //structured headline array for easy maintenance
    const headlineLocalization = [
        {
            language: 'en',
            headline: 'Product Catalogue',
            paths: ['au', 'in', 'uk']
        },
        {
            language: 'us',
            headline: 'Product Catalog and Fit Guide',
            paths: ['us', 'ca']
        },
        {
            language: 'de',
            headline: 'Produktkataloge',
            paths: ['at', 'de', 'ch']
        },
        {
            language: 'es',
            headline: 'Catálogo de productos',
            paths: ['co', 'mx']
        },
        {
            language: 'pt',
            headline: 'Catálogo de produtos',
            paths: ['br', 'pt']
        },
        {
            language: 'cz',
            headline: 'Katalog produktů',
            paths: ['cz']
        },
        {
            language: 'fi',
            headline: 'Tuoteluettelo',
            paths: ['fi']
        },
        {
            language: 'fr',
            headline: 'Catalogue des produits',
            paths: ['fr']
        },
        {
            language: 'it',
            headline: 'Catalogo dei prodotti',
            paths: ['it']
        },
        {
            language: 'nl',
            headline: 'Productcatalogus',
            paths: ['nl']
        },
        {
            language: 'no',
            headline: 'Produktkatalog',
            paths: ['no']
        },
        {
            language: 'pl',
            headline: 'Product Catalogue',
            paths: ['pl']
        },
        {
            language: 'ro',
            headline: 'Catalog de produse',
            paths: ['ro']
        },
        {
            language: 'ru',
            headline: 'Каталог продукции',
            paths: ['ru']
        },
        {
            language: 'sk',
            headline: 'Katalóg produktov',
            paths: ['sk']
        },
        {
            language: 'se',
            headline: 'Produktkataloger',
            paths: ['se']
        },
        {
            language: 'ua',
            headline: 'Каталог продукції',
            paths: ['ua']
        },
    ];

    //flat array generation for a cleaner loop
    const flatHeadlines = headlineLocalization.reduce((acc, entry) => {
        entry.paths.forEach(path => {
            acc[path] = entry.headline;
        });
        return acc;
    }, {});

    function getHeadlineByPath() {
        const segment = window.location.pathname
            .split('/')
            .filter(Boolean)[0];

        return flatHeadlines[segment] || flatHeadlines['au'];
    }


    //HEADLINE
    const headline = document.createElement('div');
    headline.className = 'ap-download-center-catalogue__title h5';
    headline.textContent = getHeadlineByPath();
    wrapper.appendChild(headline);

    //STYLESHEET
    const style = document.createElement('style');
    style.textContent = `
        .issuu_embed_pair {
            width: 100%;
            padding-bottom: 1em;
            padding-top: 1em;
            border-bottom: 1px solid rgba(237, 237, 237, 1);
        }
        .issuu_embed_pair .issuu_embed_button {
            border: none;
            background-color: rgba(255,255,255,0);
            font-weight:700;
        }
        .issuu_embed_pair .issuu_embed_content {
            margin-top: 1em;
        }
        
        .issuu_embed_pair .issuu_embed_arrow {
            transition: all .3s ease;
        }
        
        .issuu_embed_pair .issuu_embed_arrow.open {
            transform: rotate(180deg);
        }
    `;
    wrapper.appendChild(style);

    //EMBEDS
    data.forEach((item, index) => {
        const pair = document.createElement('div');
        pair.className = 'issuu_embed_pair';

        pair.innerHTML = `
            <button class="issuu_embed_button" data-id="${index}">
                ${item.name}
                <svg xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="7"
                        viewBox="0 0 12 7"
                        fill="none"
                        class="issuu_embed_arrow"
                        aria-hidden="true">
                <path d="M1 1c1.575 1.371 4.725 4.5 4.725 4.5S8.875 2.629 10.45 1"
                    stroke="#E20031"
                    stroke-width="2"
                    fill="none"></path>
                </svg>
            </button>

            <div class="issuu_embed_content" data-id="${index}" hidden>
                <div style="position:relative;padding-top:max(60%,326px);height:0;width:100%">
                    <iframe
                    src="${item.issuu}"
                    allow="clipboard-write"
                    sandbox="allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-scripts allow-same-origin allow-popups allow-modals allow-popups-to-escape-sandbox allow-forms"
                    allowfullscreen
                    style="position:absolute;border:none;width:100%;height:100%;inset:0">
                    </iframe>
                </div>
            </div>
        `;

        wrapper.appendChild(pair);
    });
}

renderIssuuEmbeds(ISSUU_EMBEDS);

//TOGGLE BEHAVIOR
const buttons = document.querySelectorAll('.issuu_embed_button');

buttons.forEach((button, index) => {

    button.addEventListener('click', function () {
        //console.log("click");

        if (!button) return;
        
        const content = document.querySelector(
            '.issuu_embed_content[data-id="' + index + '"]'
        );
        //console.log("content: ", content);
        
        const arrow = button.querySelector(
            '.issuu_embed_arrow'
        );
        //console.log("arrow: ", arrow);
        
        if(arrow){
            arrow.classList.toggle("open");
        }
    
        if (!content) return;
    
        content.hidden = !content.hidden;
    });

});