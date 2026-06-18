/**
 * Concept-based exercise validation.
 *
 * Students write code differently, so we never diff against the reference
 * solution. Instead each lesson declares the *concepts* it teaches (e.g. "uses
 * the animate prop", "wraps exit in AnimatePresence") as forgiving regex checks.
 * Any working approach that uses the right Motion API passes — which is the
 * point: there are many correct ways to animate a box.
 */

export interface LessonCheck {
  id: string;
  /** Shown in the goals checklist; phrase as the thing to accomplish. */
  label: string;
  test: (code: string) => boolean;
}

const has = (re: RegExp) => (code: string) => re.test(code);

/**
 * Strip comments so the scaffold's instruction comments (which often quote the
 * exact API the student must add) don't pre-satisfy the checks.
 */
function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

export const LESSON_CHECKS: Record<string, LessonCheck[]> = {
  basics: [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "element", label: "Render a <motion.*> element", test: has(/<\s*motion\.[a-z]/i) },
    { id: "animate", label: "Drive it with the animate prop", test: has(/\banimate\s*=\s*\{/) },
  ],
  gestures: [
    { id: "hover", label: "Scale up on hover with whileHover", test: has(/\bwhileHover\s*=\s*\{/) },
    { id: "tap", label: "React to clicks with whileTap", test: has(/\bwhileTap\s*=\s*\{/) },
    { id: "drag", label: "Make an element draggable with drag", test: has(/\bdrag\b/) },
  ],
  variants: [
    { id: "variants", label: "Pass a variants object to a motion element", test: has(/\bvariants\s*=\s*\{/) },
    { id: "stagger", label: "Orchestrate children (staggerChildren / delayChildren)", test: has(/stagger(Children)?|delayChildren/) },
  ],
  keyframes: [
    { id: "animate", label: "Use the animate prop", test: has(/\banimate\s*=\s*\{/) },
    { id: "keyframes", label: "Animate through an array of keyframes, e.g. [0, 1, 0]", test: has(/animate\s*=\s*\{\{[\s\S]*?\[[\s\S]*?,[\s\S]*?\]/) },
  ],
  layout: [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "layout", label: "Add the layout prop to a motion element", test: has(/<\s*motion\.[a-z][\s\S]*?\blayout\b/i) },
  ],
  scroll: [
    { id: "useScroll", label: "Track scroll with useScroll()", test: has(/\buseScroll\s*\(/) },
    { id: "useTransform", label: "Map progress with useTransform() (or reveal via whileInView)", test: has(/\buseTransform\s*\(|\bwhileInView\s*=/) },
  ],
  presence: [
    { id: "presence", label: "Wrap leaving elements in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "exit", label: "Give them an exit prop", test: has(/\bexit\s*=\s*\{/) },
  ],
  "stagger-grid": [
    { id: "variants", label: "Use variants for the grid and its cells", test: has(/\bvariants\s*=\s*\{/) },
    { id: "stagger", label: "Cascade them in with staggerChildren", test: has(/staggerChildren/) },
  ],
  useAnimate: [
    { id: "useAnimate", label: "Get [scope, animate] from useAnimate()", test: has(/\buseAnimate\s*\(/) },
    { id: "animateCall", label: "Fire an animation by calling animate(...)", test: has(/\banimate\s*\(/) },
  ],
  useTransform: [
    { id: "motionValue", label: "Create motion values with useMotionValue()", test: has(/\buseMotionValue\s*\(/) },
    { id: "useTransform", label: "Derive a value with useTransform()", test: has(/\buseTransform\s*\(/) },
  ],

  // --- Real-World Projects ---
  "animated-tabs": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "element", label: "Render a <motion.*> element", test: has(/<\s*motion\.[a-z]/i) },
    { id: "layoutId", label: "Share the pill across tabs with layoutId", test: has(/\blayoutId\s*=/) },
  ],
  "sticky-nav": [
    { id: "useScroll", label: "Track scroll with useScroll()", test: has(/\buseScroll\s*\(/) },
    { id: "useTransform", label: "Map scroll to styles with useTransform()", test: has(/\buseTransform\s*\(/) },
    { id: "element", label: "Animate the header with a <motion.*> element", test: has(/<\s*motion\.[a-z]/i) },
  ],
  "modal-dialog": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "presence", label: "Wrap the dialog in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "exit", label: "Animate open + close with an exit prop", test: has(/\bexit\s*=\s*\{/) },
  ],
  transitions: [
    { id: "animate", label: "Animate with the animate prop", test: has(/\banimate\s*=\s*\{/) },
    { id: "spring", label: 'Use a spring transition (type: "spring")', test: has(/type\s*:\s*["']spring["']/) },
    { id: "tune", label: "Tune it with stiffness / damping / bounce", test: has(/stiffness|damping|bounce/) },
  ],
  "scroll-parallax": [
    { id: "useScroll", label: "Track the element with useScroll()", test: has(/\buseScroll\s*\(/) },
    { id: "offset", label: "Use a target + offset range", test: has(/offset\s*:/) },
    { id: "useTransform", label: "Map progress to movement with useTransform()", test: has(/\buseTransform\s*\(/) },
  ],
  "svg-path": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "element", label: "Use a motion SVG element (motion.path / motion.circle)", test: has(/<\s*motion\.(path|circle|line|rect|ellipse|polyline|polygon)/i) },
    { id: "pathLength", label: "Animate pathLength from 0 to 1", test: has(/pathLength/) },
  ],
  accordion: [
    { id: "presence", label: "Wrap the panel in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "heightAuto", label: 'Animate height to "auto"', test: has(/height\s*:\s*["']auto["']/) },
    { id: "exit", label: "Collapse it with an exit prop", test: has(/\bexit\s*=\s*\{/) },
  ],
  "use-in-view": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "useInView", label: "Detect visibility with useInView()", test: has(/\buseInView\s*\(/) },
    { id: "animate", label: "Drive the card with the animate prop", test: has(/\banimate\s*=/) },
  ],
  "reduced-motion": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "useReducedMotion", label: "Read the preference with useReducedMotion()", test: has(/\buseReducedMotion\s*\(/) },
    { id: "animate", label: "Branch the animation on it", test: has(/\banimate\s*=/) },
  ],
  "drag-constraints": [
    { id: "drag", label: "Make the puck draggable with drag", test: has(/\bdrag\b/) },
    { id: "constraints", label: "Bound it with dragConstraints", test: has(/dragConstraints/) },
    { id: "momentum", label: "Add momentum/elastic (dragElastic / dragTransition)", test: has(/dragElastic|dragTransition|dragMomentum/) },
  ],
  "use-spring": [
    { id: "motionValue", label: "Hold the target in useMotionValue()", test: has(/\buseMotionValue\s*\(/) },
    { id: "useSpring", label: "Smooth it with useSpring()", test: has(/\buseSpring\s*\(/) },
    { id: "style", label: "Point the element at the spring via style", test: has(/style\s*=\s*\{/) },
  ],
  "presence-modes": [
    { id: "presence", label: "Wrap the content in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "mode", label: 'Use mode="wait" (or "popLayout")', test: has(/mode\s*=\s*["'](wait|popLayout)["']/) },
    { id: "exit", label: "Give the swapped item an exit prop", test: has(/\bexit\s*=\s*\{/) },
  ],
  "layout-group": [
    { id: "import", label: "Import LayoutGroup", test: has(/\bLayoutGroup\b/) },
    { id: "wrap", label: "Wrap the siblings in <LayoutGroup>", test: has(/<\s*LayoutGroup/) },
    { id: "layout", label: "Keep layout on the items", test: has(/\blayout\b/) },
  ],
  "animate-stagger": [
    { id: "useAnimate", label: "Get [scope, animate] from useAnimate()", test: has(/\buseAnimate\s*\(/) },
    { id: "stagger", label: "Ripple it with stagger()", test: has(/\bstagger\s*\(/) },
    { id: "animateCall", label: "Fire it by calling animate(...)", test: has(/\banimate\s*\(/) },
  ],
  "number-counter": [
    { id: "useInView", label: "Trigger when seen with useInView()", test: has(/\buseInView\s*\(/) },
    { id: "animateCall", label: "Roll the value with animate(0, target, ...)", test: has(/\banimate\s*\(/) },
    { id: "onUpdate", label: "Read each frame via onUpdate", test: has(/onUpdate/) },
  ],
  "swipe-cards": [
    { id: "presence", label: "Wrap the deck in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "drag", label: "Make the top card draggable with drag", test: has(/\bdrag\b/) },
    { id: "exit", label: "Fling it away with an exit prop", test: has(/\bexit\s*=\s*\{/) },
  ],
  "magnetic-button": [
    { id: "useSpring", label: "Smooth the lean with useSpring()", test: has(/\buseSpring\s*\(/) },
    { id: "pointer", label: "Track the cursor with onPointerMove", test: has(/onPointerMove|onMouseMove/) },
    { id: "style", label: "Point the button's style at the springs", test: has(/style\s*=\s*\{/) },
  ],
  carousel: [
    { id: "presence", label: "Wrap slides in <AnimatePresence>", test: has(/<\s*AnimatePresence/) },
    { id: "custom", label: "Pass the direction via custom", test: has(/\bcustom\s*=/) },
    { id: "exit", label: "Animate the leaving slide (exit)", test: has(/\bexit\s*=/) },
  ],
  "bento-grid": [
    { id: "import", label: 'Import motion from "motion/react"', test: has(/from\s*["']motion\/react["']/) },
    { id: "element", label: "Make each tile a <motion.*> element", test: has(/<\s*motion\.[a-z]/i) },
    { id: "whileHover", label: "Lift it with whileHover", test: has(/\bwhileHover\s*=/) },
  ],
};

export interface CheckResult {
  checks: LessonCheck[];
  passed: boolean[];
  allPassed: boolean;
}

/** Run a lesson's checks against the student's (comment-stripped) code. */
export function runChecks(slug: string, code: string): CheckResult {
  const checks = LESSON_CHECKS[slug] ?? [];
  const clean = stripComments(code ?? "");
  const passed = checks.map((c) => c.test(clean));
  return { checks, passed, allPassed: checks.length > 0 && passed.every(Boolean) };
}
