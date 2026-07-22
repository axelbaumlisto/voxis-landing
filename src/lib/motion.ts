// Single source of truth for motion timings, mirrored 1:1 with the CSS
// tokens in globals.css (--dur-*, --ease-out-expo). framer-motion wants
// seconds; CSS wants ms — values are kept in sync here by hand.
//
//   CSS            | seconds
//   --dur-fast 200 | 0.2
//   --dur-base 300 | 0.3
//   --dur-slow 600 | 0.6
//   --ease-out-expo cubic-bezier(0.16, 1, 0.3, 1)

export const DUR = {
  fast: 0.2,
  base: 0.3,
  slow: 0.6,
} as const;

// framer-motion cubic-bezier tuple form of --ease-out-expo
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
