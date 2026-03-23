export const SUBJECT_CONTENT = {
    'Guest Service Standards': {
        time: '8 min', steps: 6,
        topics: [
            {
                label: 'Overview', steps: [
                    {
                        title: 'What great service means at our restaurants', preview: 'Our service philosophy and what guests expect',
                        content: `At our restaurants, great service isn't just being friendly — it's making every guest feel like they're the only person in the room. This means anticipating needs before they're expressed, owning problems when they arise, and leaving every guest with a story worth telling.\n\nOur standard: every guest should feel welcomed within 30 seconds of entering, acknowledged by name if they're a returning guest, and thanked sincerely when they leave.`, tags: ['required']
                    },
                    {
                        title: 'The 3-step greeting', preview: 'Eye contact, smile, and immediate acknowledgement',
                        content: `Every guest interaction starts with three non-negotiables:\n\n1. Eye contact — look up from whatever you're doing the moment a guest approaches\n2. Smile — genuine, not performative. If you're having a rough shift, take 10 seconds in the back\n3. Immediate acknowledgement — even if you're busy, say "I'll be right with you" within 15 seconds`, tags: ['tip']
                    },
                ]
            },
            {
                label: 'On the floor', steps: [
                    {
                        title: 'Reading the table', preview: 'Pacing, mood, and when to approach',
                        content: `Not every table wants the same level of attention. Learn to read:\n\n• Business diners: efficient, minimal interruption, check back once per course\n• Celebrators: engagement, warmth, acknowledge the occasion\n• First-timers: guidance, menu recommendations, check in more frequently\n\nThe goal is to be present without being intrusive.`, tags: ['tip']
                    },
                    {
                        title: 'Handling complaints with LAST', preview: 'Listen, Apologise, Solve, Thank',
                        content: `When something goes wrong — and it will — follow LAST:\n\nListen: Don't interrupt. Let the guest fully express their concern.\nApologise: Mean it. "I'm sorry that happened" not "I'm sorry you feel that way."\nSolve: Offer a concrete resolution immediately. Don't make them wait.\nThank: "Thank you for telling us — it helps us do better."`, tags: ['required', 'video']
                    },
                    {
                        title: 'Upselling without feeling pushy', preview: 'Recommendation-based selling',
                        content: `The best upsell is a genuine recommendation. Instead of "Would you like to add a starter?" say "The burrata tonight is incredible — we just got it in this morning."\n\nFocus on 2–3 items per shift that you've personally tried and can describe authentically. Guests can tell the difference between a script and a real recommendation.`, tags: ['tip']
                    },
                ]
            },
            {
                label: 'Closing', steps: [
                    {
                        title: 'The farewell moment', preview: 'Last impressions and how to create them',
                        content: `The last 60 seconds of a guest's visit are disproportionately important to how they remember the experience. Always:\n\n• Walk guests to the door if the floor allows\n• Thank them by name if you learned it during service\n• Mention something specific: "Hope you enjoyed the salmon — it's a favourite"\n• Never say "no problem" — say "my pleasure" or "it was great having you"`, tags: ['required']
                    },
                ]
            }
        ],
        quiz: {
            q: 'A guest complains that their steak is overcooked. Using the LAST method, what should be your first response?',
            options: [
                { text: 'Offer to replace the dish immediately', correct: false },
                { text: 'Listen fully without interrupting, then apologise sincerely', correct: true },
                { text: 'Explain that the kitchen was busy tonight', correct: false },
                { text: 'Ask them how they ordered it', correct: false },
            ],
            feedback: { correct: '✓ Correct. Listening first shows the guest they\'re being heard — jumping straight to solutions can feel dismissive.', wrong: 'Not quite. LAST starts with Listen — let the guest fully express before responding.' }
        }
    },
    'Food Safety & Hygiene': {
        time: '10 min', steps: 7,
        topics: [
            {
                label: 'Foundation', steps: [
                    {
                        title: 'Why food safety is non-negotiable', preview: 'Legal obligations and guest trust',
                        content: `Food safety isn't a best practice — it's a legal requirement and the foundation of guest trust. A single incident can result in illness, closure, and irreparable reputational damage.\n\nEvery team member is personally responsible for food safety in their area. "Someone else will handle it" is not acceptable.`, tags: ['required']
                    },
                    {
                        title: 'Handwashing — the single most important habit', preview: '20 seconds, every time, no exceptions',
                        content: `Wash hands for a minimum of 20 seconds with soap and warm water:\n• Before starting any food prep\n• After touching raw meat, poultry, or seafood\n• After using the restroom\n• After touching your face, hair, or phone\n• After handling rubbish\n\nHand sanitiser is a supplement, not a substitute for handwashing.`, tags: ['required']
                    },
                ]
            },
            {
                label: 'Temperature & storage', steps: [
                    {
                        title: 'The danger zone: 5°C – 60°C', preview: 'Where bacteria multiply fastest',
                        content: `Bacteria multiply rapidly between 5°C and 60°C — the "danger zone." Food should never sit in this range for more than 2 hours total.\n\nCold foods: keep below 5°C. Hot foods: keep above 60°C. When in doubt, throw it out — the cost of wasted food is always less than the cost of an incident.`, tags: ['required', 'video']
                    },
                    {
                        title: 'FIFO — First In, First Out', preview: 'Rotation and labelling standards',
                        content: `All stored food must be labelled with the date received and the use-by date. When stocking, move older items to the front. New deliveries go behind existing stock.\n\nCheck labels at the start of every shift. If something is approaching its use-by date, flag it to the chef before it becomes waste or, worse, a risk.`, tags: ['tip']
                    },
                ]
            },
            {
                label: 'Allergens', steps: [
                    {
                        title: 'The 14 major allergens', preview: 'Know them, flag them, never guess',
                        content: `You must know all 14 major allergens: celery, cereals containing gluten, crustaceans, eggs, fish, lupin, milk, molluscs, mustard, tree nuts, peanuts, sesame, soya, sulphur dioxide.\n\nIf a guest declares an allergy, never say "I think it's fine." Always confirm with the kitchen. Always use the allergy flagging system.`, tags: ['required']
                    },
                    {
                        title: 'Cross-contamination prevention', preview: 'Separate boards, tools, and surfaces',
                        content: `Cross-contamination occurs when allergens or bacteria transfer from one food to another via surfaces, utensils, or hands.\n\nAlways use colour-coded chopping boards. Never use the same knife for raw and ready-to-eat foods without washing. Alert the kitchen of any allergen orders before they begin prep.`, tags: ['required']
                    },
                ]
            },
        ],
        quiz: {
            q: 'A guest tells you they have a severe nut allergy. A dish on the menu "may contain traces of nuts." What do you do?',
            options: [
                { text: 'Tell the guest it should be fine in small amounts', correct: false },
                { text: 'Remove the dish from their options and confirm with the kitchen what is safe', correct: true },
                { text: 'Let the kitchen decide without flagging the allergy', correct: false },
                { text: 'Offer a different dish without confirming its allergen status', correct: false },
            ],
            feedback: { correct: '✓ Correct. Never guess with allergies. Always confirm with the kitchen and only offer dishes you can guarantee are safe.', wrong: 'Incorrect. Allergen management requires explicit confirmation — assumptions can cause serious harm.' }
        }
    },
    'Sales Process & Stages': {
        time: '9 min', steps: 5,
        topics: [
            {
                label: 'Pipeline fundamentals', steps: [
                    {
                        title: 'Our 6-stage sales pipeline', preview: 'Prospect → Qualified → Demo → Proposal → Negotiation → Closed',
                        content: `Every deal moves through 6 stages. Understanding which stage you're in determines your next action:\n\n1. Prospect: identified fit, not yet contacted\n2. Qualified: confirmed budget, authority, need, timeline\n3. Demo: product shown, interest confirmed\n4. Proposal: written offer sent\n5. Negotiation: terms being discussed\n6. Closed Won / Lost: outcome recorded`, tags: ['required']
                    },
                    {
                        title: 'BANT qualification framework', preview: 'Budget, Authority, Need, Timeline',
                        content: `Before moving a deal past "Prospect," confirm BANT:\n\nBudget: Do they have funds allocated, or are they exploring?\nAuthority: Are you talking to the decision-maker?\nNeed: Is this a pain they're actively trying to solve?\nTimeline: When do they need a solution?\n\nA lead that fails BANT isn't dead — it's just not ready. Nurture it.`, tags: ['required', 'video']
                    },
                ]
            },
            {
                label: 'Running great demos', steps: [
                    {
                        title: 'The demo prep checklist', preview: '5 things to do before every demo',
                        content: `Before every demo:\n\n✓ Research the company: funding stage, team size, recent news\n✓ Review their job postings — they reveal pain points\n✓ Prepare a custom scenario using their industry terminology\n✓ Confirm attendees and their roles 24 hours before\n✓ Have a clear "so what" for your opening 90 seconds`, tags: ['tip']
                    },
                    {
                        title: 'Handling objections in the room', preview: 'The 4 objection types and how to respond',
                        content: `Most objections fall into 4 categories:\n\n1. Price: "Compared to the cost of the problem you described, is $X still the concern?"\n2. Timing: "What would need to change in 6 months that doesn't exist today?"\n3. Competitor: "What would [competitor] need to do differently to win your business?"\n4. Internal alignment: "Who else needs to be involved in this decision?"`, tags: ['tip']
                    },
                ]
            },
            {
                label: 'Closing', steps: [
                    {
                        title: 'The assumptive close', preview: 'Moving from conversation to commitment',
                        content: `The best close isn't a pressure tactic — it's a natural next step. After a strong demo, ask: "Based on what we've covered, does this solve the problem you described?"\n\nIf yes: "Great — what does your process look like for moving forward?"\n\nNever end a call without a concrete next step agreed on both sides.`, tags: ['required']
                    },
                ]
            },
        ],
        quiz: {
            q: 'A prospect says "We love the product but the timing isn\'t right — maybe next quarter." What is the best response?',
            options: [
                { text: 'Agree and set a reminder to follow up next quarter', correct: false },
                { text: 'Ask what would need to change next quarter that isn\'t true today', correct: true },
                { text: 'Offer a discount to close now', correct: false },
                { text: 'Send a proposal and let them decide', correct: false },
            ],
            feedback: { correct: '✓ Correct. Timing objections are often a proxy for another concern. Digging in reveals the real blocker.', wrong: 'That approach accepts the objection at face value. The stronger move is to understand what\'s actually driving the delay.' }
        }
    }
};

