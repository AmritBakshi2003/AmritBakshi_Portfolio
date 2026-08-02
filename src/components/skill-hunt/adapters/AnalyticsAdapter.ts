/**
 * AnalyticsAdapter
 * Lightweight analytics module for tracking user interactions in Skill Hunt.
 * Privacy-safe, zero PII, completely no-op by default.
 */
export class AnalyticsAdapter {
  static trackEvent(_eventName: string, _payload?: Record<string, any>) {
    if (process.env.NODE_ENV === 'development') {
      // console.log(`[SkillHunt Analytics] ${eventName}`, payload || '');
    }
    // Wirable to Plausible, PostHog, Google Analytics, etc.
  }
}
