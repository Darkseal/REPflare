// ----------------------------------------------------------------------------------
// REPflare - v1.0.0
// ref.: https://github.com/Darkseal/REPflare
// A lightweight Cloudflare Worker to replace text and inject styles and scripts in any web page
// ----------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------
// CONFIGURATION SETTINGS
// ----------------------------------------------------------------------------------

// set this to TRUE to use RegEx, FALSE otherwise
const textReplacement_useRegex = true;

// set this to TRUE to perform the replacement in a case-insensitive way, FALSE otherwise
const textReplacement_caseInsensitive = true;

// Text replacement configuration ( 'sourceText' : 'replacementText' )
const textReplacementRules = {
    'Apple': 'Banana',
    'https://www.myurl.com/': 'https://www.google.com/'
}

// Script injection configuration ( 'sourceScriptElement' : position )

// Position can be set as follows:
// 0: at the beginning of <header> element ( first child of <head> )
// 1: at the end of <header> element  ( right before </head> )
// 2: at the beginning of <body> element ( first child of <body> )
// 3: at the end of <body> element ( right before </body> )

const scriptInjectionRules = {
    '<script type="text/javascript">alert("script injected!")</script>': 0,
    '<style type="text/css">body { background:red; }</style>': 2
};

// ----------------------------------------------------------------------------------
// MAIN CODE
// ----------------------------------------------------------------------------------

addEventListener('fetch', event => {
    event.passThroughOnException();
    event.respondWith(handleRequest(event.request));
})

async function handleRequest(request) {
    const response = await fetch(request);
    var html = await response.text();

    html = replaceText(html);
    html = injectScripts(html);

    // return modified response
    return new Response(html, {
        headers: response.headers
    })
}

function replaceText(html) {
    if (!textReplacementRules || textReplacementRules.length === 0) {
        return html;
    }

    var regexModifiers = 'g';
    if (textReplacement_caseInsensitive) {
        regexModifiers += 'i';
    }

    for (let k in textReplacementRules) {
        var v = textReplacementRules[k];

        if (textReplacement_useRegex) {
            html = html.replace(new RegExp(k, regexModifiers), v);
        }
        else {
            html = html.split(new RegExp(k, regexModifiers)).join(v);
        }
    }

    return html;
}

function injectScripts(html) {
    if (!scriptInjectionRules || scriptInjectionRules.length === 0) {
        return html;
    }

    var regexModifiers = 'gi';

    for (let k in scriptInjectionRules) {
        var v = scriptInjectionRules[k];

        switch (v) {
            case 0:
            default:
                var i = html.getInjectionIndex(new RegExp("<head>|<head [^>]*?>", regexModifiers));
                html = html.insertAt(i, k);
                break;
            case 1:
                var i = html.getInjectionIndex(new RegExp("</head>", regexModifiers));
                html = html.insertAt(i, k);
                break;
            case 2:
                var i = html.getInjectionIndex(new RegExp("<body>|<body [^>]*?>", regexModifiers));
                html = html.insertAt(i, k);
                break;
            case 3:
                var i = html.getInjectionIndex(new RegExp("</body>", regexModifiers));
                html = html.insertAt(i, k);
                break;
        }
    }

    return html;
}

String.prototype.getInjectionIndex = function (regex) {
    var match = this.match(regex);
    return match
        ? this.lastIndexOf(match[match.length - 1]) + match[match.length - 1].length
        : -1;
}

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}