'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Hour Schema
 */
var HourSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  classesTaught: {
    type: String,
    default: '',
    trim: true,
    required: 'Classes cannot be blank'
  },
  office: {
    type: String,
    default: '',
    trim: true,
    required: 'Office cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Hour', HourSchema);
