'use strict';

/**
 * Module dependencies.
 */

 var nodemailer = require('nodemailer');
 var transporter = nodemailer.createTransport();

 exports.index = function(req, res) {
   res.render('index', {
      user: req.user || null,
      request: req
  });
};


exports.sendMail = function(req, res) {

    var data = req.body;

    transporter.sendMail({
        from: 'test@gmail.com',
        to: 'a.j.abdelaziz@gmail.com',
        subject: 'hello',
        text: data.contactAgentInput
    });

    res.json(data );
};