# 🪔 Diwali Party Game Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)
[![Built with HTML5 & Tailwind CSS](https://img.shields.io/badge/Built%20with-HTML5%20%26%20Tailwind%20CSS-EA580C)](https://tailwindcss.com/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-008272)](#quick-start)

An interactive, projector-friendly two-team game show web app designed for hosting Diwali parties and festive game nights. Features a warm **Marigold & Saffron** aesthetic, independent per-game scoreboards, a built-in **30-second Sparkler Timer**, and full keyboard shortcut support for the host.

---

## 🎮 Game Modes

### 1. 🎬 Emoji Cinema Quiz (35 Movies)
Teams take turns picking movie reels across **4 categories** and decoding iconic films from a sequence of **5 emojis**:
- **🗽 Hollywood Blockbusters** (10 reels) — *Titanic, Jurassic Park, The Lion King, The Matrix, Inception, Interstellar, and more*
- **🥁 Kollywood Hits (Tamil)** (9 reels) — *Enthiran, Vaaranam Aayiram, Anniyan, Indian, Sivaji: The Boss, Ghajini, Kaithi, and more*
- **💃 Bollywood Classics (Hindi)** (10 reels) — *3 Idiots, DDLJ, Dangal, Lagaan, Chak De! India, ZNMD, Sholay, PK, and more*
- **🎲 I'm Feeling Lucky** (6 wildcard gems) — *Baahubali, RRR, Manichitrathazhu / Chandramukhi, Drishyam, Up, Inside Out*

**Rules & Scoring:**
- **+10 points** for a correct guess by the active team (or **Steal +10** if passed to the opposing team).
- Optional **Clue (`[H]`)** and **Answer Reveal (`[Space]`)** controls for the host.
- Played reels automatically lock on the board so they aren't picked twice.

---

### 2. 🏷️ Name the Price (15 Everyday & Bay Area Items)
A *Price Is Right*–style showdown featuring 15 recognizable items across Indian groceries, Bay Area transit, and everyday retail (*Indian Cash & Carry, Mylapore, Costco, Whole Foods, Target, Starbucks, Caltrain, BART, FasTrak, Netflix, and US National Parks*).

**Rules & Scoring:**
- Both teams lock in their dollar guesses before the retail price is revealed.
- The app automatically calculates each team's **dollar difference (`$ off`)** and **percentage error (`% off`)**, awarding **+10 points** to the closest team (or **+10 to both** on an exact tie).
- Tracks each team's cumulative **Average `% Off`** across the entire match on the scoreboard.

---

## ✨ Key Features

- **Separate Scoreboards per Game Mode:** Each tab maintains its own independent score, solved counter, active turn, and win streak (`🔥`).
- **Editable Team Names:** Click **Edit Name** on either team panel (defaults to *Sara Vedi 🧨* vs. *Pataka 💥*) to customize for your party.
- **Live Tug-of-War Lead Bar:** Visualizes the point differential between the two teams in real time.
- **30-Second Sparkler Timer:** Built-in countdown timer on every question stage.
- **Two-Click Safe Reset:** Prevents accidental board resets while projecting live.
- **Zero Build Step:** Pure HTML, CSS, and vanilla JavaScript — runs directly from the filesystem (`file://`) or any static host (GitHub Pages, Netlify, Vercel).

---

## ⌨️ Host Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Reveal / hide the movie answer or retail price |
| <kbd>H</kbd> | Show / hide the clue (Emoji Cinema Quiz) |
| <kbd>T</kbd> | Start / pause the 30-second Sparkler Timer |
| <kbd>Enter</kbd> | Reveal price & decide winner when typing inside a price guess input |
| <kbd>Esc</kbd> | Return to the main board without locking the current tile |

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser
No Node.js or build tools required. Clone the repository and open `index.html`:

```bash
git clone https://github.com/karthick12195/diwali-quiz.git
cd diwali-quiz
open index.html
```

### Option 2: Run with a Local Static Server
```bash
python3 -m http.server 8080
# Visit http://localhost:8080
```

### Option 3: Publish with GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings → Pages** in your GitHub repository.
3. Under **Build and deployment**, select **GitHub Actions** (uses the included `.github/workflows/deploy.yml`) or **Deploy from a branch** (`main` / `/ (root)`).
4. Your game hub will be live at `https://<your-username>.github.io/diwali-quiz/`.

---

## 🛠️ Customizing Questions & Items

All game content lives in [`js/data.js`](js/data.js) so you can easily tailor the quiz for your own group:

- **Add or edit movies:** Modify the `CATEGORIES` object in `js/data.js`:
  ```js
  {
    id: 'HW-01',
    num: 1,
    emojis: '🚢 🧊 🎻 💔 🌊',
    answer: 'Titanic (1997)',
    clue: 'Jack and Rose aboard the unsinkable ocean liner.'
  }
  ```
- **Add or edit price items:** Modify the `PRICE_ITEMS` array in `js/data.js` and place product images in `assets/images/`:
  ```js
  {
    id: 'PRC-01',
    num: 1,
    title: 'Gopi Whole Yogurt Plain 64oz',
    store: 'Indian Cash & Carry',
    price: 7.49,
    priceDisplay: '$7.49',
    image: 'assets/images/01-gopi-yogurt.jpg'
  }
  ```

---

## 📁 Project Structure

```text
diwali-quiz/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Automated GitHub Pages deployment workflow
├── assets/
│   ├── favicon.svg          # Festive Diwali diya SVG icon
│   └── images/              # Product photos for Name the Price (01..15)
├── css/
│   └── styles.css           # Marigold & Saffron theme styles and animations
├── js/
│   ├── data.js              # Movie categories (35) & price items (15) datasets
│   └── app.js               # Scoreboard, game state, timer & keyboard controller
├── .gitignore
├── .nojekyll
├── index.html               # Main application entry point
├── LICENSE                  # MIT License
└── README.md
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).
