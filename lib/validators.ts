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
