import * as Sentry from '@sentry/react-native';

export const sentryErrorHandler = (error, pushToSentry = true) => {
  if (pushToSentry) {
    if (error instanceof Error) {
      Sentry.captureException(error);
    }
    Sentry.captureException(JSON.stringify(error));
  }
};
