# Remotion template: Premium Minimal Edit

Tested with remotion@4.0.300, react@18.3.1, typescript@5.6.3 (the Remotion 4.0.300 bundler breaks on newer TypeScript).

```
npm i remotion@4.0.300 @remotion/cli@4.0.300 @remotion/google-fonts@4.0.300 react@18.3.1 react-dom@18.3.1
npm i -D typescript@5.6.3 @types/react@18.3.12
# put footage in public/, then copy PremiumMinimal.tsx, ExampleRoot.tsx (as Root.tsx), index.ts and tsconfig.json into src/
npx remotion render src/index.ts Demo out.mp4
```

Describe the edit as data. Times are in **seconds** taken straight from the word-level transcript:
- `shots[]` holds full-frame clips or `split` (top/bottom) clips. Cut at `word.start + 0.06`.
- `stacks[]` holds the text stacks. Each tier `at` is the onset of its spoken word. `exit: 'whip' | 'cut'`.
- `lightLeaks[]` holds the cut points that get the ~9-frame amber leak.
- `whips[]` holds the cut points that get the whip-pan blur. Pair them with a `stack.exit = 'whip'` whose `out` equals the whip time.
- `dipToWhite` + `logo` give the outro.

See `ExampleRoot.tsx` for a 10-second demo.
