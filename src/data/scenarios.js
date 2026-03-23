export const SCENARIOS = {
  restaurant: {
    userInput: "We're a 40-person restaurant group with 3 locations. I need to train front-of-house staff on service standards, and kitchen staff on food safety and prep procedures.",
    bizName: "Restaurant Group Playbook",
    bizDesc: "3 locations · 40 team members · Front-of-house & kitchen training",
    conversation: [
      { role: 'ai', text: "Got it — a multi-location restaurant group. Do you have separate management teams at each location, or does one central team oversee all three?" },
      { role: 'user', text: "Each location has its own manager, but we share the same standards across all three." },
      { role: 'ai', text: "Perfect. And when a new hire starts, do they train at one specific location or rotate through all three?" },
      { role: 'user', text: "They train at their home location, but using the same materials." },
      { role: 'ai', text: "That's exactly what Trainual is built for. I have everything I need — building your playbook now." }
    ],
    groups: [
      { icon: '🍽️', name: 'Front of House', color: '#e8e8e8', subjects: ['Guest Service Standards','Opening & Closing Procedures','POS System Training','Reservation Management','Upselling Techniques'], count: '5 subjects' },
      { icon: '👨‍🍳', name: 'Kitchen Staff', color: '#888888', subjects: ['Food Safety & Hygiene','Prep Station Setup','Recipe Consistency','Allergen Awareness','Kitchen Communication'], count: '5 subjects' },
      { icon: '📋', name: 'Management', color: '#06b6d4', subjects: ['Shift Management','Team Performance Reviews','Inventory & Ordering','Incident Reporting'], count: '4 subjects' },
      { icon: '🧹', name: 'General Staff', color: '#10b981', subjects: ['Brand Values & Culture','Health & Safety','Emergency Procedures'], count: '3 subjects' }
    ]
  },
  retail: {
    userInput: "We run a 25-person retail clothing store. I need to train sales associates on customer service, product knowledge, and how to use our inventory system.",
    bizName: "Retail Store Playbook",
    bizDesc: "1 location · 25 team members · Sales & operations training",
    conversation: [
      { role: 'ai', text: "A retail clothing store — great. Do your associates also handle stock room duties, or are those separate roles?" },
      { role: 'user', text: "Everyone does a bit of everything. Sales floor and stockroom." },
      { role: 'ai', text: "Understood. Is this training for new hires, or are you also looking to upskill your existing team?" },
      { role: 'user', text: "Mostly new hires, but I'd love existing staff to be able to reference it too." },
      { role: 'ai', text: "That makes sense — a living reference playbook. I have what I need, let me put this together for you." }
    ],
    groups: [
      { icon: '🛍️', name: 'Sales Associates', color: '#e8e8e8', subjects: ['Customer Service Excellence','Product Knowledge','Visual Merchandising','Fitting Room Standards','Upselling & Cross-selling'], count: '5 subjects' },
      { icon: '📦', name: 'Stock & Operations', color: '#f59e0b', subjects: ['Inventory Management','Receiving & Processing','Loss Prevention','Store Opening/Closing'], count: '4 subjects' },
      { icon: '💳', name: 'Cashiers', color: '#10b981', subjects: ['POS System Training','Returns & Exchanges','Gift Cards & Promotions'], count: '3 subjects' },
      { icon: '👔', name: 'Management', color: '#888888', subjects: ['Scheduling & Staffing','Performance Management','Sales Reporting'], count: '3 subjects' }
    ]
  },
  startup: {
    userInput: "We're a 60-person B2B SaaS startup. We need to onboard new engineers, account executives, and customer success managers — everyone has very different training needs.",
    bizName: "Startup Operations Playbook",
    bizDesc: "60 team members · Engineering, Sales & CS training",
    conversation: [
      { role: 'ai', text: "A fast-growing SaaS team — this is exactly what Trainual was built for. Are you starting from scratch, or do you have some existing documentation to build from?" },
      { role: 'user', text: "We have a few Notion docs and some Loom videos floating around, but nothing organised." },
      { role: 'ai', text: "That's common. And which team is causing the most onboarding pain right now — engineering, sales, or CS?" },
      { role: 'user', text: "Honestly, CS. We're hiring fast and every new person needs 3 weeks of hand-holding." },
      { role: 'ai', text: "Let's fix that. I'll prioritise CS onboarding in your playbook structure. Building now." }
    ],
    groups: [
      { icon: '🎯', name: 'Customer Success', color: '#e8e8e8', subjects: ['Product Onboarding Process','Customer Health Scoring','Escalation Procedures','QBR Frameworks','Renewal Playbook'], count: '5 subjects' },
      { icon: '💻', name: 'Engineering', color: '#10b981', subjects: ['Dev Environment Setup','Code Review Standards','Deployment Process','On-call Procedures'], count: '4 subjects' },
      { icon: '📈', name: 'Sales', color: '#f59e0b', subjects: ['Sales Process & Stages','Demo Best Practices','CRM Usage','Objection Handling'], count: '4 subjects' },
      { icon: '🏢', name: 'All Company', color: '#888888', subjects: ['Company Mission & Values','Security Policies','Tools & Access','Communication Norms'], count: '4 subjects' }
    ]
  }
};
