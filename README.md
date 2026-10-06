# 🗑️ Google AI Studio - Native Batch Deleter

A lightweight, robust Userscript that adds a native-like bulk delete toolbar, dedicated selection checkboxes, and smart deletion rules directly inside [Google AI Studio](https://aistudio.google.com/library).

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-brightgreen?style=for-the-badge&logo=tampermonkey)

---

## ⚡ Features

- **Seamless Native UI Integration:** Adds a clean `🗑️ Batch Delete ▾` button directly alongside Google AI Studio's native search bar. No screen-blocking windows.
- **Dedicated Table Column:** Injects a neatly aligned checkbox column with a master **Select All** header checkbox without breaking original table widths or styles.
- **Smart Quantity Deletion:** Delete the first $N$ prompts by choosing between:
  - **Newest First:** Cleans prompts from the top down.
  - **Oldest First:** Cleans prompts from the bottom up.
- **Top-Layer Live Progress Tracker:** A sleek floating card monitors real-time progress (`Deleting: X / Total`, session counter, and progress bar) with an instant **⏹ Stop** button.
- **Anti-Desync & Humanized Delays:** Balanced step-by-step asynchronous execution (500ms–800ms) prevents UI lockups, DOM freezing, and Google rate limits.
- **URL-Restricted Execution:** Activates exclusively on `https://aistudio.google.com/library*` to keep your workspace clean.

---

## 🚀 Installation & Usage

### 1. Prerequisite
Install a userscript manager in your browser:
- [Tampermonkey](https://www.tampermonkey.net/) (Recommended)
- [Violentmonkey](https://violentmonkey.github.io/)

### 2. Install Script
[**Click here to install directly**](https://raw.githubusercontent.com/otaviodario/google-ai-studio-bulk-delete/main/google-ai-studio-bulk-delete.user.js)  
*(or create a new script inside Tampermonkey and paste the repository code).*

### 3. How to Use
1. Navigate to your [Google AI Studio Library](https://aistudio.google.com/library).
2. **Option A (Custom Selection):** Check individual prompts (or check the master checkbox next to "Name") and click `🗑️ Delete Selected (N)`.
3. **Option B (Batch Quantity):** Click `🗑️ Batch Delete ▾`, enter how many prompts to remove ($N$), choose **Newest First** or **Oldest First**, and click **▶ Start Deletion**.
4. Track progress via the top-right floating tracker. Click **⏹ Stop** at any time to halt the operation.

---

## 👨‍💻 Author

Developed with care by **Otávio Dario**:
- **GitHub:** [@otaviodario](https://github.com/otaviodario)
- **LinkedIn:** [Otávio Dario](https://linkedin.com/in/otaviodario)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
