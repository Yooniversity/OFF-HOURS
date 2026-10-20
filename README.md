# Hayoon Park — site

Static site, no build step. Opens directly from disk and deploys as-is to GitHub Pages.

## Preview locally
Double-click `index.html`. Language: toggle in the header, or add `?lang=ko` to the URL.

## Edit content
All text lives in `assets/js/content.js` (English and Korean side by side).

| To change | Edit |
|---|---|
| Statement, About, education, tools | `SITE.statement`, `SITE.about`, `SITE.education`, `SITE.toolkit` |
| Add a project | Copy one object in `SITE.projects`, give it a new `id` and `ref` |
| Project images | Put files in `assets/img/`, list them in that project's `images` |
| Contact links | `SITE.links` (email, LinkedIn, Instagram are blank until filled) |
| Writing links (Daily Radar etc.) | `SITE.journal[].url` |

Image guide: JPG/WebP, long side ≤ 2400 px, under ~500 KB each.

## Structure
```
index.html          home: hero section drawing, work register, position, writing, about
project.html        one template for every project (project.html?p=<id>)
assets/css/site.css design tokens + layout (light/dark)
assets/js/content.js  all content
assets/js/site.js     renderer
scripts/deploy.ps1    publish to GitHub Pages
```

## Deploy
```
powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
```
First run installs nothing but needs Git and GitHub CLI (`winget install Git.Git GitHub.cli`); it signs you in, creates the public repo `Yooniversity/Yooniversity.github.io`, pushes and turns on Pages. Later runs just commit and push changes.
Result: https://yooniversity.github.io/
