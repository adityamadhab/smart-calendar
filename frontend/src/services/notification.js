class NotificationService {
  constructor() {
    this.permission = false;
    this.checkPermission();
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.permission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission === 'granted';
    }
  }

  async scheduleNotification(event) {
    if (!this.permission) {
      await this.checkPermission();
    }

    if (!this.permission) return;

    const reminderTime = new Date(event.reminderTime).getTime();
    const now = new Date().getTime();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        this.showNotification(event);
      }, timeUntilReminder);
    }
  }

  showNotification(event) {
    const notification = new Notification('Event Reminder', {
      body: `${event.title} starts at ${new Date(event.start).toLocaleTimeString()}`,
      icon: '/calendar-icon.png',
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export default new NotificationService(); 