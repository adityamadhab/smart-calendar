const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  color: {
    type: String,
    default: '#2196f3',
  },
  reminder: {
    type: Boolean,
    default: false,
  },
  reminderTime: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrence: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: function() { return this.isRecurring; }
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    endDate: {
      type: Date
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    monthDay: {
      type: Number,
      min: 1,
      max: 31
    }
  }
});

eventSchema.methods.generateInstances = function(startDate, endDate) {
  if (!this.isRecurring) return [this];

  const instances = [];
  let currentDate = new Date(this.start);
  const recurrenceEnd = this.recurrence.endDate || endDate;

  while (currentDate <= recurrenceEnd) {
    if (currentDate >= startDate) {
      const instance = {
        ...this.toObject(),
        start: new Date(currentDate),
        end: new Date(currentDate.getTime() + (this.end - this.start)),
        isRecurringInstance: true,
        originalEventId: this._id
      };
      instances.push(instance);
    }

    switch (this.recurrence.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + this.recurrence.interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * this.recurrence.interval));
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + this.recurrence.interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + this.recurrence.interval);
        break;
    }
  }

  return instances;
};

module.exports = mongoose.model('Event', eventSchema); 