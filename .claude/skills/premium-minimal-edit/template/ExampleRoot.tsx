import React from 'react';
import {Composition} from 'remotion';
import {PremiumEdit, Edit} from './PremiumMinimal';
const b = (t: number) => ({src: 'broll.mp4', startFrom: t});
const edit: Edit = {
  durationSec: 10,
  shots: [
    {from: 0, to: 2.7, media: b(11.5)},
    {from: 2.7, to: 4.6, media: b(15.4)},
    {from: 4.6, to: 6.2, split: {top: b(19.4), bottom: b(21.95)}},
    {from: 6.2, to: 7.4, media: b(25.9)},
    {from: 7.4, to: 7.8, media: b(23.3)},
  ],
  stacks: [
    {layout: 'stack3', t1: {text: 'Furniture', at: 0.5}, t2: {text: 'Trends', at: 0.95}, t3: {text: 'of 2026', at: 1.45}, out: 2.7, exit: 'cut'},
    {layout: 'stack2', t1: {text: 'Furniture', at: 3.5}, t2: {text: 'Modern', at: 3.1}, out: 4.6, exit: 'whip'},
  ],
  lightLeaks: [2.7],
  whips: [4.6],
  dipToWhite: 7.5,
  logo: {at: 7.8, word: 'STUDIO', tagline: 'interiors', accentIndex: 2},
};
export const Root: React.FC = () => (
  <Composition id="Demo" component={PremiumEdit as any} defaultProps={{edit}}
    durationInFrames={300} fps={30} width={1080} height={1920} />
);
