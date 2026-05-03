/**
 * Lightweight Validation Test for Election Simulator Scenarios
 * Ensures all paths are valid and there are no broken links using Jest.
 */

const scenariosData = require('../public/js/data.js');

describe('Scenario Data Validation', () => {
    test('All paths and links should be valid', () => {
        let errors = [];

        Object.entries(scenariosData).forEach(([roleId, roleData]) => {
            if (!roleData.startNode) {
                errors.push(`Role ${roleId} missing startNode`);
            }

            Object.entries(roleData.nodes).forEach(([nodeId, node]) => {
                if (!node.choices || node.choices.length === 0) {
                    return;
                }

                node.choices.forEach((choice, idx) => {
                    const nextId = choice.nextId;
                    
                    const isGlobalEnd = ['END_GOOD', 'END_BAD', 'END_MIXED'].includes(nextId);
                    if (!isGlobalEnd && !roleData.nodes[nextId]) {
                        errors.push(`Node ${nodeId}, Choice ${idx} points to non-existent node: ${nextId}`);
                    }

                    if (choice.conditionalNext) {
                        choice.conditionalNext.forEach((branch, bIdx) => {
                            const bNextId = branch.nextId;
                            const isBGlobalEnd = ['END_GOOD', 'END_BAD', 'END_MIXED'].includes(bNextId);
                            if (!isBGlobalEnd && !roleData.nodes[bNextId]) {
                                errors.push(`Node ${nodeId}, Choice ${idx}, Branch ${bIdx} points to non-existent node: ${bNextId}`);
                            }
                        });
                    }
                });
            });
        });

        expect(errors).toEqual([]);
    });
});
