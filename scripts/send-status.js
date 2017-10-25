const request = require('request');
const utils = require('./utils');
const config = require('./config');
const log = require('./log');
module.exports = function sendStatus({ state, description }) {
  if (!config.githubTokenStatuses) {
    return console.log('Skipping GitHub status');
  }
  const targetUrl = `https://expo.io/@${config.expUsername}/${utils.readPackageJSON().name}`;
  const statusUrl = `https://api.github.com/repos/${config.githubOrg}/${config.githubRepo}/statuses/${config.githubCommit}`;

  const payload = {
    state,
    description,
    target_url: targetUrl,
    context: 'deploy/exponent',
  }

  request.post(
    {
      url: statusUrl,
      headers: {
        'User-Agent': 'ci',
        'Authorization': `token ${config.githubTokenStatuses}`,
      },
      body: JSON.stringify(payload),
    },
    (error, response) => {
      if (error) {
        console.error('Failed to post status to GitHub, an error occurred', error);
      } else if (response.statusCode >= 400) {
        console.error('Failed to post status to GitHub, request failed with', response);
      } else {
        console.log(`Posted status to GitHub for PR #${config.githubPullRequestId}`, response);
      }
    }
  );
};
