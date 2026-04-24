const scenariosData = {
    voter: {
        title: "Voter",
        roleAvatar: "👤",
        startNode: "voter_register",
        memoryHints: ["registered", "validId", "misinfoSpread", "queueDiscipline", "reportedIssue"],
        nodes: {
            voter_register: {
                title: "Registration Window",
                avatar: "📝",
                text: "Election registration closes tonight. Your first step affects every later checkpoint.",
                choices: [
                    { text: "Register online immediately", nextId: "voter_info", scoreDelta: 8, feedback: "✔ Registration confirmed.", memoryEffects: { registered: true }, insight: "Early registration avoids panic." },
                    { text: "Wait and register at district office", nextId: "voter_queue", scoreDelta: 2, feedback: "• You can still make it, but risk delay.", memoryEffects: { registered: true }, insight: "Late registration increases friction." },
                    { text: "Skip registration and go directly on poll day", nextId: "voter_unregistered", scoreDelta: -12, feedback: "❌ You are not listed in electoral rolls.", memoryEffects: { registered: false }, insight: "Voting access begins with registration." }
                ]
            },
            voter_queue: {
                title: "Long Queue at Poll Office",
                avatar: "🚶",
                text: "A long queue blocks the entrance. Tempers are rising and touts offer illegal shortcuts.",
                choices: [
                    { text: "Wait your turn and verify queue token", nextId: "voter_info", scoreDelta: 7, feedback: "✔ You remain compliant and complete filing.", memoryEffects: { queueDiscipline: true }, insight: "Queue discipline protects fairness." },
                    { text: "Try bypassing the line", nextId: "voter_info", scoreDelta: -5, feedback: "❌ Warning issued for line violation.", memoryEffects: { queueDiscipline: false }, insight: "Small violations create future checks." },
                    { text: "Request assisted senior-citizen desk", nextId: "voter_info", scoreDelta: 5, feedback: "✔ Legal alternate queue accepted.", memoryEffects: { queueDiscipline: true }, insight: "Use official support channels." }
                ]
            },
            voter_unregistered: {
                title: "Missing from Roll",
                avatar: "⛔",
                text: "Your name does not appear in the voter list. Officials ask if you have any legal fallback.",
                choices: [
                    { text: "Appeal with proof and request provisional slip", nextId: "voter_info", scoreDelta: 1, feedback: "• Escalation accepted, but under strict scrutiny.", memoryEffects: { registered: true }, insight: "Recovery is harder than prevention." },
                    { text: "Argue aggressively with staff", nextId: "END_BAD", scoreDelta: -15, feedback: "❌ Disturbance complaint filed; voting denied.", insight: "Hostile behavior can end participation." },
                    { text: "Leave and try next election", nextId: "END_MIXED", scoreDelta: -4, feedback: "• You avoided penalties but missed this vote.", insight: "Inactive citizens reduce democratic strength." }
                ]
            },
            voter_info: {
                title: "Fake News Flood",
                avatar: "📱",
                text: "Messages claim the polling booth is moved and EVMs are compromised.",
                choices: [
                    { text: "Verify with official election channel", nextId: "voter_id_check", scoreDelta: 8, feedback: "✔ You prevent misinformation spread.", memoryEffects: { informed: true }, insight: "Fact-checking protects choice quality." },
                    { text: "Forward message to neighborhood groups", nextId: "voter_downtime", scoreDelta: -8, feedback: "❌ Rumors spread, causing panic.", memoryEffects: { misinfoSpread: true }, insight: "Unverified forwards can harm turnout." },
                    { text: "Report suspicious message to helpline", nextId: "voter_id_check", scoreDelta: 10, feedback: "✔ Fake campaign traced quickly.", memoryEffects: { reportedIssue: true }, insight: "Reporting helps election integrity." }
                ]
            },
            voter_id_check: {
                title: "ID Verification Desk",
                avatar: "🪪",
                text: "At booth entry, officer asks for valid ID and checks your queue conduct notes.",
                choices: [
                    { text: "Show valid voter ID and stay in line", nextId: "voter_vote_action", scoreDelta: 9, feedback: "✔ Entry approved.", memoryEffects: { validId: true }, insight: "Compliance speeds voting." },
                    { text: "Carry no ID and request exception", nextId: "voter_missing_id", scoreDelta: -6, feedback: "❌ You are moved to secondary verification.", memoryEffects: { validId: false }, insight: "Missing ID creates hard blockers." },
                    { text: "Try using someone else's ID", nextId: "END_BAD", scoreDelta: -20, feedback: "❌ Invalid voting attempt detected.", memoryEffects: { attemptedFraud: true }, insight: "Identity fraud is a serious offense." }
                ]
            },
            voter_missing_id: {
                title: "Missing ID Challenge",
                avatar: "🔍",
                text: "You are allowed one chance to resolve identity before poll closes.",
                choices: [
                    { text: "Fetch valid ID from home and return", nextId: "voter_vote_action", scoreDelta: 5, feedback: "✔ Verified after delay.", memoryEffects: { validId: true }, insight: "Prepared documents save time." },
                    { text: "Request alternate approved identity verification", nextId: "voter_vote_action", scoreDelta: 4, feedback: "✔ Alternate verification accepted.", memoryEffects: { validId: true }, insight: "Election systems include legal alternatives." },
                    { text: "Attempt to vote without verification", nextId: "END_BAD", scoreDelta: -18, feedback: "❌ Voting blocked and incident recorded.", insight: "Procedure bypass undermines trust." }
                ]
            },
            voter_downtime: {
                title: "System Downtime Rumor",
                avatar: "⚙️",
                text: "Queue slows due to temporary EVM downtime. Crowd starts shouting.",
                choices: [
                    { text: "Wait for official restart notice", nextId: "voter_id_check", scoreDelta: 4, feedback: "✔ Poll resumes and your turn remains valid.", memoryEffects: { patience: true }, insight: "Downtime management requires patience." },
                    { text: "Leave booth assuming system failed", nextId: "END_MIXED", scoreDelta: -3, feedback: "• You avoid chaos but lose your vote chance.", insight: "Premature exits reduce participation." },
                    { text: "Help calm crowd and share verified updates", nextId: "voter_id_check", scoreDelta: 8, feedback: "✔ Order restored faster.", memoryEffects: { communityHelp: true }, insight: "Civic behavior improves resilience." }
                ]
            },
            voter_vote_action: {
                title: "Final Ballot Moment",
                avatar: "🗳️",
                text: "You reach the machine. Last choices define your final democratic outcome.",
                choices: [
                    { text: "Vote once, confirm, and exit responsibly", nextId: "END_GOOD", scoreDelta: 10, feedback: "✔ You complete a fair voting journey.", insight: "Responsible voting strengthens legitimacy." },
                    { text: "Try to influence others inside booth area", nextId: "END_BAD", scoreDelta: -12, feedback: "❌ Booth influence violation reported.", insight: "Campaigning at booth is prohibited." },
                    { text: "Vote correctly but ignore earlier misinformation harm", nextId: "END_MIXED", scoreDelta: 1, feedback: "• You voted, but social impact remains mixed.", insight: "Individual compliance does not erase prior harm." }
                ]
            }
        }
    },
    candidate: {
        title: "Candidate",
        roleAvatar: "🎤",
        startNode: "candidate_nomination",
        memoryHints: ["ethicalCampaign", "overspend", "fakeNewsUsed", "publicTrust"],
        nodes: {
            candidate_nomination: {
                title: "Nomination Filing",
                avatar: "📂",
                text: "Submission deadline is near. Your legal compliance reputation starts here.",
                choices: [
                    { text: "Submit full nomination package with affidavit", nextId: "candidate_ethics", scoreDelta: 9, feedback: "✔ Filing accepted.", memoryEffects: { legalCompliance: true, publicTrust: 1 }, insight: "Transparent filing boosts credibility." },
                    { text: "Submit incomplete papers and promise update", nextId: "candidate_filing_issue", scoreDelta: -6, feedback: "❌ Scrutiny triggered.", memoryEffects: { legalCompliance: false, publicTrust: -1 }, insight: "Incomplete filings trigger mistrust." },
                    { text: "Try influence officer for relaxed checks", nextId: "END_BAD", scoreDelta: -20, feedback: "❌ Bribery complaint filed immediately.", memoryEffects: { corruptionAttempt: true }, insight: "Corruption can end a campaign instantly." }
                ]
            },
            candidate_filing_issue: {
                title: "Nomination Defect Notice",
                avatar: "⚠️",
                text: "You have limited time to fix errors.",
                choices: [
                    { text: "Correct documents through legal channel", nextId: "candidate_ethics", scoreDelta: 5, feedback: "✔ Defect corrected.", memoryEffects: { legalCompliance: true }, insight: "Legal recovery is possible with speed." },
                    { text: "Withdraw from race", nextId: "END_MIXED", scoreDelta: -3, feedback: "• You avoid penalties but lose this election.", insight: "Withdrawal protects future prospects." },
                    { text: "Forge annexures under pressure", nextId: "END_BAD", scoreDelta: -18, feedback: "❌ Forgery detected and candidacy cancelled.", memoryEffects: { fraud: true }, insight: "Forgery destroys electoral legitimacy." }
                ]
            },
            candidate_ethics: {
                title: "Campaign Ethics Choice",
                avatar: "📣",
                text: "Your media team offers contrasting campaign tactics.",
                choices: [
                    { text: "Issue-focused campaign and public debates", nextId: "candidate_spending", scoreDelta: 10, feedback: "✔ Voters trust your transparency.", memoryEffects: { ethicalCampaign: true, publicTrust: 2 }, insight: "Policy-first campaigns raise trust." },
                    { text: "Run divisive fake-news campaigns", nextId: "candidate_fake_news", scoreDelta: -10, feedback: "❌ Short-term buzz, long-term damage.", memoryEffects: { fakeNewsUsed: true, publicTrust: -2 }, insight: "Disinformation creates backlash." },
                    { text: "Use emotional fear messaging", nextId: "candidate_spending", scoreDelta: -2, feedback: "• Engagement rises but trust weakens.", memoryEffects: { ethicalCampaign: false, publicTrust: -1 }, insight: "Fear messaging erodes confidence." }
                ]
            },
            candidate_fake_news: {
                title: "Fact-Check Fallout",
                avatar: "🧨",
                text: "Independent media exposed your fake claims. Election observers are watching.",
                choices: [
                    { text: "Publicly retract and apologize", nextId: "candidate_spending", scoreDelta: 4, feedback: "✔ Damage partially controlled.", memoryEffects: { publicTrust: 1 }, insight: "Owning mistakes can recover trust." },
                    { text: "Double down and attack institutions", nextId: "END_BAD", scoreDelta: -16, feedback: "❌ Campaign suspended for repeated violations.", memoryEffects: { institutionAttack: true }, insight: "Escalation invites severe penalties." },
                    { text: "Shift to verified, issue-based content", nextId: "candidate_spending", scoreDelta: 6, feedback: "✔ Narrative reset started.", memoryEffects: { ethicalCampaign: true, publicTrust: 2 }, insight: "Strategic correction can rebuild legitimacy." }
                ]
            },
            candidate_spending: {
                title: "Campaign Spending Audit",
                avatar: "💸",
                text: "Finance team warns your budget is near legal limits.",
                choices: [
                    { text: "Cut non-essential events and stay compliant", nextId: "candidate_counting", scoreDelta: 8, feedback: "✔ Spending remains legal.", memoryEffects: { overspend: false, publicTrust: 1 }, insight: "Compliance protects outcomes." },
                    { text: "Hide extra spending via third-party groups", nextId: "candidate_violation", scoreDelta: -12, feedback: "❌ Suspicious transactions flagged.", memoryEffects: { overspend: true, publicTrust: -2 }, insight: "Opaque financing creates legal risk." },
                    { text: "Publish expenditure dashboard weekly", nextId: "candidate_counting", scoreDelta: 10, feedback: "✔ Transparency boosts confidence.", memoryEffects: { overspend: false, publicTrust: 2 }, insight: "Public transparency builds credibility." }
                ]
            },
            candidate_violation: {
                title: "Spending Violation Hearing",
                avatar: "🏛️",
                text: "Election body demands explanation for excess spending patterns.",
                choices: [
                    { text: "Accept fine and correct filings", nextId: "candidate_counting", scoreDelta: 2, feedback: "• You remain in race with reduced trust.", memoryEffects: { publicTrust: -1 }, insight: "Compliance after violation limits damage." },
                    { text: "Blame staff and deny records", nextId: "END_BAD", scoreDelta: -14, feedback: "❌ Non-cooperation leads to disqualification.", insight: "Accountability failures worsen penalties." },
                    { text: "Open books to independent auditors", nextId: "candidate_counting", scoreDelta: 6, feedback: "✔ Oversight restores some trust.", memoryEffects: { publicTrust: 1 }, insight: "Independent audits can rebuild faith." }
                ]
            },
            candidate_counting: {
                title: "Counting Day Decision",
                avatar: "📊",
                text: "Result margin is narrow. Party workers demand dramatic action.",
                choices: [
                    { text: "Request legal recount with evidence", nextId: "END_GOOD", scoreDelta: 9, feedback: "✔ You resolve dispute within democratic rules.", insight: "Legal channels protect election legitimacy." },
                    { text: "Incite crowd outside counting center", nextId: "END_BAD", scoreDelta: -18, feedback: "❌ Violence allegations end campaign.", insight: "Intimidation destroys trust." },
                    { text: "Accept result but question process respectfully", nextId: "END_MIXED", scoreDelta: 3, feedback: "• Peace maintained, but doubts remain.", insight: "Tone matters in close elections." }
                ]
            }
        }
    },
    officer: {
        title: "Election Officer",
        roleAvatar: "🧑‍💼",
        startNode: "officer_prepoll",
        memoryHints: ["ignoredFakeVoter", "systemHandled", "crowdManaged", "protocolStrict"],
        nodes: {
            officer_prepoll: {
                title: "Pre-Poll Checklist",
                avatar: "🧰",
                text: "You must lock logistics before polling starts.",
                choices: [
                    { text: "Run full protocol checklist", nextId: "officer_crowd", scoreDelta: 9, feedback: "✔ Polling station is ready.", memoryEffects: { protocolStrict: true }, insight: "Preparation prevents crisis." },
                    { text: "Do minimal setup to save time", nextId: "officer_crowd", scoreDelta: -4, feedback: "• Setup done, but vulnerabilities remain.", memoryEffects: { protocolStrict: false }, insight: "Shortcuts increase downstream risk." },
                    { text: "Skip machine checks entirely", nextId: "officer_system_fail", scoreDelta: -12, feedback: "❌ You enter polling with unknown machine state.", memoryEffects: { protocolStrict: false }, insight: "Unchecked systems can fail under load." }
                ]
            },
            officer_crowd: {
                title: "Crowd Management",
                avatar: "👥",
                text: "A heavy crowd builds outside with long waiting time.",
                choices: [
                    { text: "Create orderly queue lanes with announcements", nextId: "officer_id", scoreDelta: 8, feedback: "✔ Tension reduces and throughput improves.", memoryEffects: { crowdManaged: true }, insight: "Clear communication reduces unrest." },
                    { text: "Allow influential groups to skip queue", nextId: "officer_id", scoreDelta: -8, feedback: "❌ Fairness complaints filed.", memoryEffects: { crowdManaged: false }, insight: "Unequal treatment damages trust." },
                    { text: "Call extra staff and prioritize seniors", nextId: "officer_id", scoreDelta: 7, feedback: "✔ Flow improves with inclusive support.", memoryEffects: { crowdManaged: true }, insight: "Resource scaling can stabilize polling." }
                ]
            },
            officer_id: {
                title: "ID Verification Pressure",
                avatar: "🪪",
                text: "Several IDs appear suspicious while queue pressure rises.",
                choices: [
                    { text: "Strictly verify and document challenges", nextId: "officer_fake_voter", scoreDelta: 10, feedback: "✔ Verification confidence is high.", memoryEffects: { protocolStrict: true }, insight: "Documentation protects integrity." },
                    { text: "Wave through doubtful IDs to speed up", nextId: "officer_fake_voter", scoreDelta: -9, feedback: "❌ Suspect votes may enter tally.", memoryEffects: { protocolStrict: false }, insight: "Speed cannot replace validity." },
                    { text: "Escalate uncertain cases to observer desk", nextId: "officer_fake_voter", scoreDelta: 8, feedback: "✔ Multi-party verification enabled.", memoryEffects: { protocolStrict: true }, insight: "Escalation strengthens confidence." }
                ]
            },
            officer_fake_voter: {
                title: "Detected Fake Voter Attempt",
                avatar: "🕵️",
                text: "A fake voter is flagged by polling agents. Your response has major consequences.",
                choices: [
                    { text: "Block vote and log incident transparently", nextId: "officer_system_fail", scoreDelta: 9, feedback: "✔ Fraud attempt contained.", memoryEffects: { ignoredFakeVoter: false }, insight: "Fast transparent action prevents escalation." },
                    { text: "Ignore warning and continue polling", nextId: "officer_system_fail", scoreDelta: -14, feedback: "❌ Agents accuse booth compromise.", memoryEffects: { ignoredFakeVoter: true }, insight: "Ignored fraud weakens election outcomes." },
                    { text: "Pause briefly for formal verification panel", nextId: "officer_system_fail", scoreDelta: 6, feedback: "✔ Delay accepted; trust retained.", memoryEffects: { ignoredFakeVoter: false }, insight: "Short delays can preserve legitimacy." }
                ]
            },
            officer_system_fail: {
                title: "System Failure Handling",
                avatar: "⚙️",
                text: "Midday EVM failure halts voting. Crowd pressure rises again.",
                choices: [
                    { text: "Replace unit with agents observing each step", nextId: "officer_closeout", scoreDelta: 10, feedback: "✔ Poll resumes transparently.", memoryEffects: { systemHandled: true }, insight: "Transparent recovery sustains confidence." },
                    { text: "Open sealed unit yourself to speed fix", nextId: "END_BAD", scoreDelta: -20, feedback: "❌ Unauthorized tampering recorded.", memoryEffects: { systemHandled: false }, insight: "Seal breaches compromise legitimacy." },
                    { text: "Suspend temporarily and request district technical team", nextId: "officer_closeout", scoreDelta: 5, feedback: "• Delay hurts turnout but procedure is lawful.", memoryEffects: { systemHandled: true }, insight: "Legal escalation is better than unsafe shortcuts." }
                ]
            },
            officer_closeout: {
                title: "Poll Closeout",
                avatar: "📦",
                text: "Final sealing and reporting decisions determine trust in your booth results.",
                choices: [
                    { text: "Seal records publicly and share signed log", nextId: "END_GOOD", scoreDelta: 9, feedback: "✔ Poll closes with high confidence.", insight: "Transparent closeout preserves legitimacy." },
                    { text: "Seal quickly without observer signatures", nextId: "END_MIXED", scoreDelta: -2, feedback: "• Result stands but objections remain.", insight: "Missing signatures create avoidable disputes." },
                    { text: "Ignore mismatch warning in final register", nextId: "END_BAD", scoreDelta: -14, feedback: "❌ Inquiry launched for compromised process.", insight: "Unchecked anomalies can invalidate trust." }
                ]
            }
        }
    }
};

// Export for Node.js testing environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = scenariosData;
}
