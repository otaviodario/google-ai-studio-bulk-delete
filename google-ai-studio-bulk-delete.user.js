// ==UserScript==
// @name         Google AI Studio - Native Batch Deleter
// @namespace    https://github.com/otaviodario/google-ai-studio-bulk-delete
// @version      4.2.0
// @description  Batch deleter with persistent crystal-clear progress tracker, safe delays, and table checkboxes (TrustedHTML & Cross-browser compatible)
// @author       Otávio Dario (https://github.com/otaviodario)
// @match        https://aistudio.google.com/library*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aistudio.google.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let totalDeletedSession = 0;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const waitForElement = (selector, timeout = 4000) => {
        return new Promise((resolve) => {
            const start = Date.now();
            const check = () => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                if (Date.now() - start > timeout) return resolve(null);
                requestAnimationFrame(check);
            };
            check();
        });
    };

    // Auxiliar seguro contra 'TrustedHTML' (não usa innerHTML)
    function createEl(tag, props = {}, ...children) {
        const el = document.createElement(tag);
        for (const [key, val] of Object.entries(props)) {
            if (key === 'className') {
                el.className = val;
            } else if (key === 'style' && typeof val === 'object') {
                Object.assign(el.style, val);
            } else if (key.startsWith('on') && typeof val === 'function') {
                el.addEventListener(key.slice(2).toLowerCase(), val);
            } else if (key === 'disabled') {
                if (val) el.setAttribute('disabled', '');
            } else {
                el.setAttribute(key, val);
            }
        }
        for (const child of children) {
            if (typeof child === 'string' || typeof child === 'number') {
                el.appendChild(document.createTextNode(child));
            } else if (child instanceof Node) {
                el.appendChild(child);
            }
        }
        return el;
    }

    // --- Injeção de Estilos CSS ---
    function injectStyles() {
        if (document.getElementById('nb-core-styles')) return;
        const style = document.createElement('style');
        style.id = 'nb-core-styles';
        style.textContent = `
            .cdk-overlay-backdrop,
            .cdk-overlay-dark-backdrop {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
            }

            #nb-trigger-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
                margin-left: 8px;
            }
            #nb-trigger-btn {
                background: #1e1f20;
                color: #e3e3e3;
                border: 1px solid #3c4043;
                border-radius: 20px;
                padding: 6px 14px;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 13px;
                font-weight: 500;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: background 0.2s, border-color 0.2s;
            }
            #nb-trigger-btn:hover {
                background: #282a2d;
                border-color: #8ab4f8;
            }

            #nb-modal-popover {
                position: absolute;
                top: calc(100% + 8px);
                right: 0;
                width: 290px;
                background: #1e1f20;
                border: 1px solid #3c4043;
                border-radius: 12px;
                padding: 14px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
                z-index: 999999;
                display: none;
                flex-direction: column;
                gap: 12px;
                color: #e3e3e3;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 13px;
                user-select: none;
            }
            #nb-modal-popover.open { display: flex; }

            .nb-popover-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                color: #a8c7fa;
            }
            .nb-close-btn {
                background: transparent;
                border: none;
                color: #9aa0a6;
                cursor: pointer;
                font-size: 16px;
                line-height: 1;
            }
            .nb-close-btn:hover { color: #fff; }

            .nb-input-row {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .nb-input {
                background: #131314;
                border: 1px solid #3c4043;
                border-radius: 6px;
                padding: 6px 8px;
                color: #fff;
                width: 60px;
                font-size: 13px;
                text-align: center;
                outline: none;
            }
            .nb-select {
                flex: 1;
                background: #131314;
                border: 1px solid #3c4043;
                border-radius: 6px;
                padding: 6px 8px;
                color: #fff;
                font-size: 12px;
                outline: none;
                cursor: pointer;
            }

            .nb-btn {
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: opacity 0.2s, background 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            .nb-btn:disabled { opacity: 0.35; cursor: not-allowed; }
            .nb-btn-primary { background: #1a73e8; color: #fff; width: 100%; }
            .nb-btn-primary:hover:not(:disabled) { background: #1557b0; }

            .nb-footer {
                text-align: center;
                font-size: 11px;
                color: #80868b;
                border-top: 1px solid #303134;
                padding-top: 8px;
            }
            .nb-footer a { color: #8ab4f8; text-decoration: none; }

            th.nb-table-col, td.nb-table-col {
                width: 44px !important;
                min-width: 44px !important;
                max-width: 44px !important;
                text-align: center !important;
                vertical-align: middle !important;
                padding: 0 !important;
                border-bottom: 1px solid #303134 !important;
            }
            .nb-checkbox {
                accent-color: #1a73e8;
                cursor: pointer;
                width: 17px;
                height: 17px;
                margin: 0 auto;
                display: block;
            }

            #nb-running-tracker {
                position: fixed !important;
                top: 24px !important;
                right: 24px !important;
                width: 270px !important;
                background: #1e1f20 !important;
                color: #e3e3e3 !important;
                border: 1px solid #5f6368 !important;
                border-radius: 12px !important;
                padding: 14px 16px !important;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.95) !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
                display: none;
                flex-direction: column;
                gap: 10px;
                animation: nbFadeIn 0.2s ease-out;
            }

            @keyframes nbFadeIn {
                from { opacity: 0; transform: translateY(-8px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .tracker-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
                font-size: 13px;
                color: #8ab4f8;
            }
            .tracker-info {
                display: flex;
                flex-direction: column;
                gap: 4px;
                font-size: 12px;
            }
            .tracker-progress-text {
                font-weight: 500;
                color: #f1f3f4;
            }
            .tracker-total-text {
                font-size: 11px;
                color: #9aa0a6;
            }
            .tracker-bar-bg {
                background: #303134;
                height: 4px;
                border-radius: 2px;
                overflow: hidden;
            }
            .tracker-bar-fill {
                background: #1a73e8;
                height: 100%;
                width: 0%;
                transition: width 0.3s;
            }
            .tracker-btn-stop {
                background: #d93025 !important;
                color: #fff !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 8px !important;
                font-size: 12px !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                pointer-events: auto !important;
                transition: background 0.2s;
            }
            .tracker-btn-stop:hover { background: #a51d24 !important; }
        `;
        document.head.appendChild(style);
    }

    // --- Inserir o Botão de Gatilho ---
    function injectHeaderTrigger() {
        if (document.getElementById('nb-trigger-wrap')) return;

        const container = document.querySelector('.header-actions, ms-library-search-bar')?.parentElement
                       || document.querySelector('.header-container')
                       || document.querySelector('input[placeholder*="Search"]')?.parentElement?.parentElement;

        if (!container) return;

        const wrap = createEl('div', { id: 'nb-trigger-wrap' },
            createEl('button', { id: 'nb-trigger-btn' },
                createEl('span', {}, '🗑️ Batch Delete'),
                createEl('span', {}, ' ▾')
            ),
            createEl('div', { id: 'nb-modal-popover' },
                createEl('div', { className: 'nb-popover-header' },
                    createEl('span', {}, 'Batch Actions'),
                    createEl('button', { className: 'nb-close-btn', id: 'nb-popover-close' }, '✕')
                ),
                createEl('button', { id: 'nb-delete-selected', className: 'nb-btn nb-btn-primary', disabled: true },
                    '🗑️ Delete Selected (0)'
                ),
                createEl('div', { style: { display: 'flex', alignItems: 'center', color: '#5f6368', fontSize: '11px' } },
                    createEl('div', { style: { flex: '1', height: '1px', background: '#3c4043' } }),
                    createEl('span', { style: { padding: '0 6px' } }, 'or by quantity'),
                    createEl('div', { style: { flex: '1', height: '1px', background: '#3c4043' } })
                ),
                createEl('div', { className: 'nb-input-row' },
                    createEl('input', { type: 'number', id: 'nb-count-input', className: 'nb-input', value: '10', min: '1', max: '500' }),
                    createEl('select', { id: 'nb-order-select', className: 'nb-select' },
                        createEl('option', { value: 'newest' }, 'Newest First'),
                        createEl('option', { value: 'oldest' }, 'Oldest First')
                    )
                ),
                createEl('button', { id: 'nb-btn-start', className: 'nb-btn nb-btn-primary' }, '▶ Start Deletion'),
                createEl('div', { className: 'nb-footer' },
                    'Developed by ',
                    createEl('a', { href: 'https://github.com/otaviodario', target: '_blank' }, 'Otávio Dario'),
                    createEl('span', {}, ' • '),
                    createEl('a', { href: 'https://github.com/otaviodario/google-ai-studio-bulk-delete', target: '_blank' }, 'Repo')
                )
            )
        );

        container.appendChild(wrap);
        setupPopoverEvents();
    }

    // --- Card Flutuante de Progresso e Botão Stop ---
    function ensureRunningTracker() {
        let tracker = document.getElementById('nb-running-tracker');

        if (!tracker) {
            tracker = createEl('div', { id: 'nb-running-tracker' },
                createEl('div', { className: 'tracker-title' },
                    createEl('span', {}, '⚡ Batch Deleting'),
                    createEl('span', { id: 'tracker-spinner' }, '⏳')
                ),
                createEl('div', { className: 'tracker-info' },
                    createEl('span', { id: 'tracker-progress', className: 'tracker-progress-text' }, 'Deleting: 0 / 0'),
                    createEl('span', { id: 'tracker-session-total', className: 'tracker-total-text' }, 'Session deleted: 0')
                ),
                createEl('div', { className: 'tracker-bar-bg' },
                    createEl('div', { id: 'tracker-bar-fill', className: 'tracker-bar-fill' })
                ),
                createEl('button', { id: 'tracker-stop-btn', className: 'tracker-btn-stop' }, '⏹ Stop')
            );

            tracker.querySelector('#tracker-stop-btn').onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                isRunning = false;
                updateTrackerStatus('Stopped.');
            };

            document.body.appendChild(tracker);
        }

        const overlay = document.querySelector('.cdk-overlay-container, div.cdk-overlay-popover');
        const target = overlay || document.body;

        if (tracker.parentElement !== target) {
            target.appendChild(tracker);
        }
    }

    function showTracker(title, total) {
        ensureRunningTracker();
        const tracker = document.getElementById('nb-running-tracker');
        if (!tracker) return;

        tracker.style.display = 'flex';
        document.getElementById('tracker-spinner').textContent = '⏳';
        document.getElementById('tracker-progress').textContent = `${title}: 0 / ${total}`;
        document.getElementById('tracker-session-total').textContent = `Total deleted: ${totalDeletedSession}`;
        document.getElementById('tracker-bar-fill').style.width = '0%';
    }

    function updateTrackerProgress(current, total) {
        ensureRunningTracker();
        const percent = Math.min(100, Math.round((current / total) * 100));
        document.getElementById('tracker-progress').textContent = `Deleting: ${current} / ${total}`;
        document.getElementById('tracker-session-total').textContent = `Total deleted: ${totalDeletedSession}`;
        document.getElementById('tracker-bar-fill').style.width = `${percent}%`;
    }

    function updateTrackerStatus(statusText) {
        const tracker = document.getElementById('nb-running-tracker');
        if (!tracker) return;

        document.getElementById('tracker-progress').textContent = statusText;
        document.getElementById('tracker-spinner').textContent = '✔';
        setTimeout(() => {
            if (!isRunning) {
                tracker.style.display = 'none';
            }
        }, 3500);
    }

    // --- Coluna de Checkboxes ---
    function syncTableCheckboxes() {
        const theadRow = document.querySelector('table.mat-mdc-table thead tr, thead tr[role="row"]');
        if (theadRow && !theadRow.querySelector('.nb-table-col')) {
            const masterChk = createEl('input', {
                type: 'checkbox',
                className: 'nb-checkbox nb-select-all',
                title: 'Select All'
            });

            masterChk.addEventListener('change', () => {
                document.querySelectorAll('.nb-row-chk').forEach(c => (c.checked = masterChk.checked));
                updateSelectionState();
            });

            const th = createEl('th', { className: 'nb-table-col mat-mdc-header-cell cdk-header-cell' }, masterChk);
            theadRow.insertBefore(th, theadRow.firstChild);
        }

        const tbodyRows = document.querySelectorAll('table.mat-mdc-table tbody tr.mat-mdc-row, tbody tr[role="row"]');
        tbodyRows.forEach(row => {
            if (row.querySelector('.nb-table-col')) return;

            const chk = createEl('input', {
                type: 'checkbox',
                className: 'nb-checkbox nb-row-chk',
                title: 'Select prompt'
            });

            chk.addEventListener('click', (e) => e.stopPropagation());
            chk.addEventListener('change', updateSelectionState);

            const td = createEl('td', { className: 'nb-table-col mat-mdc-cell cdk-cell' }, chk);
            row.insertBefore(td, row.firstChild);
        });
    }

    function updateSelectionState() {
        const total = document.querySelectorAll('.nb-row-chk').length;
        const checked = document.querySelectorAll('.nb-row-chk:checked').length;

        const deleteSelectedBtn = document.getElementById('nb-delete-selected');
        const masterChk = document.querySelector('.nb-select-all');

        if (deleteSelectedBtn) {
            deleteSelectedBtn.disabled = checked === 0 || isRunning;
            deleteSelectedBtn.textContent = `🗑️ Delete Selected (${checked})`;
        }

        if (masterChk) {
            masterChk.checked = total > 0 && checked === total;
            masterChk.indeterminate = checked > 0 && checked < total;
        }
    }

    // --- Exclusão com Delays Seguros e Humanizados ---
    async function executeSingleDelete(moreBtn) {
        if (!isRunning) return false;

        // 1. Abre o menu de opções da linha
        moreBtn.click();
        await sleep(500);

        if (!isRunning) {
            document.body.click();
            return false;
        }

        // 2. Clica na opção Delete do menu
        const deleteOption = Array.from(document.querySelectorAll('[role="menuitem"], button')).find(el => {
            return el.innerText && el.innerText.trim().toLowerCase().startsWith('delete');
        });

        if (!deleteOption) {
            document.body.click();
            await sleep(400);
            return false;
        }

        deleteOption.click();
        await sleep(600);

        if (!isRunning) return false;

        // 3. Localiza e confirma a exclusão no modal
        await waitForElement('[role="dialog"], mat-dialog-container', 3000);
        ensureRunningTracker();

        const confirmBtn = Array.from(document.querySelectorAll('[role="dialog"] button, mat-dialog-container button')).find(btn => {
            return btn.innerText && btn.innerText.trim().toLowerCase() === 'delete';
        });

        if (confirmBtn && isRunning) {
            confirmBtn.click();

            // 4. Aguarda a requisição do Google ser concluída
            let waited = 0;
            while (document.querySelector('[role="dialog"]') && waited < 4000) {
                await sleep(200);
                waited += 200;
            }

            totalDeletedSession++;
            await sleep(800);
            return true;
        }

        document.body.click();
        await sleep(400);
        return false;
    }

    // --- Configuração dos Eventos ---
    function setupPopoverEvents() {
        const trigger = document.getElementById('nb-trigger-btn');
        const popover = document.getElementById('nb-modal-popover');
        const closeBtn = document.getElementById('nb-popover-close');
        const deleteSelectedBtn = document.getElementById('nb-delete-selected');
        const startBtn = document.getElementById('nb-btn-start');

        if (!trigger || !popover) return;

        trigger.onclick = (e) => {
            e.stopPropagation();
            if (isRunning) return;
            popover.classList.toggle('open');
        };

        closeBtn.onclick = (e) => {
            e.stopPropagation();
            popover.classList.remove('open');
        };

        document.addEventListener('click', (e) => {
            if (!popover.contains(e.target) && e.target !== trigger) {
                popover.classList.remove('open');
            }
        });

        // 1. Deletar Selecionados
        deleteSelectedBtn.onclick = async () => {
            const checkedBoxes = Array.from(document.querySelectorAll('.nb-row-chk:checked'));
            if (checkedBoxes.length === 0) return;

            popover.classList.remove('open');
            isRunning = true;

            const total = checkedBoxes.length;
            showTracker('Selected', total);

            let count = 0;
            for (const chk of checkedBoxes) {
                if (!isRunning) break;

                const row = chk.closest('tr');
                const moreBtn = row ? row.querySelector('button[aria-label*="More"], button:has(mat-icon)') : null;

                if (moreBtn) {
                    const ok = await executeSingleDelete(moreBtn);
                    if (ok) {
                        count++;
                        updateTrackerProgress(count, total);
                    }
                }
            }

            isRunning = false;
            updateSelectionState();
            updateTrackerStatus(count >= total ? 'Finished!' : 'Stopped.');
        };

        // 2. Deletar por Quantidade N (Newest / Oldest)
        startBtn.onclick = async () => {
            const limit = parseInt(document.getElementById('nb-count-input').value, 10) || 10;
            const order = document.getElementById('nb-order-select').value;

            popover.classList.remove('open');
            isRunning = true;

            showTracker(order === 'newest' ? 'Newest' : 'Oldest', limit);

            let count = 0;
            while (isRunning && count < limit) {
                const moreButtons = Array.from(document.querySelectorAll('button')).filter(btn => {
                    const aria = (btn.getAttribute('aria-label') || '').toLowerCase();
                    const icon = btn.querySelector('mat-icon');
                    return aria.includes('more') || (icon && icon.textContent.includes('more_vert'));
                });

                if (moreButtons.length === 0) break;

                const targetBtn = order === 'newest' ? moreButtons[0] : moreButtons[moreButtons.length - 1];

                const ok = await executeSingleDelete(targetBtn);
                if (ok) {
                    count++;
                    updateTrackerProgress(count, limit);
                } else {
                    await sleep(500);
                }
            }

            isRunning = false;
            updateTrackerStatus(count >= limit ? 'Finished!' : 'Stopped.');
        };
    }

    // --- Ciclo de Vida da Biblioteca ---
    setInterval(() => {
        if (!window.location.pathname.toLowerCase().startsWith('/library')) return;

        injectStyles();
        injectHeaderTrigger();
        ensureRunningTracker();
        syncTableCheckboxes();
    }, 600);
})();
