const express = require('express');
const router = express.Router();

const Event = require('../models/Event.model')
const User = require('../models/User.model')



router.post('/events', (req,res,next) => {

    const {title, date, attendeeLimit, location} = req.body;

    const {_id} = req.payload;

    Event.create({
        title,
        date,
        host: _id,
        attendeeLimit,
        location
    })
        .then(newEvent => {
            res.json({
                message: "POST /events",
                event: newEvent
            })

            return User.findByIdAndUpdate(_id, {
                $push: {events: newEvent._id}
            },{
                new: true
            });
        })
        .then(updatedUser => {
            console.log("Updated user events")
        })
        .catch(err =>{ res.json(err) })
})

//All User's Events
router.get('/events', (req,res,next) => {
    const {_id} = req.payload;

    User.findById(_id)
    .populate('events')
    .then(foundUser =>{
        return foundUser.events;
    })
    .then(userEvents => {
        res.json({events: userEvents})
    })
    .catch(err => res.json(err))
})

//User's Events
router.get('/events-feed', (req,res,next) => {
    const {_id} = req.payload;

    Event.find()
    .populate('host')
    .then(foundEvents =>{
        res.json({
            message: "GET /events-feed worked",
            events: foundEvents
        })
    })
    .catch(err => res.json(err))
})


router.delete('/events/:eventId', (req,res,next) => {
    const {eventId} = req.params;

    const {_id} = req.payload;

    async function deleteEvent(){
        const foundUser = await User.findById(_id);

        const filteredEvents = foundUser.events.filter(element => {
            return !element._id.equals(eventId)
        })

        const updatedUser = await User.findByIdAndUpdate(_id, {events: filteredEvents}, {new:true});

        const deletedEvents = await Event.findByIdAndDelete(eventId);
        res.json({user: updatedUser, event: deletedEvents})
    }

    deleteEvent();
})


module.exports = router;