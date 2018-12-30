const express = require('express');
const router = express.Router();

// @route   GET api/posts/test
// @dsec    Tests Post route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: "post works"});
});

module.exports = router;