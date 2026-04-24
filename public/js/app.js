/**
 * Election Simulator Assistant - App UI Logic
 * Handles view switching, DOM updates, and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    if (typeof scenariosData === 'undefined' || typeof DecisionEngine === 'undefined') {
        console.error("Required scripts (data.js or engine.js) not loaded.");
        return;
    }

    const engine = new DecisionEngine(scenariosData);

    const views = {
        roleSelection: document.getElementById('role-selection-view'),
        simulation: document.getElementById('simulation-view'),
        summary: document.getElementById('summary-view')
    };

    const ui = {
        resetBtn: document.getElementById('reset-btn'),
        roleCards: document.querySelectorAll('.role-card'),
        sceneAvatar: document.getElementById('scene-avatar'),
        sceneTitle: document.getElementById('scene-title'),
        sceneDescription: document.getElementById('scene-description'),
        sceneRole: document.getElementById('scene-role'),
        roleIndicator: document.getElementById('role-indicator'),
        optionsContainer: document.getElementById('options-container'),
        feedbackAlert: document.getElementById('feedback-alert'),
        feedbackText: document.getElementById('feedback-text'),
        scoreDisplay: document.getElementById('score-display'),
        progressFill: document.getElementById('progress-fill'),
        stageLabel: document.getElementById('stage-label'),
        sceneCard: document.getElementById('scene-card'),
        summaryRoleName: document.getElementById('summary-role-name'),
        summaryStatus: document.getElementById('summary-status'),
        statScore: document.getElementById('stat-score'),
        statScenes: document.getElementById('stat-scenes'),
        historyList: document.getElementById('history-list'),
        missedList: document.getElementById('missed-list'),
        badgeList: document.getElementById('badge-list'),
        whatIfList: document.getElementById('what-if-list'),
        playAgainBtn: document.getElementById('play-again-btn'),
        tryPathBtn: document.getElementById('try-path-btn')
    };

    /**
     * Helper to track events with Google Analytics
     */
    function trackEvent(action, category, label, value) {
        if (typeof gtag === 'function') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label,
                'value': value
            });
        }
    }

    function switchView(viewName) {
        Object.values(views).forEach(view => {
            view.classList.remove('active');
            view.style.display = 'none';
        });
        
        const activeView = views[viewName];
        activeView.style.display = 'block';
        // Force reflow for transition
        void activeView.offsetWidth;
        activeView.classList.add('active');

        ui.resetBtn.hidden = viewName === 'roleSelection';
        window.scrollTo(0, 0);
    }

    ui.roleCards.forEach(card => {
        card.addEventListener('click', () => {
            const role = card.dataset.role;
            trackEvent('start_game', 'role_selection', role);
            startSimulation(role);
        });
    });

    ui.resetBtn.addEventListener('click', () => {
        switchView('roleSelection');
    });

    ui.playAgainBtn.addEventListener('click', () => {
        switchView('roleSelection');
    });

    ui.tryPathBtn.addEventListener('click', () => {
        if (engine.currentRole) {
            trackEvent('retry_path', 'gameplay', engine.currentRole);
            startSimulation(engine.currentRole);
        }
    });

    function startSimulation(role) {
        engine.startRole(role);
        updateScoreDisplay();
        updateHUD();
        renderNode();
        switchView('simulation');
    }

    function updateScoreDisplay() {
        ui.scoreDisplay.textContent = `Democracy Score: ${engine.score}`;
    }

    function updateHUD() {
        if (!engine.currentRole) return;
        const role = scenariosData[engine.currentRole];
        ui.roleIndicator.textContent = `${role.roleAvatar} ${role.title} Journey`;
        ui.sceneRole.textContent = `${role.roleAvatar} ${role.title}`;
        
        const currentStep = engine.history.length + 1;
        const totalSteps = 7; // Estimated total
        const progress = Math.min(100, (currentStep / totalSteps) * 100);
        
        ui.progressFill.style.width = `${progress}%`;
        ui.stageLabel.textContent = `Stage ${currentStep} of ${totalSteps}`;
    }

    function renderNode() {
        const node = engine.getCurrentNode();
        if (!node) return;

        // Hide feedback on new node
        ui.feedbackAlert.classList.add('hidden');
        // Clear options container securely
        while (ui.optionsContainer.firstChild) {
            ui.optionsContainer.removeChild(ui.optionsContainer.firstChild);
        }

        if (node.isEnd) {
            renderSummary();
            return;
        }

        // Apply scene transition
        ui.sceneCard.style.animation = 'none';
        void ui.sceneCard.offsetWidth; // trigger reflow
        ui.sceneCard.style.animation = 'slideIn 0.5s ease-out';

        ui.sceneAvatar.textContent = node.avatar || scenariosData[engine.currentRole].roleAvatar;
        ui.sceneTitle.textContent = node.title;
        ui.sceneDescription.textContent = node.text;
        updateHUD();

        node.choices.forEach((choice, index) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.setAttribute('aria-label', `Select option: ${choice.text}`);
            
            const textSpan = document.createElement('span');
            textSpan.textContent = choice.text;
            btn.appendChild(textSpan);
            
            const iconSpan = document.createElement('span');
            iconSpan.textContent = '→';
            btn.appendChild(iconSpan);

            btn.addEventListener('click', () => handleOptionSelect(index, btn));
            ui.optionsContainer.appendChild(btn);
        });
    }

    function handleOptionSelect(index, btnElement) {
        const buttons = ui.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(b => b.disabled = true);

        const result = engine.processDecision(index);
        if (!result) return;

        trackEvent('make_decision', 'gameplay', engine.currentNodeId, result.scoreChange);

        if (result.scoreChange > 0) {
            btnElement.classList.add('correct');
            showFeedback('success', `✔ ${result.feedback}`);
        } else if (result.scoreChange < 0) {
            btnElement.classList.add('incorrect');
            showFeedback('error', `❌ ${result.feedback}`);
        } else {
            btnElement.classList.add('neutral');
            showFeedback('neutral', `• ${result.feedback}`);
        }

        if (result.randomEvent) {
            // Append random event text if it happened
            ui.feedbackText.textContent += ` ${result.randomEvent}`;
        }

        updateScoreDisplay();
        updateHUD();

        // Delay before moving to next scene for feedback to be read
        setTimeout(() => {
            if (result.isGameOver) {
                renderSummary();
            } else {
                renderNode();
            }
        }, 1800);
    }

    function showFeedback(type, text) {
        if (!text) return;
        ui.feedbackAlert.className = `feedback-alert ${type}`;
        ui.feedbackText.textContent = text;
        ui.feedbackAlert.classList.remove('hidden');
    }

    function renderSummary() {
        const summary = engine.getSummary();
        trackEvent('game_end', 'gameplay', summary.status, summary.finalScore);

        ui.summaryRoleName.textContent = summary.roleName;
        ui.statScore.textContent = summary.finalScore;
        ui.statScenes.textContent = summary.history.length;

        if (summary.status === "END_GOOD") {
            ui.summaryStatus.textContent = "✔ Outcome: Democratic journey completed successfully.";
            ui.summaryStatus.className = "summary-status success";
        } else if (summary.status === "END_MIXED") {
            ui.summaryStatus.textContent = "⚠ Outcome: Mixed ending. Process completed but with unresolved risks.";
            ui.summaryStatus.className = "summary-status";
        } else {
            ui.summaryStatus.textContent = "❌ Outcome: Run ended with procedural or ethical breakdown.";
            ui.summaryStatus.className = "summary-status fail";
        }

        // Use DocumentFragment for efficient DOM updates
        const historyFrag = document.createDocumentFragment();
        summary.history.forEach((step, index) => {
            const li = document.createElement('li');
            
            const title = document.createElement('strong');
            title.textContent = `Scene ${index + 1}: ${step.sceneTitle}`;
            li.appendChild(title);

            const details = [
                `Action: ${step.choiceText}`,
                `Consequence: ${step.feedback}`,
                `Score impact: ${step.scoreChange > 0 ? '+' : ''}${step.scoreChange}`
            ];
            
            details.forEach(text => {
                const div = document.createElement('div');
                div.textContent = text;
                li.appendChild(div);
            });

            if (step.randomEvent) {
                const eventDiv = document.createElement('div');
                eventDiv.textContent = `Event: ${step.randomEvent}`;
                li.appendChild(eventDiv);
            }
            
            historyFrag.appendChild(li);
        });
        // Clear lists securely
        while (ui.historyList.firstChild) ui.historyList.removeChild(ui.historyList.firstChild);
        ui.historyList.appendChild(historyFrag);

        // Insights logic
        const seenInsights = new Set(summary.history.map(step => step.insight).filter(Boolean));
        const allInsights = [];
        Object.values(scenariosData[engine.currentRole].nodes).forEach(node => {
            (node.choices || []).forEach(choice => {
                if (choice.insight) allInsights.push(choice.insight);
            });
        });
        
        const missed = [...new Set(allInsights)].filter(insight => !seenInsights.has(insight)).slice(0, 5);
        while (ui.missedList.firstChild) ui.missedList.removeChild(ui.missedList.firstChild);
        if (missed.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'You explored nearly every major learning branch in this role.';
            ui.missedList.appendChild(li);
        } else {
            missed.forEach(insight => {
                const li = document.createElement('li');
                li.textContent = insight;
                ui.missedList.appendChild(li);
            });
        }

        // Achievements
        while (ui.badgeList.firstChild) ui.badgeList.removeChild(ui.badgeList.firstChild);
        summary.achievements.forEach(badge => {
            const li = document.createElement('li');
            li.textContent = `🏆 ${badge}`;
            ui.badgeList.appendChild(li);
        });

        // What If options
        while (ui.whatIfList.firstChild) ui.whatIfList.removeChild(ui.whatIfList.firstChild);
        const whatIf = summary.whatIfOptions || [];
        if (whatIf.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No alternate branch available from the latest decision.';
            ui.whatIfList.appendChild(li);
        } else {
            whatIf.forEach(item => {
                const li = document.createElement('li');
                
                const text = document.createElement('div');
                text.textContent = `Instead of "${item.currentChoice}"`;
                li.appendChild(text);

                const btn = document.createElement('button');
                btn.className = 'ghost-btn';
                btn.textContent = `Try: ${item.altChoice}`;
                btn.style.marginTop = '8px';
                btn.addEventListener('click', () => {
                    trackEvent('what_if_apply', 'gameplay', item.altChoice);
                    const result = engine.applyWhatIf(item.decisionIndex, item.altChoice);
                    if (!result) return;
                    updateScoreDisplay();
                    updateHUD();
                    switchView('simulation');
                    renderNode();
                });

                li.appendChild(btn);
                ui.whatIfList.appendChild(li);
            });
        }

        switchView('summary');
    }

    // Basic internal validation
    console.log("Election Simulator initialized. Engine check:", !!engine);
});
