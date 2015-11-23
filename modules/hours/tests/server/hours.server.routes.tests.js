'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hour = mongoose.model('Hour'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, hour;

/**
 * Hour routes tests
 */
describe('Hour CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new hour
    user.save(function () {
      hour = {
        title: 'Hour Title',
        content: 'Hour Content'
      };

      done();
    });
  });

  it('should be able to save an hour if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new hour
        agent.post('/api/hours')
          .send(hour)
          .expect(200)
          .end(function (hourSaveErr, hourSaveRes) {
            // Handle hour save error
            if (hourSaveErr) {
              return done(hourSaveErr);
            }

            // Get a list of hours
            agent.get('/api/hours')
              .end(function (hoursGetErr, hoursGetRes) {
                // Handle hour save error
                if (hoursGetErr) {
                  return done(hoursGetErr);
                }

                // Get hours list
                var hours = hoursGetRes.body;

                // Set assertions
                (hours[0].user._id).should.equal(userId);
                (hours[0].title).should.match('Hour Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an hour if not logged in', function (done) {
    agent.post('/api/hours')
      .send(hour)
      .expect(403)
      .end(function (hourSaveErr, hourSaveRes) {
        // Call the assertion callback
        done(hourSaveErr);
      });
  });

  it('should not be able to save an hour if no title is provided', function (done) {
    // Invalidate title field
    hour.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new hour
        agent.post('/api/hours')
          .send(hour)
          .expect(400)
          .end(function (hourSaveErr, hourSaveRes) {
            // Set message assertion
            (hourSaveRes.body.message).should.match('Title cannot be blank');

            // Handle hour save error
            done(hourSaveErr);
          });
      });
  });

  it('should be able to update an hour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new hour
        agent.post('/api/hours')
          .send(hour)
          .expect(200)
          .end(function (hourSaveErr, hourSaveRes) {
            // Handle hour save error
            if (hourSaveErr) {
              return done(hourSaveErr);
            }

            // Update hour title
            hour.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing hour
            agent.put('/api/hours/' + hourSaveRes.body._id)
              .send(hour)
              .expect(200)
              .end(function (hourUpdateErr, hourUpdateRes) {
                // Handle hour update error
                if (hourUpdateErr) {
                  return done(hourUpdateErr);
                }

                // Set assertions
                (hourUpdateRes.body._id).should.equal(hourSaveRes.body._id);
                (hourUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of hours if not signed in', function (done) {
    // Create new hour model instance
    var hourObj = new Hour(hour);

    // Save the hour
    hourObj.save(function () {
      // Request hours
      request(app).get('/api/hours')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single hour if not signed in', function (done) {
    // Create new hour model instance
    var hourObj = new Hour(hour);

    // Save the hour
    hourObj.save(function () {
      request(app).get('/api/hours/' + hourObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', hour.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single hour with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hours/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hour is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single hour which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent hour
    request(app).get('/api/hours/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No hour with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an hour if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new hour
        agent.post('/api/hours')
          .send(hour)
          .expect(200)
          .end(function (hourSaveErr, hourSaveRes) {
            // Handle hour save error
            if (hourSaveErr) {
              return done(hourSaveErr);
            }

            // Delete an existing hour
            agent.delete('/api/hours/' + hourSaveRes.body._id)
              .send(hour)
              .expect(200)
              .end(function (hourDeleteErr, hourDeleteRes) {
                // Handle hour error error
                if (hourDeleteErr) {
                  return done(hourDeleteErr);
                }

                // Set assertions
                (hourDeleteRes.body._id).should.equal(hourSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an hour if not signed in', function (done) {
    // Set hour user
    hour.user = user;

    // Create new hour model instance
    var hourObj = new Hour(hour);

    // Save the hour
    hourObj.save(function () {
      // Try deleting hour
      request(app).delete('/api/hours/' + hourObj._id)
        .expect(403)
        .end(function (hourDeleteErr, hourDeleteRes) {
          // Set message assertion
          (hourDeleteRes.body.message).should.match('User is not authorized');

          // Handle hour error error
          done(hourDeleteErr);
        });

    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Hour.remove().exec(done);
    });
  });
});
