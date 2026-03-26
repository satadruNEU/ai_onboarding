# AI Playbook Builder — Technical & Interaction Documentation

This document serves as the comprehensive technical specification, interaction guide, and design rationale for the AI Onboarding Prototype. It is intended for designers and developers to understand the structural logic, interaction models, and architectural decisions behind the prototype to facilitate handoff and productionizing.

---

## 1. Project Overview

**What this is:** A high-fidelity React prototype demonstrating an AI-driven onboarding flow for Trainual. It allows users to generate comprehensive company training playbooks from a single prompt, converse with an AI to refine the content, and manage the deployment of this content from a dashboard.

**The Problem it Solves:** The "blank page syndrome" associated with creating standard operating procedures (SOPs) and training manuals. Managers often lack the time or structure to document their company’s processes from scratch.

**Target Audience:** Managers, business owners, and HR professionals in small-to-medium businesses (e.g., restaurants, retail chains, tech startups).

**Core Design Hypothesis:** By front-loading the heavy lifting with Generative AI (via an initial prompt and short context gathering), users can bypass the creation phase and move directly into an editing/refining phase (the Split Screen). This transitions the user's cognitive load from "author" to "editor," significantly increasing the likelihood of playbook completion. Furthermore, signaling the transition from "Drafting" (Dark theme) to "Managing" (Light theme) conceptually grounds the user in the product lifecycle.

---

## 2. Full User Flow — Screen by Screen

### A. Welcome Screen (`WelcomeScreen.jsx`)
- **Visuals on entry:** A dark-themed, highly polished splash screen. A large hero input field sits in the center with a continuously cycling, typing-animated placeholder text demonstrating potential prompts. Below it are three "Scenario" cards (Restaurant, Retail, Startup).
- **Interactions:**
  - **Typing in the input:** Automatically stops the placeholder cycling and allows the user to enter a custom prompt. Pressing `Enter` or clicking the "ArrowUp" generate button pushes the user to the Context Chat.
  - **Clicking a Scenario Card:** Instantly injects a pre-written, highly specific prompt into the AI stream and automatically advances the user to the Context Chat.
- **Trigger:** Submission of the hero input or selecting a scenario.
- **Animations:** 
  - Typing cursor blinking in the placeholder.
  - Slow fade-rise on initial mount.
  - Soft hover scaling on scenario cards (`transform: translateY(-2px)`).

### B. Context Gathering Chat (`ContextChatScreen.jsx`)
- **Visuals on entry:** The screen maintains the dark theme. The user's initial prompt is rendered as a chat bubble. The AI "thinks" (pulsing dots) and then asks the first follow-up question.
- **Interactions:**
  - **Chat input:** User can type responses.
  - **Suggestion Chips:** 4 contextual chips appear above the input. Clicking one immediately sends that response.
- **Flow:** This is a fixed 4-turn conversation covering Audience, Skill level, Challenges, and Timeline.
- **Trigger:** After the 4th question is answered, the AI outputs a final generation message (`"Assembling your custom playbook now..."`), waits 2 seconds, and transitions to the Split Screen.
- **Animations:** 
  - `Smooth scroll` to bottom on new messages.
  - Suggestion chips render with a staggered fade-in.
  - Chat bubbles slide up using `.animate-fade-rise`.

### C. Split Screen Builder (`SplitScreen.jsx`)
- **Visuals on entry:** A 30/70 split layout (Dark mode). 
  - **Left (30%):** Persistent AI chat context. 
  - **Right (70%):** The generated playbook. Upon immediate entry, the right panel renders a shimmering "Skeleton" state simulating generation.
- **Interactions:**
  - **Nav Tabs (Right Panel):** Toggles between "Playbook" (editing view) and "Employee Preview" (mobile overlay view).
  - **Chat Commands:** User can type natural language commands (e.g., "Make it shorter") in the left panel to manipulate the playbook.
  - **Subject Accordions:** Clicking a playbook subject expands it to reveal rich content (text, lists, tables).
  - **Inline Editing:** Clicking the pen icon on a subject allows the user to manually edit the title/content.
  - **Publish Button:** Top-right primary CTA.
- **Trigger:** Clicking "Publish" triggers the confetti animation and pushes to the Dashboard Screen.
- **Animations:** 
  - 1.5s Skeleton shimmer (`animate-pulse`).
  - Crossfade transition from skeletons to real data.
  - Accordion expansion/collapse using CSS max-height transitions.

### D. Dashboard Screen (`DashboardScreen.jsx`)
- **Visuals on entry:** A stark transition to a clean, Light-themed workspace. 
  - **Top:** A top context navbar.
  - **Sidebar:** Navigation and Playbook metadata.
  - **Main Area:** 4 stat tiles, followed by a "Suggested Next Steps" banner, and a grid of simulated team members with progress bars. 
