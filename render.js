//console.log("render.js running");

/*------------
/ ENTRY POINT
------------*/
function initIssuuEmbeds(data) {
    const wrapper = document.querySelector('.issuu_embed_wrapper');

    if (!wrapper || !Array.isArray(data)) return;

    renderHeadline(wrapper);
    injectStyles(wrapper);
    renderEmbeds(wrapper, data);
    initToggleBehavior(wrapper);
}

initIssuuEmbeds(issuu_embeds);

/*---------
/ HEADLINE
---------*/

function renderHeadline(wrapper) {
    const headlineLocalization = [
        { language: 'en', headline: 'Product Catalogue', paths: ['au','in','uk'] },
        { language: 'us', headline: 'Product Catalog and Fit Guide', paths: ['us','ca'] },
        { language: 'de', headline: 'Produktkataloge', paths: ['at','de','ch'] },
        { language: 'es', headline: 'Catálogo de productos', paths: ['co','mx'] },
        { language: 'pt', headline: 'Catálogo de produtos', paths: ['br','pt'] },
        { language: 'cz', headline: 'Katalog produktů', paths: ['cz'] },
        { language: 'fi', headline: 'Tuoteluettelo', paths: ['fi'] },
        { language: 'fr', headline: 'Catalogue des produits', paths: ['fr'] },
        { language: 'it', headline: 'Catalogo dei prodotti', paths: ['it'] },
        { language: 'nl', headline: 'Productcatalogus', paths: ['nl'] },
        { language: 'no', headline: 'Produktkatalog', paths: ['no'] },
        { language: 'pl', headline: 'Product Catalogue', paths: ['pl'] },
        { language: 'ro', headline: 'Catalog de produse', paths: ['ro'] },
        { language: 'ru', headline: 'Каталог продукции', paths: ['ru'] },
        { language: 'sk', headline: 'Katalóg produktov', paths: ['sk'] },
        { language: 'se', headline: 'Produktkataloger', paths: ['se'] },
        { language: 'ua', headline: 'Каталог продукції', paths: ['ua'] }
    ];

    const flatHeadlines = flattenHeadlineMap(headlineLocalization);

    const headline = document.createElement('div');
    headline.className = 'ap-download-center-catalogue__title h5';
    headline.textContent = getHeadlineByPath(flatHeadlines);

    wrapper.appendChild(headline);
}

//flat headline array generation for a cleaner loop
function flattenHeadlineMap(data) {
    return data.reduce((acc, entry) => {
        entry.paths.forEach(path => {
            acc[path] = entry.headline;
        });
        return acc;
    }, {});
}

//headline assignment loop
function getHeadlineByPath(map) {
    const segment = window.location.pathname
        .split('/')
        .filter(Boolean)[0];

    return map[segment] || map['au'];
}

/*-------------
/ STYLES
-------------*/
function injectStyles(wrapper) {

    const style = document.createElement('style');

    style.textContent = `
        .issuu_embed_pair {
            width: 100%;
            padding-bottom: 1em;
            padding-top: 1em;
            border-bottom: 1px solid rgba(237,237,237,1);
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
}


/*-------------
/ EMBED RENDER
-------------*/
function renderEmbeds(wrapper, data) {

    data.forEach((item, index) => {

        const pair = document.createElement('div');
        pair.className = 'issuu_embed_pair';

        const panelId = `issuu-panel-${index}`;
        const buttonId = `issuu-button-${index}`;

        pair.innerHTML = `
            <button class="issuu_embed_button" 
                    id="${buttonId}"
                    data-id="${index}"
                    aria-expanded="false"
                    aria-controls="${panelId}">
                ${escapeHTML(item.name)}
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
                          fill="none">
                    </path>
                </svg>
            </button>

            <div class="issuu_embed_content" 
                 id="${panelId}"
                 data-id="${index}"
                 role="region"
                 aria-labelledby="${buttonId}"
                 hidden>

                <div style="position:relative;padding-top:max(60%,326px);height:0;width:100%">

                    <iframe
                        data-src="${escapeHTMLAttr(item.issuu)}"
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

/* 
/ Escape functions to prevent unintended side effects of innerHTML variable injection. 
/ Sufficient for the closed CMS use-case.
*/

// plain text
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, m => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}

// URLs
function escapeHTMLAttr(str) {
  return str.replace(/["']/g, m => ({
    '"':"&quot;",
    "'":"&#39;"
  }[m]));
}


/*-------------
/ TOGGLE
-------------*/
function initToggleBehavior(wrapper) {

    wrapper.addEventListener('click', (event) => {

        const button = event.target.closest('.issuu_embed_button');
        if (!button) return;

        const index = button.dataset.id;

        const content = wrapper.querySelector(
            `.issuu_embed_content[data-id="${index}"]`
        );

        const arrow = button.querySelector('.issuu_embed_arrow');
        const iframe = content.querySelector('iframe');

        if (arrow) arrow.classList.toggle("open");

        if (content) {

            const isOpening = content.hidden;

            content.hidden = !content.hidden;

            /* update aria-expanded */
            button.setAttribute('aria-expanded', String(isOpening));

            /* lazy load iframe */
            if (isOpening && iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
            }

        }

    });

}