export function getFallbackContent(subjectName, groupName) {
    return {
        time: '7 min', steps: 4,
        topics: [
            {
                label: 'Overview', steps: [
                    {
                        title: `Introduction to ${subjectName}`, preview: 'What this training covers and why it matters',
                        content: `This module covers everything your team needs to know about ${subjectName}. By the end, you'll have a clear understanding of the standards, processes, and expectations that make our ${groupName} team effective.\n\nThis content was AI-drafted from your business description. Click Edit to customise it with your specific processes and examples.`, tags: ['required']
                    },
                    {
                        title: 'Key principles and standards', preview: 'The non-negotiables for this area',
                        content: `Every team member in ${groupName} is expected to uphold the following standards when it comes to ${subjectName}:\n\n• Consistency: apply the same standard every time, regardless of how busy the shift is\n• Ownership: if you see something that needs attention, address it\n• Communication: flag issues early — don't wait for them to escalate\n• Documentation: record anything that deviates from standard procedure`, tags: ['required']
                    },
                ]
            },
            {
                label: 'Process', steps: [
                    {
                        title: 'Step-by-step procedure', preview: 'The standard operating procedure for this area',
                        content: `Follow this process every time:\n\n1. Preparation: ensure you have everything you need before starting\n2. Execution: follow the checklist without shortcuts\n3. Quality check: verify the output meets our standard before moving on\n4. Handoff: if passing to another team member, communicate the current status clearly\n\nIf anything deviates from this process, document it and flag to your manager.`, tags: ['tip']
                    },
                    {
                        title: 'Common mistakes and how to avoid them', preview: 'What goes wrong and why',
                        content: `The most common issues in this area come from:\n\n• Rushing: cutting corners under time pressure leads to rework\n• Assumptions: never assume a previous step was completed — verify it\n• Poor communication: most mistakes happen at handoff points between people\n\nIf you make a mistake, flag it immediately. Hidden mistakes become much bigger problems.`, tags: ['tip']
                    },
                ]
            },
        ],
        quiz: {
            q: `When something deviates from the standard procedure for ${subjectName}, what should you do?`,
            options: [
                { text: 'Handle it quietly and move on', correct: false },
                { text: 'Document it and flag it to your manager', correct: true },
                { text: 'Wait to see if it causes a problem', correct: false },
                { text: 'Ask a colleague to handle it', correct: false },
            ],
            feedback: { correct: '✓ Correct. Flagging deviations early prevents small issues from becoming large ones.', wrong: 'Incorrect. Undocumented deviations create blind spots. Always flag and document.' }
        }
    };
}
