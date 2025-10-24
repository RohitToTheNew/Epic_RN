export default {
  apiVersion: '2.0.0.0',
  classlinkConfig: {
    callback_url: 'https://licensing.audioenhancement.com/login',
    login_url: 'https://launchpad.classlink.com/oauth2/v2/auth',
  },
  googleConfig: {
    callback_url: 'https://licensing.audioenhancement.com/login',
    login_url: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope:
      'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  },
  microsoftConfig: {
    callback_url: 'https://licensing.audioenhancement.com/login',
    login_url:
      'https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize',
    scope: 'openid&profile',
  },
  rapidIdentity: {
    callback_url: 'https://licensing.audioenhancement.com/login',
    login_url: '/idp/profile/oidc/auth',
    scope: 'openid&email',
  },
  clever: {
    callback_url: 'https://licensing.audioenhancement.com/login',
    login_url: 'https://clever.com/oauth/authorize',
    scope: 'openid&email',
  },
  broadcastEventsList:['endevent','endlockdownforall','acknowledge','updateroomstatus','refreshsafealertonacknoledge'],
  safeAlertEventsList:['teachersafealert','safealert','safealertnonpaired']
};