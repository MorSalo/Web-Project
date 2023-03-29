const express = require('express');
var router = express.Router();
const controllerBranches = require('../controllers/branches');

router.route('/')
    .get(controllerBranches.getBranches)
    .post(controllerBranches.createBranch);
router.route('/:id')
    .get(controllerBranches.getBranchById)
    .put(controllerBranches.updateBranch)
    .delete(controllerBranches.deleteBranch);
router.route('/:city?/:years?/:open?')
    .get(controllerBranches.findBranch);

module.exports = router;