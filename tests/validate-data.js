/**
 * Lightweight Validation Test for Election Simulator Scenarios
 * Ensures all paths are valid and there are no broken links.
 */

const scenariosData = require('../public/js/data.js');

function validateScenarios() {
    console.log("Starting scenario validation...");
    let errors = 0;

    Object.entries(scenariosData).forEach(([roleId, roleData]) => {
        console.log(`Checking role: ${roleId}`);
        
        if (!roleData.startNode) {
            console.error(`[ERROR] Role ${roleId} missing startNode`);
            errors++;
        }

        Object.entries(roleData.nodes).forEach(([nodeId, node]) => {
            if (!node.choices || node.choices.length === 0) {
                // End nodes are fine without choices if they are expected endings
                if (!nodeId.startsWith('END_')) {
                    console.warn(`[WARN] Node ${nodeId} has no choices but is not an END node.`);
                }
                return;
            }

            node.choices.forEach((choice, idx) => {
                const nextId = choice.nextId;
                
                // Check if nextId exists in nodes or is a global END node
                const isGlobalEnd = ['END_GOOD', 'END_BAD', 'END_MIXED'].includes(nextId);
                if (!isGlobalEnd && !roleData.nodes[nextId]) {
                    console.error(`[ERROR] Node ${nodeId}, Choice ${idx} points to non-existent node: ${nextId}`);
                    errors++;
                }

                // Check conditionalNext branches
                if (choice.conditionalNext) {
                    choice.conditionalNext.forEach((branch, bIdx) => {
                        const bNextId = branch.nextId;
                        const isBGlobalEnd = ['END_GOOD', 'END_BAD', 'END_MIXED'].includes(bNextId);
                        if (!isBGlobalEnd && !roleData.nodes[bNextId]) {
                            console.error(`[ERROR] Node ${nodeId}, Choice ${idx}, Branch ${bIdx} points to non-existent node: ${bNextId}`);
                            errors++;
                        }
                    });
                }
            });
        });
    });

    if (errors === 0) {
        console.log("✅ Validation successful! All paths are valid.");
        process.exit(0);
    } else {
        console.error(`❌ Validation failed with ${errors} error(s).`);
        process.exit(1);
    }
}

validateScenarios();
