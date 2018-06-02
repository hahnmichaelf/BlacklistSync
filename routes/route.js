const express = require('express');
const router = express.Router();

router.get('/contacts', (req, res, next)=>{
  res.send('Retrieving the contact list.');
});

module.exports = router;
