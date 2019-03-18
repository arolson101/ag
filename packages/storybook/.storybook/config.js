import { configure } from '@storybook/react';
import debug from 'debug'

debug.enable('*')

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /.stories.tsx?$/);

function loadStories() {
  req.keys().forEach(req);
}

configure(loadStories, module);
