const Branch = require('../models/branches');

//controller should check whether return branch or false 
const createBranch = async (city2,address2,years2,open2) => {
    if(doesExist(city2,address2,years2,open2) == false){
        const branch = new Branch({
            //_id:id2,
            city:city2,
            address:address2,
            years:years2,
            open:open2
        }); 
        return await branch.save()
    }
    else{
        return false
    }

};

const getBranchById = async (id) => {
    return await Branch.findById(id);
};

const getBranches = async () => {
    return await Branch.find({});
};

const doesExist = async (city2,address2,years2,open2) => {
   if(Branch.findOne({city:city2,address:address2,years:years2,open:open2})==undefined){
        return false
    }
    else return true 
};

const updateBranch = async (id2,city2,address2,years2,open2) => {
    const branch = await getBranchById(id2);
    if (!branch){
        return false;
    }
    if(city2 != undefined){
    branch.city = city2;}
    if(address2 != undefined){
    branch.address = address2;}
    if(years2 != undefined && years2 >=0 ){
    branch.years = years2;}
    if(open2 != undefined){
    branch.open = open2;}
    if(doesExist(branch.city,branch.address,branch.years,branch.open)){
        return false
    }
    await branch.save();
    return branch;
};

const deleteBranch = async (id) => {
    const branch = await getBarnchById(id);
    if (!branch)
        return false;

    await branch.remove();
    //how to return object that we removed??
    return true;
};

module.exports = {
    createBranch,
    getBranchById,
    getBranches,
    updateBranch,
    deleteBranch
}