import React from 'react';
import {Composition} from 'remotion';
import {Reel, PaperStill} from './Reel';
import {TOTAL, FPS} from './data';

export const Root: React.FC = () => (<>
  <Composition id="PaperLight" component={PaperStill} durationInFrames={1} fps={FPS} width={1080} height={1920} defaultProps={{dark: false}} />
  <Composition id="PaperDark" component={PaperStill} durationInFrames={1} fps={FPS} width={1080} height={1920} defaultProps={{dark: true}} />
  <Composition id="Inmoda" component={Reel} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={1080} height={1920} />
</>);
