import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";

/**
 * Logs an event to Google Analytics
 *
 * @param eventName
 * @param eventParams
 */
const logAnalyticsEvent = (eventName: string, eventParams: any) => {
  logEvent(analytics, eventName, eventParams);
};

export { logAnalyticsEvent };
