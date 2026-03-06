# issuu-shopware-pdf-embed

This script serves as a centralised render logic for Issuu-hosted catalogues on [shop.pewag.com](https://shop.pewag.com). The scripts should be embedded in the Shopware Layouts - __Custom HTML CMS block__. Example implementation can be seen in [example.html](example.html).

__Warning:__ This repository, as well as the script from [render.js](render.js), embedded on shop.pewag.com is visible to the public. __Do not__ insert any potentially sensitive information in any part of this repository.

## Quick usage
1. Copy the markup from [example.html](example.html)
2. Insert it into Shopware CMS (Custom HTML block)
3. Replace __issuu_embeds__ data
4. Done

## Implementation 

Please use [example.html](example.html) as a template for implementation.
Due to slow agency response times and limited access we currently have to the Shopware source code, it is recommended that the script is embedded using the __Custom HTML CMS block__ at each site where issuu embeds are required __manually__.

### CMS embeds
The script is hosted at [https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@latest/render.js](https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@latest/render.js) and should always be embedded using __@latest__ tag in production, as shown below:

```HTML
<script src="https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@latest/render.js"></script>
```

It is important that the script is always inserted __after__ the anchor div and data definitions (as seen in [example.html](example.html)), to ensure that the anchor and data are available when the script executes.

---

### Deploying script changes 

#### Testing
When making changes to the [render.js](render.js), always test them first (ideally in a staging environment). To avoid caching issues, you can use the __commit hash__ as your tag instead of __@latest__. That way you will always be able to preview the exact version of the script you intend to test:

```HTML
<script src="https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@[COMMIT_HASH]/render.js"></script>
```
---

#### Production implementation - Cache purge

Once you have tested the implementation thoroughly via __commit hash implementation__, you can __purge the cache__ of the @latest version on the below url:

[https://www.jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)

This will update the logic everywhere the __@latest__-tagged script appears.

__Warning:__ If you purge the cache too often, you will be throttled very quickly. __It is therefore recommended that you do not use the purge tool more than once a day__. You can always test changes using the __commit hash__ approach explained above. __Always make sure you have thoroughly tested the changes before utilizing the purge tool.__

---

### Future improvement 

Ideally, the long term implementation would utilise direct embedding of the script in the Shopware head section, as described [here](https://developer.shopware.com/docs/guides/plugins/plugins/storefront/add-javascript-as-script-tag.html). A versioning approach could be used to avoid caching issues and simply bumping the version when updating the script. Unfortunately, due to slow reaction to merge requests and current limited access to production source code, this approach is not viable and practical for our current needs.

---

## Languages

To keep the element headline in line with the current language structure, an automated language logic has been implemented at the __HEADLINE__ section of [render.js](render.js). To edit the language info simply update the array stored in __const headlineLocalization__ in __renderHeadline__ function (see Example structure below).

### Example structure

```JS
const headlineLocalization = [
    {
        language: 'en', //language tag - only for grouping and easier identification, does not impact headline logic
        headline: 'Product Catalogue', //language-specific headline
        paths: ['au', 'in', 'uk'] //language paths where the headline applies - shop.pewag.com/au/, shop.pewag.com/in/, shop.pewag.com/uk/
    }
];
```

__NOTE:__ If no matching path structure is found in the _headlineLocalization_ array, the headline will default to English (UK) - _"Product Catalogue"_.