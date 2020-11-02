# REPflare
A lightweight Cloudflare Worker to replace text and inject styles and scripts in any web page.

## Introduction
REPflare is born as a "spinoff" of CORSflare, a lightweight reverse proxy written in JavaScript that can be used to bypass most common 
CORS (Cross-Origin Resource Sharing)restrictions: for additional info about it, read [here](https://github.com/Darkseal/CORSflare).

In a nutshell, REPflare is a Cloudflare Worker that allows to perform text replacements and script injections in any webpage,
as long as the originating website is server through the Cloudflare CDN.

### Wait a minute... what's a Cloudflare Worker?
Cloudflare Workers are serverless execution environments that allow developers to create entirely new applications or augment existing ones 
without configuring or maintaining infrastructure. A Cloudflare Worker can be set up to work in two ways:

- **Stand-alone**, meaning that it will serve first-hand content or content fetched from third-party sources (inside or outside Cloudflare).
[CORSflare](https://github.com/Darkseal/CORSflare) is a good example of stand-alone worker, since it can proxy every website.
- **Route-based**, meaning that it will *intercept* a route (or a route mask) of one of our Cloudflare-served domains and perform some post-processing tasks
between the web server's HTTP response and the client. REPflare is a good example of route-based worker, since is meant to perform text replacement and script injection
only for the domains that the person who uses it has registered on Cloudflare (and that are served through the Cloudflare CDN).

## How to install
To setup REPflare as a Cloudflare Worker, follow these steps:
* **Download the latest REPflare version** from the REPflare GitHub page: you'll only need the `REPflare.js` JavaScript file.
* **Login to Cloudflare**. If you don't have an account, create one: it's free 
and the basic plan will arguably be enough for most common scenarios, as it will grant 100.000 requests per day.
* **Navigate to the *Workers* section** using the top-level menu.
* **Create a new worker**. If it's the first time you do that, you'll also be asked to choose a subdomain, such as `domainName.workers.dev`.
The subdomain name will be appended to the worker's name to form the worker's FQDN, such as `workerName.domainName.workers.dev`.
* **Paste the REPflare.js source code within the worker code**.
* **Setup the REPflare configuration settings** by following the instructions in the code comment sections (or see below).
* **Add one or more ROUTES to Cloudflare** and assign them to the REPflare worker: for example, if you want to perform text replacements and script injections on all
the web pages of the `www.yourdomain.com` domain, you'll have to add (and assign) the `www.yourdomain.com/*` route.

For additional details about Cloudflare Workers, Workers routes and how to properly set them, take a look at the following official guides:
* https://developers.cloudflare.com/workers/
* https://developers.cloudflare.com/workers/platform/routes
* https://workers.cloudflare.com/
 
## Configuration Settings
REPflare's configuration settings can be set via some JavaScript constants & variables placed at the beginning of the source code.
The best way to do that is to read the code comments. However, here's a quick breakdown of the most relevant options:

* **textReplacement_useRegex**: set this  to TRUE to allow RegExp usage within the text replacement rules, FALSE otherwise.
* **textReplacement_caseInsensitive**: set this to TRUE to perform the replacement in a case-insensitive way, FALSE otherwise.
* **textReplacementRules**: a JSON object containing the text replacement rules (see below for details).
* **scriptInjectionRules**: a JSON object containing the script injection rules (see below for details).


### Text Replacement Rules
The `textReplacementRules` object can be used to configure the text replacement rules
that will be applied to the web server's HTTP response before serving the webpage back to the user.

You can use this feature for a number of tasks, such as:
- "fix" non-standard internal URLs and/or local paths within the upstream's returned contents (html pages, css, js, internal links, custom fonts, and so on)
-  alter the response content in various ways (change a logo, modify the page title, replace a word or a link, and so on).

Each rule must be defined in the following way:

    '<source_string>' : '<replacement_string>'

**HINT**: text replacement rules are processed from top to bottom: put the most specific rules before the generic ones.


### Script Injection Rules
The `scriptInjectionRules` object can be used to inject `<script>`, `<style>` and/or any other HTML element (or raw content) 
to the web server's HTTP response before serving the webpage back to the user.

You can use this feature for a number of tasks, such as:
- add additional scripts and/or styles to the webpage (including those pointing to external/third party websites).
- add additional content to the webpage (such as a banner, a emergency alert, a cookie policy modal dialog, and so on)

Each rule must be defined in the following way:

    '<content_to_inject>' : <position>

The rightmost `position` parameter must be a number from 0 to 3 that will determine where the content will be injected.
The `position` parameter can have the following values:
* 0: at the beginning of <head> element ( first child of <head> )
* 1: at the end of <header> element  ( right before </head> )
* 2: at the beginning of <body> element ( first child of <body> )
* 3: at the end of <body> element ( right before </body> )

**HINT**: script injection rules are processed from top to bottom.


## Useful References
* [REPflare official project page](https://www.ryadel.com/en/portfolio/repflare/)
* [REPflare setup guide](https://www.ryadel.com/en/repflare-free-cloudflare-worker-text-replacement-script-inject/)
* [REPflare's GitHub page](https://github.com/Darkseal/REPflare)


## Credits
REPflare is strongly based upon the [CORSflare](https://github.com/Darkseal/CORSflare) project (MIT license).
