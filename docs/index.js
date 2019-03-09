const createFooter = function(hook) {
    var footer = `
            <hr>
            <footer class="footer-container">
            <div><i class="fas fa-code c-purple"></i> with <i class="fas fa-heart c-red"></i>  by <a href="https://github.com/alexcambose">alexcambose</a></div>
            <div class="footer-expander">
            <span class="footer-expander-arrow"></span>
            <span class="footer-expader-label">Expand pahe</span>
</div>
<div class="display-flex footer-buttons">
    <span><a class="github-button" href="https://github.com/alexcambose/motus" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star alexcambose/motus on GitHub">Star</a></span>
    <span><!-- Place this tag where you want the button to render. -->
<a class="github-button" href="https://github.com/alexcambose/motus/subscription" data-icon="octicon-eye" data-size="large" data-show-count="true" aria-label="Watch alexcambose/motus on GitHub">Watch</a></span>
    <span>
<a class="github-button" href="https://github.com/alexcambose" data-size="large" data-show-count="true" aria-label="Follow @alexcambose on GitHub">Follow @alexcambose</a></span>
    </div>
</footer>`;

    hook.afterEach(function(html) {
        return html + footer;
    });
};
const runScripts = function (hook) {
    hook.beforeEach(function (content) {
        // timeout is needed to delay the script execution so that the page is fully loaded
        const thecontent = content;
        setTimeout(() => {
            const regex = /```js([\s\S]*?)```/gmu;
            var match = regex.exec(thecontent);

            while (match != null) {
                if(!/{ignore}/.test(match[1]))
                    eval(match[1]);
                match = regex.exec(thecontent);
            }
        }, 400);
        content = content.replace(/{ignore}/g, '');
        return content;
    });
};

const runImports = function (imports) {
    return function (hook) {
        hook.beforeEach(function (content) {
            //check for cache
            imports.forEach(e => {
                if(localStorage.getItem(e)) eval(localStorage.getItem(e));
                else fetch(e).then(res => res.text()).then(res => {
                    localStorage.setItem(e, res);
                    eval(res);
                })
            });
            return content;
        });
    }
};

window.$docsify = {
    name: 'motus',
    coverpage: true,
    onlyCover: true,
    loadSidebar: true,
    subMaxLevel: 2,
    repo: 'https://github.com/alexcambose/motus',
    homepage: 'overview.md',
    copyCode: {
        buttonText: 'Copy',
        errorText: 'Error',
        successText: 'Copied'
    },
    themeColor: '#694873',
    search: [
        '/',
    ],
    disqus: 'motusjs',
    executeScript: true,
    plugins: [
        createFooter,
        // TODO replace with actual link
        EditOnGithubPlugin.create('aa', 'a', 'Edit on Github'),
        runScripts,
        runImports(['https://cors-anywhere.herokuapp.com/https://buttons.github.io/buttons.js'])
    ]
};