- **Interactions:**
  - **Next Steps Banner:** Dismissible via the 'X' button. Restorable via the "Show tips" header action.
  - **Search Bar:** Non-functional visual search with `⌘K` badge.
  - **Profile Dropdown:** Clicking the avatar reveals a Shadcn-inspired dropdown menu. "Sign out" returns to the Welcome Screen.
- **Animations:** 
  - **On Mount:** The 4 top stat tiles cascade in one by one (fade-rise with staggered delays).
  - **Next Steps Banner:** After exactly 3 seconds, the grid contents magically slide down (max-height css transition), and the banner fades in.

---

## 3. All Interactions — Exhaustive List

| Element | Location | Trigger | Action / Response | State Changes |
|---------|----------|---------|-------------------|---------------|
| **Hero Input** | Welcome | `onChange` | Stops placeholder animation. Updates `inputValue`. | `setInputValue(val)` |
| **Scenario Cards** | Welcome | `onClick` | Skips to Context Chat with pre-loaded scenario. | `onFillExample(type)` |
| **Chat Suggestion** | ContextChat | `onClick` | Submits text, AI thinks, posts next Q. | `advanceConversation(text)` |
| **Command Input** | SplitScreen | `Enter` | Matches regex (e.g., 'quiz', 'shorter'). Re-renders specific sections of Right panel. | Updates `scenario` copy in state. |
| **Subject Accordion**| SplitScreen | `onClick` | Expands/collapses the content blocks underneath. | `toggleSubject(index)` |
| **Preview Tab** | SplitScreen | `onClick` | Slides in a dark-mode mobile phone frame overlay. | `setRightTab('employee')` |
| **Publish Button** | SplitScreen | `onClick` | Fires Confetti, transitions to Dashboard. | `onGoToDashboard()` |
| **Profile Avatar** | Navbar (Shared) | `onClick` | Opens Shadcn/ui light-themed dropdown. | `setOpen(!open)` |
| **Sign Out** | Profile DD | `onClick` | Empties chat, nullifies scenario, routes to Welcome. | `onSignOut()` |
| **Dismiss Tips** | Dashboard | `onClick` | Hides the Next Steps banner instantly. | `setShowNextSteps(false)` |
| **Show Tips** | Dashboard | `onClick` | Re-opens Next Steps banner instantly. | `setShowNextSteps(true)` |

---

## 4. AI Conversation Logic (Context Chat)

The conversational flow in `ContextChatScreen.jsx` is simulated using a hardcoded script array (`CONVERSATION_SCRIPT`). 

**Engine Sequence:**
1. **Turn 1 (Audience):** AI asks who the playbook is for.
2. **Turn 2 (Skill level):** AI asks for technical proficiency.
3. **Turn 3 (Challenges):** AI asks for the primary pain points.
4. **Turn 4 (Timeline):** AI asks for the rollout urgency.

**Mechanics:**
- When the user replies (via typing or clicking a suggestion chip), `isThinking` is set to `true`.
- The UI renders three pulsing dots to simulate LLM latency.
- A randomized delay (`1000ms - 2000ms`) is triggered.
- The next step index is queried from the script, `isThinking` is set to `false`, and the AI's payload is pushed to the `messages` array, triggering an auto-scroll to the bottom.
- If it's the 4th turn, a 2-second delay is appended before firing `onComplete()`, passing the entire chat history down to `App.jsx` so it can be preserved and passed into the `SplitScreen`.

---

## 5. Playbook Data Model

The data underlying the playbooks resides in `src/data/scenarios.js`.

**Structure Hierarchy:**
1. **Playbook (Root)**
   - `bizName` (String): e.g., "Influur"
   - `bizDesc` (String): e.g., "Creator economy platform"
   - `userInput` (String): The initial hero prompt.
   - `groups` (Array): Logical groupings of subjects.
2. **Groups (Array item)**
   - `name` (String): e.g., "Front of House"
   - `count` (Number): Module count.
   - `subjects` (Array): The actual content nodes.
3. **Subjects (Array item)**
   - `title` (String): e.g., "Table Service Standards"
   - `est` (String): Estimated reading time.
   - `blocks` (Array): Content block objects.
4. **Content Blocks (Array item)**
   - `type` (String): `text` | `list` | `table`
   - `content` (String / Array): The actual strings/data for the block.

**UI Mapping:**
The `.sv2-group` maps directly to a Group. Within it, `.sv2-subject` headers map to Subjects. Expanding a Subject iterates over its `blocks` array, mapping `type=list` to an unstyled HTML `ul/li` setup, and `type=text` to standard `p` tags.

