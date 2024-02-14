import { analytics, auth } from "../../firebase";
import { logEvent } from "firebase/analytics";

/**
 * Logs an event to Google Analytics
 *
 * @param eventName
 * @param eventParams
 */
const logAnalyticsEvent = (eventName: string, eventParams?: any) => {
  const user = auth.currentUser;

  if (user) {
    eventParams = {
      ...eventParams,
      user: user.uid,
      user_email: user.email,
    };
  }

  logEvent(analytics, eventName, eventParams);
};

export { logAnalyticsEvent };
