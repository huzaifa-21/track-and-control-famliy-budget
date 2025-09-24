import * as Notifications from "expo-notifications";

export async function scheduleNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  // weekly notification trigger (every 7 days)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Weekly Report Ready",
      body: "check your weekly budget summary!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 1,
      hour: 9,
      minute: 0,
      //@ts-ignore
      repeats: true,
    },
  });

  // monthly notification trigger (every 30 days)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Monthly Report Ready",
      body: "check your monthly budget summary!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
      day: 1,
      hour: 9,
      minute: 0,
      //@ts-ignore
      repeats: true,
    },
  });

  // yearly notification trigger (every 365 days)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📊 Yearly Report Ready",
      body: "check your yearly budget summary!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.YEARLY,
      day: 1,
      month: 1,
      hour: 9,
      minute: 0,
      //@ts-ignore
      repeats: true,
    },
  });
}