---

## 6. Split Screen Architecture

Located in `SplitScreen.jsx`.

**Layout Mechanism:**
- A massive flex container `.sv2-body`.
- **Left Panel (`.sv2-left`)**: Defines a rigid `width: 320px` (or 30% on larger screens), `flex-shrink: 0`, standard `border-right`, and internal scrolling for chat messages.
- **Right Panel (`.sv2-right`)**: Defines `flex: 1` to consume remaining space.

**Generation Crossfade Logic:**
- On mount, `isGenerating` is explicitly set to `true`.
- The right panel maps over mock skeleton elements (hiding the real data).
- A `setTimeout` of `1500ms` flips `isGenerating` to `false`.
- A CSS transition on `.sv2-playbook-content` handles the opacity fade (`opacity: 1` if false, `opacity: 0` if true), resulting in a perfect crossfade.

---

## 7. Chat Command System

The `SplitScreen` left panel accepts natural language commands that directly mutate the right panel's state.

| Command Typed | Regex Match | State Mutation Triggered | Visual Result |
|---------------|-------------|--------------------------|---------------|
| "add a quiz" | `/quiz/i` | Iterates over subject 0, appends a `type: 'quiz'` block. | A new interactive Quiz block appears in the first subject. |
| "make it shorter" | `/shorter|concise/i` | Iterates over subjects, slicing block text. | Generates a success toast; text shrinks on screen. |
| "translate to spanish" | `/spanish|espanol/i` | Swaps specific mock blocks to Spanish arrays. | Generates a success toast; text swaps to hardcoded Spanish map. |

*Note: All logic is localized inside `processChatCommand()` within `SplitScreen.jsx`. Unrecognized commands fallback to generic AI affirmations ("I'll make those changes").*

---

## 8. Component Inventory

| Component File | Role | Noteworthy States / Variants |
|----------------|------|------------------------------|
| `App.jsx` | Top-level state orchestrator. | Returns entirely different tree branches based on `screen` (`welcome`, `context`, `split`, `dashboard`). |
| `WelcomeScreen.jsx` | Landing prompt. | Animated placeholder cycling vs. static user typing. |
| `ContextChatScreen.jsx`| Form logic masked as chat. | `isExiting` state triggers a fade-out animation right before unmounting. |
| `SplitScreen.jsx` | The core editor. | `isGenerating` blocks real render. Right tabs toggle `SubjectPanel` vs `EmployeeOverlay`. |
| `SubjectPanel.jsx` | Renders the actual Playbook JSON. | Accordion states (`openSubjects` array tracking indices). Inline edit mode. |
| `EmployeeOverlay.jsx` | Mobile preview frame. | Dark mode phone UI. Completely ignores global dashboard theming. |
| `DashboardScreen.jsx` | Post-publish management. | Staggered on-mount animations. Next-steps 3-sequence rollout. |
| `ProfileDropdown.jsx` | Navigation avatar logic. | Click-outside hooks. Dark mode styling ignored (forced light mode for shadcn realism). |

---

## 9. Animation and Motion Spec

**Key Reusable CSS Classes (`index.css`):**
- `.animate-fade-rise`: `animation: fade-rise 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;`
  - Defines an `opacity: 0 -> 1` and `transform: translateY(10px) -> 0` curve. Essential to the app's premium feel.
  
**Notable Sequences:**
1. **Typing Placeholder:** A `typeWriter` keyframe animation handles the width expanding from 0 to 100%, coupled with a blinking `.cursor` border-right.
2. **Accordions:** `.sv2-subject-body` uses `max-height: 0` to `max-height: 500px` coupled with `overflow: hidden` to create a smooth slide-down effect without JS measurement calculations.
3. **Dropdown Menu:** Uses `@keyframes dd-in` combining a scale from `0.95` to `1` along with a `-5px` translateY to give it a "pop-out" Shadcn feel.

---

## 10. Post-Publish Flow

When the user clicks `<button className="context-nav-publish">` in `SplitScreen.jsx`:
1. `react-confetti` renders a full-screen burst for ~2 seconds.
2. `App.jsx` updates `screen` to `'dashboard'`.
3. `SplitScreen` unmounts. `DashboardScreen` mounts.
4. The background forcibly shifts from `#0b0e14` (Dark mode) to `#fafafa` (Light mode).
5. The `DashboardScreen` runs its internal staggering loops, animating the tiles.
6. A success Toast notification ("Playbook published") appears on the bottom right and automatically dismisses after ~3s.

---

## 11. Dashboard Spec

