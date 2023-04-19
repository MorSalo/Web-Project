const branchesService = require('../services/branches');
const Branch = require('../models/branches');

const createBranch = async (req, res) => {
  var {city,address,years,open} = req.body;
  const branch = await branchesService.createBranch(city,address,years,open);
  if(branch == undefined){
    return res.status(404).json({ errors: ['Branch already exist'] });
  }
  res.json({branch})
};

const getBranches = async (req, res) => {
  const branches = await branchesService.getBranches();
  res.json(branches);
};

const getBranchById = async (req, res) => {
  const branch = await branchesService.getBranchById(req.params._id);
  if (!branch) {
    return res.status(404).json({ errors: ['Branch not found'] });
  }

  res.json(branch);
};

const updateBranch = async (req, res) => {
  //do we have what we need?
  const {id} = req.params
  if (!id) {
    res.status(400).json({
    message: "id required",
    });
  }
  
  var {city,address,years,open} = req.body;
  const branch = await branchesService.updateBranch(id,city,address,years,open);
  if (branch == undefined) {
    return res.status(404).json({ errors: ['Branch not found or already exist'] });
  }
  else res.json({branch});
};

const deleteBranch = async (req, res) => {
  const {id} = req.params;
  if(id==undefined){
    return res.status(404).json({ errors: ['Id is missing'] });
  }
  const branch = await branchesService.deleteBranch(id);
  if (!branch) {
    return res.status(404).json({ errors: ['Branch not found'] });
  }
  
  res.send();
};

const findBranch = async (req,res) => {
  const {city,years,open} = req.params
  const branches = await branchesService.findBranch(city,years,open);
  //should i return null object or error?
  //is the if nessecery?
  if(branches == undefined){
    return res.json({branches})
    //return res.status(404).json({ errors: ['Branches not found'] });
  }
  res.json({branches});
}

const getBranchesGroupedBy = async (req, res) => {  
  const branches = await Branch.aggregate([
    {
        $group: {
            _id: '$city',
            count: { $sum: 1 } // this means that the count will increment by 1
        }
    }
  ]);
  
  res.json({
      branches
  })
}

module.exports = {
  createBranch,
  getBranchById,
  getBranches,
  updateBranch,
  deleteBranch,
  findBranch,
  getBranchesGroupedBy
};