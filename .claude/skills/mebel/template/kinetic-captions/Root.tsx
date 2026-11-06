import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {TOTAL, FPS} from './data';

export const Root: React.FC = () => (
  <Composition id="Inmoda" component={Reel} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={1080} height={1920} />
);
