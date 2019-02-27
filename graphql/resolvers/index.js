const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
    } catch (err) {
        throw err;
    }
}

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
}

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return {
                    ...event._doc,
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                };
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: '5c72c61064e0271e92b6c50d'
        });
        var createdEvent;
        try {
            const result = await event.save();
            createdEvent = {
                ...result,
                _id: result.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }

            const user = await User.findById('5c72c61064e0271e92b6c50d');
            if (!user) {
                throw new Error('User not exists.');
            }
            user.createdEvents.push(event);

            await user.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }

            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });

            const savedUser = await user.save();
            return { ...savedUser._doc, password: null, _id: savedUser.id }
        } catch (err) {
            throw err;
        }
    }
}