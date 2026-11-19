# RGUKT Nuzvid · College Website

A static college website for Rajiv Gandhi University of Knowledge Technologies, Nuzvid, built with plain HTML, CSS and JavaScript.
It covers admissions, academics, campus life, fees and contacts. A small help-desk chat sits in the bottom-right corner of every page.

> Student project website. It is not the official college website. Student records used by the help desk are sample data.

## Pages

| Page | Content |
|---|---|
| `index.html` | Home: notice board, announcements, about, programmes, campus life, student quick links |
| `about.html` | The integrated programme, departments, key administrative offices |
| `admissions.html` | Admission process, document checklist, application statuses, FAQ |
| `academics.html` | Branches, academic calendar, rules, examinations, certificate collection |
| `campus.html` | Facilities, timings, student services |
| `fees.html` | Fee list, how to pay, payment not updated |
| `contact.html` | Service directory and department offices |

## Structure

```
css/style.css     Styles (light theme, mobile layout)
js/main.js        Menu, active link
js/chatbot.js     Help-desk chat widget
js/data.js        College information and sample student records for the help desk
assets/logo.svg   Logo
```

## Help desk

The chat answers general questions (admissions, documents, branches, timings, fees, certificates, contacts).
Students can see results, backlogs, fees and certificate status after verifying with a roll number and a 6-digit code.
In this static version the code appears in a sample inbox at the top of the page instead of a real email.

Sample roll numbers: `N231003`, `N231004`, `N221001` (current students), `N201005`, `N201006` (graduates).

## Run locally

Open `index.html` in a browser. No build step or server is needed.

## Publish with GitHub Pages

1. Create a repository and upload the contents of this folder (not the folder itself) to the root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
4. The site appears at `https://<your-username>.github.io/<repository-name>/` after a minute or two.
