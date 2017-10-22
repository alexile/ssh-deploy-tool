const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const standSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30,
        index: {
            unique: true
        }
    },
    description: {
        type: String,
        required: false,
        default: 'Just another stand...'
    },
    team: {
        type: String,
        required: true
    },
    variables: {
        type: Array,
        required: true,
        default: []
    },
    commands: {
        type: Array,
        required: true,
        default: []
    },
    status: {
        type: String,
        required: true,
        default: 1
    },
    log: {
        type: Array,
        required: false,
        default: []
    }
});
const Stand = mongoose.model('Stand', standSchema);

module.exports = Stand;
