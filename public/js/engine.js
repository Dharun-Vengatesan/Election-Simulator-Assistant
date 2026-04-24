class DecisionEngine {
    constructor(data) {
        this.data = data;
        this.currentRole = null;
        this.currentNodeId = null;
        this.score = 0;
        this.history = [];
        this.memory = {};
        this.checkpoints = [];
        this.randomEventNote = "";
        this.randomEventsByRole = {
            voter: [
                { text: "⚠️ Random event: Booth slowdown due to sudden heavy crowd.", scoreDelta: -1, memoryEffects: { crowdStress: true } },
                { text: "⚠️ Random event: Observer visit confirms strict ID checks.", scoreDelta: 1, memoryEffects: { observerPresent: true } },
                { text: "⚠️ Random event: Temporary EVM downtime declared.", scoreDelta: -2, memoryEffects: { downtimeExperienced: true } }
            ],
            candidate: [
                { text: "⚠️ Random event: Election observer requests ad transparency report.", scoreDelta: 1, memoryEffects: { observerPresent: true } },
                { text: "⚠️ Random event: Viral rumor hits your campaign unexpectedly.", scoreDelta: -2, memoryEffects: { rumorShock: true } },
                { text: "⚠️ Random event: Last-minute compliance audit announced.", scoreDelta: -1, memoryEffects: { auditStress: true } }
            ],
            officer: [
                { text: "⚠️ Random event: Unexpected observer visit to your booth.", scoreDelta: 1, memoryEffects: { observerPresent: true } },
                { text: "⚠️ Random event: Rain surge causes sudden crowd pressure.", scoreDelta: -2, memoryEffects: { crowdStress: true } },
                { text: "⚠️ Random event: Spare battery delivery delayed.", scoreDelta: -1, memoryEffects: { logisticsDelay: true } }
            ]
        };
    }

    startRole(roleId) {
        if (!this.data[roleId]) {
            throw new Error(`Role ${roleId} not found`);
        }
        this.currentRole = roleId;
        this.currentNodeId = this.data[roleId].startNode;
        this.score = 0;
        this.history = [];
        this.memory = {};
        this.checkpoints = [];
        this.randomEventNote = "";
        return this.getCurrentNode();
    }

    getCurrentNode() {
        if (!this.currentRole || !this.currentNodeId) return null;
        if (this.isEnding(this.currentNodeId)) {
            return {
                isEnd: true,
                status: this.currentNodeId,
                endingType: this.currentNodeId
            };
        }
        const node = this.data[this.currentRole].nodes[this.currentNodeId];
        return {
            ...node,
            choices: this.getAvailableChoices(node)
        };
    }

    processDecision(choiceIndex) {
        const node = this.getCurrentNode();
        if (!node || node.isEnd) return null;

        const choice = node.choices[choiceIndex];
        if (!choice) return null;

        this.checkpoints.push(this.createCheckpoint(node));

        this.score += choice.scoreDelta;
        this.applyMemoryEffects(choice.memoryEffects);
        const nextId = this.resolveNextId(choice);
        this.currentNodeId = nextId;
        const randomEvent = this.maybeTriggerRandomEvent();

        this.history.push({
            nodeId: this.currentNodeId,
            sceneTitle: node.title,
            choiceText: choice.text,
            feedback: choice.feedback,
            scoreChange: choice.scoreDelta,
            insight: choice.insight || "",
            nextId,
            alternatives: (node.choices || []).map((c) => ({
                text: c.text,
                nextId: c.nextId,
                scoreDelta: c.scoreDelta
            })),
            randomEvent: randomEvent ? randomEvent.text : ""
        });

        return {
            feedback: choice.feedback,
            scoreChange: choice.scoreDelta,
            insight: choice.insight || "",
            randomEvent: randomEvent ? randomEvent.text : "",
            nextNode: this.getCurrentNode(),
            isGameOver: this.isEnding(this.currentNodeId)
        };
    }

    getSummary() {
        const ending = this.computeEndingFromState();
        if (this.isEnding(this.currentNodeId) && this.currentNodeId !== ending) {
            this.currentNodeId = ending;
        }

        return {
            roleName: this.data[this.currentRole].title,
            finalScore: this.score,
            history: this.history,
            status: this.currentNodeId,
            memory: this.memory,
            achievements: this.getAchievements(),
            whatIfOptions: this.getWhatIfOptions()
        };
    }

    getWhatIfOptions() {
        const lastDecisionIndex = this.history.length - 1;
        if (lastDecisionIndex < 0) return [];
        const last = this.history[lastDecisionIndex];
        const alternatives = (last.alternatives || [])
            .filter((alt) => alt.text !== last.choiceText)
            .slice(0, 3)
            .map((alt, idx) => ({
                decisionIndex: lastDecisionIndex,
                optionIndex: idx,
                currentChoice: last.choiceText,
                altChoice: alt.text
            }));
        return alternatives;
    }

    applyWhatIf(decisionIndex, alternativeText) {
        const checkpoint = this.checkpoints[decisionIndex];
        if (!checkpoint) return null;

        this.currentNodeId = checkpoint.currentNodeId;
        this.score = checkpoint.score;
        this.history = checkpoint.history.map((item) => ({ ...item }));
        this.memory = { ...checkpoint.memory };
        this.checkpoints = this.checkpoints.slice(0, decisionIndex);

        const node = this.getCurrentNode();
        if (!node || node.isEnd) return null;
        const altIndex = node.choices.findIndex((choice) => choice.text === alternativeText);
        if (altIndex === -1) return null;
        return this.processDecision(altIndex);
    }

    createCheckpoint(node) {
        return {
            currentNodeId: this.currentNodeId,
            score: this.score,
            memory: { ...this.memory },
            history: this.history.map((item) => ({ ...item })),
            nodeTitle: node.title
        };
    }

    getAvailableChoices(node) {
        return (node.choices || []).filter((choice) => {
            if (!choice.conditions) return true;
            return this.conditionsPass(choice.conditions);
        });
    }

    conditionsPass(conditions) {
        return Object.entries(conditions).every(([key, expected]) => this.memory[key] === expected);
    }

    applyMemoryEffects(effects = {}) {
        Object.entries(effects).forEach(([key, value]) => {
            if (typeof value === "number") {
                const current = Number(this.memory[key] || 0);
                this.memory[key] = current + value;
            } else {
                this.memory[key] = value;
            }
        });
    }

    resolveNextId(choice) {
        if (choice.conditionalNext) {
            for (const branch of choice.conditionalNext) {
                if (this.conditionsPass(branch.when || {})) {
                    return branch.nextId;
                }
            }
        }
        return choice.nextId;
    }

    maybeTriggerRandomEvent() {
        this.randomEventNote = "";
        if (this.isEnding(this.currentNodeId)) return null;

        const chance = Math.random();
        if (chance > 0.16) return null;

        const events = this.randomEventsByRole[this.currentRole] || [];
        if (events.length === 0) return null;
        const event = events[Math.floor(Math.random() * events.length)];
        this.score += event.scoreDelta;
        this.applyMemoryEffects(event.memoryEffects || {});
        this.randomEventNote = event.text;
        return event;
    }

    isEnding(nodeId) {
        return nodeId === "END_GOOD" || nodeId === "END_BAD" || nodeId === "END_MIXED";
    }

    computeEndingFromState() {
        if (this.currentNodeId === "END_GOOD" || this.currentNodeId === "END_BAD" || this.currentNodeId === "END_MIXED") {
            return this.currentNodeId;
        }

        const trust = Number(this.memory.publicTrust || 0);
        const severeFlags = Boolean(this.memory.attemptedFraud || this.memory.corruptionAttempt || this.memory.fraud || this.memory.ignoredFakeVoter);

        if (severeFlags || this.score < 0 || trust < -1) return "END_BAD";
        if (this.score > 26 && trust >= 0) return "END_GOOD";
        return "END_MIXED";
    }

    getAchievements() {
        const badges = [];
        const hasNegative = this.history.some((step) => step.scoreChange < 0);
        const hasHighPositive = this.history.filter((step) => step.scoreChange > 0).length >= 4;

        if (this.currentRole === "voter" && this.memory.validId && !this.memory.attemptedFraud && hasHighPositive) {
            badges.push("Responsible Voter");
        }
        if (this.currentRole === "officer" && this.memory.protocolStrict && !this.memory.ignoredFakeVoter && this.memory.systemHandled) {
            badges.push("Perfect Officer");
        }
        if (this.currentRole === "candidate" && this.memory.ethicalCampaign && !this.memory.overspend && !this.memory.fakeNewsUsed) {
            badges.push("Clean Campaigner");
        }
        if (hasNegative && this.score < 5) {
            badges.push("Rule Breaker");
        }
        if (badges.length === 0) {
            badges.push("Democracy Explorer");
        }
        return badges;
    }
}

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecisionEngine;
}
