# issuu-shopware-pdf-embed

This script serves as a centralised render logic for Issuu-hosted catalogues on [shop.pewag.com](https://shop.pewag.com). The scripts should be embedded in the Shopware Layouts - __Custom HTML CMS block__. Example implementation can be seen in [example.html](example.html).

__Warning:__ This repository, as well as the script from [render.js](render.js), embedded on shop.pewag.com is visible to the public. __Do not__ insert any potentially sensitive information in any part of this repository.

## Quick usage
1. Copy the markup from [example.html](example.html)
2. Insert it into Shopware CMS (Custom HTML block)
3. Replace ISSUU_EMBEDS data
4. Done

## Implementation 

Please use [example.html](example.html) as a template for implementation.
Due to slow agency response times and limited access we currently have to the Shopware source code, it is recommended that the script is embedded using the __Custom HTML CMS block__ at each site where issuu embeds are required __manually__.

### CMS embeds
The script is hosted at [https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@v1/render.js](https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@v1/render.js) and should always be embedded using __@v1__ tag in production, as shown below:

```HTML
<script src="https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@v1/render.js"></script>
```

It is important that the script is always inserted __after__ the anchor div and data definitions (as seen in [example.html](example.html)), to ensure that the anchor and data are available when the script executes.

---

### Deploying script changes 

#### Testing
When making changes to the [render.js](render.js), always test them first (ideally in a staging environment). To avoid caching issues, you can use the __commit hash__ as your tag instead of __@v1__. That way you will always be able to preview the exact version of the script you intend to test:

```HTML
<script src="https://cdn.jsdelivr.net/gh/pewaginternational/issuu-shopware-pdf-embed@[COMMIT_HASH]/render.js"></script>
```
---

#### Production implementation 

##### Step 1: Move the @v1 tag to the latest commit

In production, keep the __@v1__ version to avoid the need for manual updates across the CMS. Once you have thoroughly tested the changes and confirmed desired behavior, you can move the __@v1__ tag to the latest/appropriate commit in Git Bash:

__Move to latest commit:__
```bash
git tag -f v1
git push origin v1 --force
```

__Move to specific commit (useful for rollbacks):__ 
```bash
git tag -f v1 <commit_hash>
git push origin v1 --force
```
__WARNING:__ While the changes in the __@v1__ tag will only be visible once the old cached version clears (7 days or after a manual purge), moving the tag too quickly can risk an accidental cache purge and being stuck behind a cache-purge throttle and a cached bad version on production. __Make sure to thoroughly test any changes and only move the__ _@v1_ __tag once you are sure you are ready for production deployment.__

##### Step 2: Cache purge
Once you have moved the __@v1__ tag to the appropriate commit, you can __purge the cache__ of the @v1 version on the below url:

[https://www.jsdelivr.com/tools/purge](https://www.jsdelivr.com/tools/purge)

This will update the logic everywhere the __@v1__-tagged script appears.

__Warning:__ If you purge the cache too often, you will be throttled very quickly. __It is therefore recommended that you do not use the purge tool more than once a day__. You can always test changes using the __commit hash__ approach explained above. __Always make sure you have thoroughly tested the changes before utilizing the purge tool.__

---

## Languages

To keep the element headline in line with the current language structure, an automated language logic has been implemented at the __HEADLINE__ section of [render.js](render.js). To edit the language info simply update the array stored in __const headlineLocalization__ (see Example structure below).

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