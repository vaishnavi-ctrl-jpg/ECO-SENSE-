# 🌿 EcoSense: Carbon Footprint Tracker (Leaderboard Edition)

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Google Gemini](https://img.shields.io/badge/gemini-%238E75C2.svg?style=for-the-badge&logo=google-gemini&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

> **Developed for Challenge 3 (PromptWars Virtual) by Hack2Skill in partnership with Google for Developers.**

**EcoSense** is a premium, AI-driven carbon footprint awareness, simulation, and offset tracking platform. Designed using a high-fidelity "Frosted Glassmorphism" dark-emerald design system, it empowers users to visualize their daily carbon score, simulate positive life shifts in real-time, and get personalized advice from an integrated **Gemini AI Eco-CoPilot**.

---

## ✨ Features

- **Daily Carbon Clock Budgeting:** Visual progress utilization rings that compare daily emissions against a sustainable limit of `< 5 kg CO2` per day.
- **Interactive "What-If" Simulator:** Slider controls allowing users to simulate switching to Solar Power, transitioning to Electric Vehicles (EV), or adopting meat-free days, displaying estimated annual CO2 offsets dynamically.
- **Dynamic Category Breakdowns:** Customized interactive SVG donut charts showing relative footprint distribution by source (Travel, Energy, Diet).
- **Gemini-Powered AI Eco-CoPilot:** A conversational chat sidebar that analyzes lifestyle choices, logs custom travel modes, and suggests sustainable carbon reduction strategies.
- **Daily Offset Habits:** Checklists where users log positive acts (e.g., walking, recycling) that immediately count as daily offsets.
- **Build-in-Public LinkedIn Integration:** A template generator that outputs pre-formatted LinkedIn posts to share daily carbon savings and unlock virtual badges.

---

## 💻 Tech Stack

- **Framework:** React 18 (Bootstrapped via Vite)
- **Typing System:** TypeScript
- **AI Core Integration:** Google Generative AI SDK (`@google/generative-ai` version `^0.24.1`)
- **Styling Architecture:** Vanilla CSS (CSS variables, frosted glass backdrops, responsive layouts, neon glows)

---

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vaishnavi-ctrl-jpg/ECO-SENSE-.git
   cd ECO-SENSE-
   ```
2. **Install modules:**
   ```bash
   npm install
   ```
3. **Configure environment keys:**
   Create a `.env` file in the root of the directory and paste your API key:
   ```env
   VITE_GEMINI_API_KEY=your_google_ai_studio_key_here
   ```
4. **Boot the development server:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:5173/** in your browser.
