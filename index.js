#!/usr/bin/env node

const spawn = require('./scripts/spawn');
const config = require('./scripts/config');
const log = require('./scripts/log');
const preDeploy = require('./scripts/pre-deploy');
const postDeploy = require('./scripts/post-deploy');
const sendStatus = require ('./scripts/send-status');
const localExp = './node_modules/exp/bin/exp.js';
log('Logging into Expo...');
sendStatus({
  state: 'pending',
  description: 'Starting build with Expo...',
});
spawn(localExp, ['login', '-u', config.expUsername, '-p', config.expPassword], loginError => {
  if (loginError) {
    sendStatus({
      state: 'error',
      description: 'Expo login failed.',
    });
    throw new Error('Failed to log into Expo');
  } else {
    log('Logged into Expo.');
    log('Preparing project for publish...');
    preDeploy();
  }

  log('Publishing project into Expo.');
  spawn(localExp, ['publish'], publishError => {
    if (publishError) {
      sendStatus({
        state: 'error',
        description: 'Failed to publish package to Expo.',
      });
      throw new Error('Failed to publish package to Expo');
    } else {
      log('Published project.');
      log('Notifying GitHub...');
      sendStatus({
        state: 'success',
        description: 'Deploy preview ready!',
      });
      // postDeploy();
    }
  });
});
