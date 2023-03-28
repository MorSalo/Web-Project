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
  else res.json(branch);
};

const deleteBranch = async (req, res) => {
  const {id} = req.params;
  console.log("controllers delete id:"+id)
  const branch = await branchesService.deleteBranch(id);
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