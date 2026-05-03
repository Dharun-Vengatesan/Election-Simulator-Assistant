/**
 * Engine Logic Tests for Election Simulator
 * Validates transitions, score calculations, and state management using Jest.
 */

const scenariosData = require('../public/js/data.js');
const DecisionEngine = require('../public/js/engine.js');

describe('Decision Engine Core Logic', () => {
    let engine;

    beforeEach(() => {
        engine = new DecisionEngine(scenariosData);
    });

    test('Role Initialization throws error on invalid role', () => {
        expect(() => engine.startRole('invalid_role')).toThrow('Role invalid_role not found');
    });

    test('Role Initialization sets correct default state', () => {
        const node = engine.startRole('voter');
        expect(engine.currentRole).toBe('voter');
        expect(engine.score).toBe(0);
        expect(engine.history.length).toBe(0);
        expect(node.title).toBe(scenariosData.voter.nodes.voter_register.title);
    });

    test('Decision Processing updates score and history', () => {
        engine.startRole('voter');
        
        // Voter chooses to register online (index 0)
        const result = engine.processDecision(0);
        expect(engine.score).toBe(8);
        expect(engine.history.length).toBe(1);
        expect(result.scoreChange).toBe(8);
    });

    test('Decision Processing ignores invalid choice index', () => {
        engine.startRole('voter');
        const result = engine.processDecision(999);
        expect(result).toBeNull();
    });

    test('Ending Detection logic', () => {
        engine.startRole('voter');
        engine.currentNodeId = 'voter_vote_action';
        
        // Final vote (index 0)
        const result = engine.processDecision(0);
        expect(result.isGameOver).toBe(true);
        expect(engine.isEnding(engine.currentNodeId)).toBe(true);
    });

    test('Memory Effects Persistence', () => {
        engine.startRole('voter');
        // Register online -> registered: true
        engine.processDecision(0);
        expect(engine.memory.registered).toBe(true);
    });

    test('What If (Time Travel) Recovery', () => {
        engine.startRole('voter');
        
        // Decision 1: Register online
        engine.processDecision(0);
        const scoreBefore = engine.score;
        
        // Decision 2: Verify with official channel
        engine.processDecision(0);
        expect(engine.score).not.toBe(scoreBefore);
        
        // Apply What If to first decision
        const altText = scenariosData.voter.nodes.voter_register.choices[1].text;
        const result = engine.applyWhatIf(0, altText);
        
        expect(engine.history.length).toBe(1);
        expect(engine.score).toBe(2); // Score for district office registration
    });

    test('What If ignores invalid alternative text', () => {
        engine.startRole('voter');
        engine.processDecision(0);
        const result = engine.applyWhatIf(0, 'invalid text that does not exist');
        expect(result).toBeNull();
    });

    test('Conditions logic processes correctly', () => {
        engine.startRole('voter');
        engine.memory.registered = true;
        // Mock a node with conditions
        const node = {
            choices: [
                { text: 'A', conditions: { registered: true } },
                { text: 'B', conditions: { registered: false } }
            ]
        };
        const available = engine.getAvailableChoices(node);
        expect(available.length).toBe(1);
        expect(available[0].text).toBe('A');
    });

    test('Random Events Trigger', () => {
        engine.startRole('voter');
        // Mock Math.random to always trigger an event (chance <= 0.16)
        jest.spyOn(Math, 'random').mockReturnValue(0.1);
        
        const result = engine.processDecision(0); // Valid decision
        expect(result.randomEvent).not.toBe('');
        
        Math.random.mockRestore();
    });

    test('Compute Ending dynamically', () => {
        engine.startRole('candidate');
        // If score is high and trust is high -> END_GOOD
        engine.score = 30;
        engine.memory.publicTrust = 5;
        expect(engine.computeEndingFromState()).toBe('END_GOOD');

        // If severe flag present -> END_BAD
        engine.memory.corruptionAttempt = true;
        expect(engine.computeEndingFromState()).toBe('END_BAD');
    });

    test('Achievements calculation', () => {
        engine.startRole('officer');
        engine.memory.protocolStrict = true;
        engine.memory.systemHandled = true;
        const achievements = engine.getAchievements();
        expect(achievements).toContain('Perfect Officer');
    });
});