The Dashboard (`DashboardScreen.jsx`) is the "Day 2" experience. 
**Aesthetics:** High-contrast light mode, `#ffffff` cards on a `#f3f4f6` background. Borders strictly `#e5e7eb`.
**Structure:**
- **Navbar:** Contains breadcrumb/search (`.db-nav-search`), mock alerts, and the `ProfileDropdown`.
- **Sidebar:** Left navigation. Shows mock recent chats and the live playbook metadata.
- **Main Content:**
  - **4 Stat Tiles:** Generated via an array map. JS `countUpTo()` animates the numbers from 0 to target linearly over 800ms.
  - **Next Steps Banner:** Handled by a 3-stage `.db-next-steps-wrapper` (`hidden -> expanding -> visible`).
  - **Team Progress Grid:** Pulled from `src/data/teamData.js`. 
    - **Progress Bar:** `.db-progress-fill` transitions `width` natively based on the `m.pct` property. It aligns left, while the badge (`.db-team-status`) pushes to the right via `margin-left: auto`.

---

## 12. Employee Preview

Housed in `EmployeeOverlay.jsx`. Triggered by clicking the "Preview" tab in the `SplitScreen` right panel.
- Renders an absolute centering flexbox containing a faux mobile device frame (CSS border radius `32px`, thick borders, fake notch).
- The internal content forces `width: 375px` and reads directly from the `scenario` prop to simulate exactly what the employee will see.
- Employs an exact mapping of the groups/subjects but omits the editing capabilities (no pens, no add buttons).

---

## 13. Scenario System

Governed by `WelcomeScreen` chips -> passed via `onFillExample(key)` -> resolves in `data/scenarios.js`.

**The Three Templates:**
1. **Restaurant:** Focuses on Kitchen Safety, Front of House, Service Standards.
2. **Retail:** Focuses on Point of Sale, Visual Merchandising, Stock Operations.
3. **Tech Startup:** Focuses on Deployment pipelines, Customer Success playbooks, Renewal policies.

When a scenario is chosen, `App.jsx` stores the entire JSON payload in the `scenario` root state. This object flows downwards. `SplitScreen` renders it. `ContextChat` ignores it locally (relies on generic script) but outputs it. `DashboardScreen` pulls corresponding simulated team activity via `teamData.js` object keys matching the scenario type.

---

## 14. Design Decisions Log

| Decision | Alternative Considered | Rationale |
|----------|------------------------|-----------|
| **Forcing Dark Mode down to Light Mode** | Keeping the entire app Dark mode | Generative acts (typing, commanding an AI) feel native and focused in dark IDE-like environments. Consumption and management acts (reading analytics, managing users) feel native in light CRM-like environments. The stark switch provides an immediate, subconscious psychological shift that the "creation work" is done. |
| **Split Screen vs Iterative Chat** | A linear chat loop where AI outputs a doc link at the end | Users need to see what they are building in real-time. Abstracting the playbook into a download link creates distrust. A 30/70 split anchors the user in the artifact being manipulated. |
| **CSS Height Expansion for Next Steps** | Simple JS conditional rendering | Conditional rendering causes abrupt layout shifts (CLSs). Using a max-height wrapper with a negating margin ensures lower siblings (like the team table) physically slide down smoothly, maintaining spatial awareness. |
| **Hardcoded Chat AI Script** | Real LLM via OpenAI API | Connecting a real LLM for a prototype introduces unpredictable latency, risking demo fluency. Faking the latency guarantees the "Wow" factor while proving the exact UX hypothesis. |

---

## 15. Known Limitations & Future Explorations

**What is NOT Built (Limitations):**
- **Authentication:** Profile dropdown "Sign out" merely resets local React state. No JWTs or persistent sessions exist.
- **LLM Integration:** The AI cannot logically respond to out-of-bounds commands (e.g., "Tell me a joke"). It will blindly execute its fallback "I'll update the playbook" response.
- **Drag & Drop:** The Playbook subjects in `SubjectPanel` currently cannot be reordered by the user, despite visual affordances supporting the idea.
- **Responsiveness:** While styled with some responsive flex properties, the `SplitScreen` 30/70 layout will degrade on highly constrained mobile viewports.

**Future Considerations for Production:**
1. **WebSocket AI Streaming:** Transitioning the Skeleton loading state to a real-time Markdown streamer (similar to standard ChatGPT outputs) as chunks arrive from the server.
2. **Rich Text Editor Integration:** Swapping the inline `contentEditable` divs in the `SubjectPanel` for a robust block editor (like TipTap or Slate.js) to support real table and image manipulation.
3. **Analytics Backend:** The dashboard stat tiles and team grid need a genuine SQL view to pull from to represent actual end-user progression.
