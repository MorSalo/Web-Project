const branchesService = require('../services/branches');

const createBranch = async (req, res) => {
  var {city,address,years,open} = req.body;
  const newBranch = await branchesService.createBranch(city,address,years,open);
  console.log(newBranch);
  if(newBranch == undefined){
    return res.status(404).json({ errors: ['Branch already exist'] });
  }
  res.json(newBranch);
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
  if (!req.params._id) {
    res.status(400).json({
    message: " id required",
    });
  }
  
  var {address,city,years,open} = req.body;
  const branch = await branchesService.updateBranch(req.params._id,address,city,years,open);
  if (!branch) {
    return res.status(404).json({ errors: ['Branch not found or already exist'] });
  }
  
  res.json(branch);
};

const deleteBranch = async (req, res) => {
  console.log(req.params._id)
  const branch = await branchesService.deleteBranch(req.params._id);
  if (!branch) {
    return res.status(404).json({ errors: ['Branch not found'] });
  }
  
  res.send();
};

module.exports = {
  createBranch,
  getBranchById,
  getBranches,
  updateBranch,
  deleteBranch
};