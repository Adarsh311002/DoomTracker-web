/**
 * Privacy policy content — DRAFT, pending review before public launch.
 *
 * Every statement is sourced from the mobile repository (README.md
 * "Data Storage" / "Privacy & Security", docs/architecture.md §10 and §16,
 * AndroidManifest.xml, src/state/*). Update this file whenever the app's
 * data handling changes.
 */

export interface PolicySection {
  id: string;
  title: string;
  paragraphs?: string[];
  list?: string[];
  after?: string[];
}

export const privacyIntro =
  "Doom Tracker is an Android app that measures time spent on a small set of apps and prices it against goals you set. This policy explains what the app reads, where that data is kept, and what never leaves your phone. It describes the current V1 build, which is still in development.";

export const privacySections: PolicySection[] = [
  {
    id: "summary",
    title: "The short version",
    list: [
      "No account. Doom Tracker has no sign-up and no login.",
      "No Doom Tracker server. The app’s code makes no network requests.",
      "Usage data is stored only on your device.",
      "The app reads which app was in the foreground and when — never what was on screen.",
      "You can delete all of it from inside the app at any time.",
    ],
  },
  {
    id: "what-it-reads",
    title: "What the app reads",
    paragraphs: [
      "With your permission, Doom Tracker reads Android’s on-device app-usage log through the UsageStatsManager API. From that log it rebuilds app sessions. Each session consists of:",
    ],
    list: [
      "the app’s package name (for example, com.instagram.android)",
      "the session’s start time",
      "the session’s end time",
      "a source tag identifying the API the session came from",
    ],
    after: [
      "Doom Tracker cannot see screen content, text, messages, what you scroll past, or which video or post you viewed. It does not use Android’s AccessibilityService.",
      "Sessions are reconstructed for every app that appears in the usage log, not only the apps Doom Tracker counts. Only sessions on its built-in risk-app list (Instagram, YouTube, TikTok and Reddit) lasting at least two minutes count toward your doomscroll totals. Raw usage events are not stored — only the reconstructed sessions.",
    ],
  },
  {
    id: "storage",
    title: "Where your data is stored",
    paragraphs: [
      "Session data is stored in a local database on your device (Android Room / SQLite). It holds three things: a checkpoint of the last processed time, sessions still open at the end of a check, and the history of completed sessions.",
      "The current version has no automatic retention limit: session history is kept on your device until you delete it (see below) or uninstall the app.",
      "Android’s automatic app backup is disabled for Doom Tracker, so this data is not included in Android cloud backups of the app.",
    ],
  },
  {
    id: "goals",
    title: "Goals and app settings",
    paragraphs: [
      "Your goals and app settings are stored on your device using AsyncStorage. This includes whether you’ve completed onboarding, and for each goal its name, subtitle, daily target, position in the list, and protected-window settings.",
    ],
  },
  {
    id: "leaving-device",
    title: "Does any data leave your device?",
    paragraphs: [
      "No. Doom Tracker has no backend, no user accounts, no cloud sync, no analytics, and no advertising. The app’s source code makes no network requests.",
      "For transparency: the app’s Android manifest currently declares the INTERNET permission. It comes from the React Native project template, where it is used during development to connect to the local build server. No feature of the app uses it.",
    ],
  },
  {
    id: "permissions",
    title: "Permissions",
    list: [
      "Usage Access (PACKAGE_USAGE_STATS) — required to read the app-usage log. Android only lets you grant this in system Settings, and you can revoke it there at any time. Each background check verifies the permission first and does nothing if it has been revoked.",
      "Internet (INTERNET) — declared by the React Native template, as explained above; not used by any app feature.",
    ],
    after: [
      "Doom Tracker does not request notification, location, contacts, camera, microphone or storage permissions.",
    ],
  },
  {
    id: "background",
    title: "Background processing",
    paragraphs: [
      "To keep its view of your usage current, Doom Tracker schedules a background task with Android’s WorkManager, roughly every 15 minutes (Android may run it less often). The task reads new usage events since the last check, rebuilds sessions, and saves them to the on-device database. It does not block, pause or interrupt any app, and it does not send notifications.",
    ],
  },
  {
    id: "delete",
    title: "Deleting your data",
    paragraphs: [
      "In the app, go to Goals → Delete all my data. This erases the checkpoint, open sessions and session history in a single database transaction, then resets your goals and onboarding. If the deletion fails, the app tells you and leaves everything unchanged, so it never reports a deletion that didn’t happen.",
      "Uninstalling Doom Tracker also removes its app data from your device, as Android does for any app.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    paragraphs: [
      "The app does not integrate any third-party services — no analytics, crash reporting, advertising or tracking SDKs. It is built with open-source libraries (such as React Native and AndroidX) that run entirely on your device.",
    ],
  },
  {
    id: "website",
    title: "This website",
    paragraphs: [
      "This website does not use analytics or advertising and does not set tracking cookies. Fonts are served from this site rather than a third-party font service. Like any website, it is served by a hosting provider, which may process standard technical request data (such as IP addresses) to deliver and secure the site.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "Doom Tracker does not knowingly collect personal information from anyone, and it does not transmit the data it stores on your device.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "Doom Tracker is in active development. If a future version changes what data is read, stored or shared, this policy will be updated before that version is released, and the date at the top of this page will change.",
    ],
  },
];
