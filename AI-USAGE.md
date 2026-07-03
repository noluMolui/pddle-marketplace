AI Usage Log
AI moment 1
What I was trying to do: Set up the foundational pricing engine for the equipment rental checkout screen to calculate multi-day rentals, taxes, and service fees without risking floating-point precision errors.

The prompt I wrote: "Write a React hook or function to calculate the total cost of a rental item based on price per day, number of days, a 10% service fee, and 15% VAT. The inputs are decimal numbers like 14.99."

What the AI gave back: A standard JavaScript utility function using native floats (const total = (price * days * 1.10) * 1.15;) and trying to fix the rounding errors at the end using toFixed(2).

What was wrong / weak / risky about it: Standard floating-point math in JavaScript/TypeScript is notorious for binary rounding errors (e.g., 0.1 + 0.2 === 0.30000000000000004). In a transactional financial app, multiplying flawed decimals over multiple days leads to compounding discrepancies that break accounting accuracy.

What I changed and why: I rejected the float logic and refactored the codebase to handle all monetary values as integers in cents (e.g., storing R14.99 as 1499). All multiplication happens on whole numbers, and division by 100 is deferred strictly to the final visual rendering layer.

AI moment 2
What I was trying to do: Create a single, responsive search-and-filter engine that dynamically narrows down the item catalog by search keywords, category tags, and maximum price limits simultaneously.

The prompt I wrote: "How should I handle state for three different filters (search text, category buttons, and a price slider) in React so the UI updates instantly as the user types or clicks?"

What the AI gave back: The AI recommended creating four separate pieces of state (filteredItems, searchText, selectedCategory, maxPrice) and using a massive useEffect hook that listened to the filters to constantly recalculate and update the filteredItems state array.

What was wrong / weak / risky about it: This pattern creates unnecessary extra renders, introduces data synchronization bugs, and risks infinite loops if state dependencies aren't perfectly managed. It's an anti-pattern in React to sync state that can simply be derived on the fly.

What I changed and why: I removed the filteredItems state entirely. Instead, I left the original items array static and used a single, multi-pass inline array .filter() loop directly inside the component body. This derives the filtered results dynamically during the standard render pass on every keystroke, keeping the UI lightning-fast and bug-free.

AI moment 3 (the one where AI was wrong)
What I was trying to do: Hook up our main functional component structure inside App.tsx into the DOM root initializer inside main.tsx.

The prompt I wrote: "Give me the clean boilerplates for main.tsx and App.tsx in a modern Vite/TypeScript/React setup so I can wire them together safely."

What the AI gave back:
The AI confidently generated App.tsx using a named export:


export function App() { ... }
But inside main.tsx, it wrote a default import statement without curly braces, mixed with an incorrect relative path resolution assumption: