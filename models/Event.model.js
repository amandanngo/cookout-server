const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: String,
    date: Date,
    host: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    attendeeLimit: Number,
    location: String
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;