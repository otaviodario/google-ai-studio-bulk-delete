# 🗑️ Google AI Studio - Native Batch Deleter

<p align="left">
  <!-- Language Switcher Cards / Badges -->
  <a href="#-english-version">
    <img src="https://img.shields.io/badge/Language-English-blue?style=for-the-badge&logo=google-translate&logoColor=white" alt="English">
  </a>
  <a href="#-versão-em-português">
    <img src="https://img.shields.io/badge/Idioma-Portugu%C3%AAs-green?style=for-the-badge&logo=google-translate&logoColor=white" alt="Português">
  </a>
</p>

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Supported-brightgreen?style=for-the-badge&logo=tampermonkey)

---

## 🇺🇸 English Version

A lightweight, robust Userscript that adds a native-like bulk delete toolbar, dedicated selection checkboxes, and smart deletion rules directly inside [Google AI Studio](https://aistudio.google.com/library).

### ⚡ Features
- **Seamless Native UI Integration:** Adds a clean `🗑️ Batch Delete ▾` button directly alongside Google AI Studio's native search bar. No screen-blocking windows.
- **Dedicated Table Column:** Injects a neatly aligned checkbox column with a master **Select All** header checkbox without breaking original table widths or styles.
- **Smart Quantity Deletion:** Delete the first $N$ prompts by choosing between:
  - **Newest First:** Cleans prompts from the top down.
  - **Oldest First:** Cleans prompts from the bottom up.
- **Top-Layer Live Progress Tracker:** A sleek floating card monitors real-time progress (`Deleting: X / Total`, session counter, and progress bar) with an instant **⏹ Stop** button.
- **Anti-Desync & Humanized Delays:** Balanced step-by-step asynchronous execution (500ms–800ms) prevents UI lockups, DOM freezing, and Google rate limits.
- **URL-Restricted Execution:** Activates exclusively on `https://aistudio.google.com/library*` to keep your workspace clean.

### 🚀 Installation & Usage
1. **Prerequisite:** Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. **Install Script:** [**Click here to install directly**](https://raw.githubusercontent.com/otaviodario/google-ai-studio-bulk-delete/main/google-ai-studio-bulk-delete.user.js) *(or create a new script manually and paste the repository code)*.
3. **Usage:**
   - Go to [Google AI Studio Library](https://aistudio.google.com/library).
   - **Option A (Custom Selection):** Check individual prompts (or check the master checkbox next to "Name") and click `🗑️ Delete Selected (N)`.
   - **Option B (Batch Quantity):** Click `🗑️ Batch Delete ▾`, enter how many prompts to remove ($N$), choose **Newest First** or **Oldest First**, and click **▶ Start Deletion**.
   - Track progress via the top-right floating tracker. Click **⏹ Stop** at any time to halt the operation.

---

## 🇧🇷 Versão em Português

<details open>
<summary><b>Clique para expandir/recolher a documentação em Português</b></summary>
<br>

Um Userscript leve e robusto que integra uma barra de ferramentas nativa de exclusão em massa, coluna própria de seleção e regras inteligentes diretamente no [Google AI Studio](https://aistudio.google.com/library).

### ⚡ Funcionalidades
- **Interface Nativa e Limpa:** Adiciona um botão arredondado `🗑️ Batch Delete ▾` integrado ao lado da barra de busca oficial do AI Studio. Sem janelas invasivas.
- **Coluna Própria na Tabela:** Insere checkboxes alinhados perfeitamente com um checkbox mestre **Selecionar Tudo** no cabeçalho, sem quebrar larguras de colunas.
- **Exclusão Inteligente por Quantidade:** Apague os primeiros $N$ prompts escolhendo a direção:
  - **Newest First (Mais Recentes):** Apaga de cima para baixo.
  - **Oldest First (Mais Antigos):** Apaga de baixo para cima.
- **Card Flutuante em Tempo Real:** Mostra o progresso ao vivo (`Deleting: X / Total`, contador de sessão e barra azul) com o botão **⏹ Stop** para interromper a qualquer momento.
- **Delays Seguros Anti-Travamento:** Ritmo assíncrono calibrado (500ms–800ms) para evitar bloqueios de requisições ou travamento da página.
- **Ativação Restrita:** Funciona com exclusividade na URL `https://aistudio.google.com/library*`.

### 🚀 Instalação e Como Usar
1. **Pré-requisito:** Instale uma extensão como o [Tampermonkey](https://www.tampermonkey.net/) ou [Violentmonkey](https://violentmonkey.github.io/).
2. **Instalar o Script:** [**Clique aqui para instalar diretamente**](https://raw.githubusercontent.com/otaviodario/google-ai-studio-bulk-delete/main/google-ai-studio-bulk-delete.user.js).
3. **Como Usar:**
   - Abra a [Biblioteca do Google AI Studio](https://aistudio.google.com/library).
   - **Opção A (Marcando Itens):** Marque os quadradinhos que deseja excluir (ou o mestre para todos) e clique em `🗑️ Delete Selected (N)`.
   - **Opção B (Por Quantidade):** Abra o menu `🗑️ Batch Delete ▾`, defina a quantidade ($N$), selecione **Newest First** ou **Oldest First** e clique em **▶ Start Deletion**.
   - Acompanhe no card no canto superior direito e aperte **⏹ Stop** se quiser parar.

</details>

---

## 👨‍💻 Author / Autor

Developed with care by / Desenvolvido por **Otávio Dario**:
- **GitHub:** [@otaviodario](https://github.com/otaviodario)
- **LinkedIn:** [Otávio Dario](https://linkedin.com/in/otaviodario)

---

## 📄 License / Licença

This project is licensed under the [MIT License](LICENSE). / Este projeto está sob a licença [MIT](LICENSE).
