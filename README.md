# Portfolio

A professional multi-page portfolio website showcasing My competitive programming journey, achievements, problem-setting work, and contest moments.

## Pages

- **Home** — Introduction, background, skills, selected highlights, and contact
- **Achievements** — ICPC Dhaka Regional, Codeforces, AtCoder, CodeChef, and problem-setting experience
- **Gallery** — Filterable visual journal with a fullscreen image viewer

## Features

- Responsive design for desktop, tablet, and mobile
- Light and dark mode toggle with saved preference
- Responsive navigation menu
- Accessible gallery filters and lightbox controls
- Smooth reveal animations with reduced-motion support
- Copy-to-clipboard email action
- No live rating graphs or external chart dependencies
- Original image files preserved without recompression

## Tech Stack

- HTML5
- CSS3 with custom properties and responsive layouts
- Vanilla JavaScript
- Google Fonts: DM Sans and Space Grotesk

## Project Structure

```text
.
├── index.html
├── achievements.html
├── gallery.html
├── favicon.svg
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   └── js/
│       └── site.js
└── .gitignore
```

## Run Locally

From the project directory:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).
