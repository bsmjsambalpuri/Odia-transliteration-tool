# Odia typing tool

Link : <a href="https://bsmjsambalpuri.github.io/Odia-transliteration-tool/" target="_blank">Odia typing tool</a>

A fast and lightweight **English to Odia Transliteration Tool** built using pure JavaScript.

This project converts English phonetic typing into **Odia Unicode text** instantly inside the browser.

Example:

| English Input | Odia Output |
|---|---|
| odia | ଓଡ଼ିଆ |
| namaskar | ନମସ୍କାର |
| sambalpuri | ସମ୍ବଲପୁରୀ |

---

# Features

- Fast real-time transliteration
- Pure JavaScript (No frameworks)
- Lightweight and easy to modify
- Responsive modern UI
- Database-driven word replacement
- Rule-based transliteration engine
- Open-source and community improvable

---

# How It Works

The converter follows multiple stages while converting text.

## Conversion Flow

```text
1. WORD_CACHE
2. Full DB match (raw)
3. ch → chh DB match
4. Greedy partial DB split
5. Normalize
6. Full DB match (normalized)
7. ruleBased()
    ├── CLUSTERS
    ├── CONSONANTS
    ├── MATRA
    └── VOWELS
8. postProcess()
```

---

# Project Structure

```text
project/
│
├── index.html
├── css/
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── engine.js
│   └── db-data.js
│
└── README.md
```

---

# Database-Based Conversion

The converter first checks whether a word already exists inside the database.

Example:

```javascript
{
   "namaskar": "ନମସ୍କାର",
   "odia": "ଓଡ଼ିଆ"
}
```

If found, the database value is directly used.

This improves:

- Accuracy
- Proper spelling
- Common word handling
- Speed

---

# Rule-Based Conversion

If a word is not found in the database, the engine uses transliteration rules.

Example:

```text
ka → କ
ki → କି
ku → କୁ
kha → ଖ
```

The engine combines:

- Consonants
- Vowels
- Matras
- Clusters

to generate valid Odia Unicode text.

---

# Community Contribution

This project is open for contributors.

You can help improve the converter by:

- Adding new words
- Fixing spellings
- Improving transliteration rules
- Reporting issues

---

# How To Add New Words

Open:

```text
js/db-data.js
```

Add entries like this:

```javascript
{
   "sambalpuri": "ସମ୍ବଲପୁରୀ",
   "bargarh": "ବରଗଡ଼",
   "kalahandi": "କଳାହାଣ୍ଡି"
}
```

Try to add:

- Frequently used Odia words
- Person and place names
- Sambalpuri words
- Common spelling corrections (many English words need to be corrected)

---

# Contribution Guidelines

## 1. Fork Repository

Click the **Fork** button on GitHub.

---

## 2. Create Branch

```bash
git checkout -b improve-database
```

---

## 3. Make Changes

- Add words
- Improve rules
- Fix bugs

---

## 4. Commit Changes

```bash
git commit -m "Added new Odia words"
```

---

## 5. Push Changes

```bash
git push origin improve-database
```

---

## 6. Create Pull Request

Submit a Pull Request from GitHub.

---

# Running Locally

Simply open:

```text
index.html
```

inside a browser.

Or use VS Code Live Server.

---

# Future Improvements

Planned features:

- Suggestion engine
- Auto spell correction
- AI-assisted transliteration
- Word frequency learning

---

# License

MIT License

Free to use and modify.

---

# Support The Project

If you like this project:

- Star the repository
- Report bugs
- Contribute words
- Share with others

---

# Author

Developed by BSMJSambalpuri
