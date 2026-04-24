const DecisionEngine = require('../public/js/engine');
const scenariosData = require('../public/js/data');

describe('Decision Engine', () => {
    let engine;

    beforeEach(() => {
        engine = new DecisionEngine(scenariosData);
    });

    test('should throw error for invalid role', () => {
        expect(() => engine.startRole('invalid')).toThrow('Role invalid not found');
    });

    test('should start role and get initial scenario correctly', () => {
        engine.startRole('voter');
        const scenario = engine.getCurrentScenario();
        expect(scenario).not.toBeNull();
        expect(scenario.stepId).toBe('registration');
    });

    test('should process correct decision and progress', () => {
        engine.startRole('voter');
        const scenario = engine.getCurrentScenario();
        
        // Find the index of the correct option
        const correctIndex = scenario.options.findIndex(opt => opt.isCorrect);
        
        const result = engine.processDecision(correctIndex);
        
        expect(result.correct).toBe(true);
        expect(engine.score).toBe(1);
        expect(engine.currentScenarioIndex).toBe(1);
        expect(engine.mistakes.length).toBe(0);
    });

    test('should process incorrect decision and NOT progress immediately', () => {
        engine.startRole('voter');
        const scenario = engine.getCurrentScenario();
        
        // Find the index of an incorrect option
        const incorrectIndex = scenario.options.findIndex(opt => !opt.isCorrect);
        
        const result = engine.processDecision(incorrectIndex);
        
        expect(result.correct).toBe(false);
        expect(engine.score).toBe(0); // Score should not increment on mistake
        expect(engine.currentScenarioIndex).toBe(0); // Should stay on same scenario
        expect(engine.mistakes.length).toBe(1); // Mistake recorded
        expect(engine.mistakes[0].wrongChoice).toBe(scenario.options[incorrectIndex].text);
    });

    test('should generate accurate summary after steps', () => {
        engine.startRole('voter');
        
        // Get incorrect for step 1
        const wrongIndex = engine.getCurrentScenario().options.findIndex(o => !o.isCorrect);
        engine.processDecision(wrongIndex);
        
        // Get correct for step 1
        const correctIndex1 = engine.getCurrentScenario().options.findIndex(o => o.isCorrect);
        engine.processDecision(correctIndex1);
        
        // Get correct for step 2 on first try
        const correctIndex2 = engine.getCurrentScenario().options.findIndex(o => o.isCorrect);
        engine.processDecision(correctIndex2);
        
        const summary = engine.getSummary();
        expect(summary.totalScenarios).toBe(3);
        expect(summary.score).toBe(1); // Only step 2 was correct on the FIRST try
        expect(summary.mistakes.length).toBe(1);
    });
});
