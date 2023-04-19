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
router.route('/city/:city?/years/:years?/open/:open?')
    .get(controllerBranches.findBranch);
router.route('/chart')
    .get(controllerBranches.getBranchesGroupedBy);


// router.get('/',  async function(req, res) {
//     console.log("hi")
//     const city = req.query.city || undefined;
//     const years = req.query.years || undefined;
//     const open = req.query.open || undefined;

//   console.log("Routes: the params we got from script: "+"city= "+city+" ,years= "+years+" ,open= "+open)
//   const branches = await branchesService.findBranch(city,years,open);
//   //should i return null object or error?
//   //is the if nessecery?
//   if(branches == undefined){
//     return res.json({branches})
//     //return res.status(404).json({ errors: ['Branches not found'] });
//   }
//   res.json({branches});
// });
      
      
module.exports = router;