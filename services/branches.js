const Branch = require('../models/branches');

//controller should check whether return branch or false 
const createBranch = async (city2,address2,years2,open2) => {
    const find = await doesExist(city2,address2,years2,open2)
    if(find == false){
        const branch = new Branch({
            city:city2,
            address:address2,
            years:years2,
            open:open2
        }); 
        console.log(branch)
        return await branch.save()
    }
    else{
        const branch = new Branch({})
        console.log("already exist")
        return undefined
    }
};

const getBranchById = async (id) => {
    return await Branch.findById(id);
};

const getBranches = async () => {
    return await Branch.find({});
};

const doesExist = async (city2, address2, years2, open2) => {
    const find = await Branch.findOne({
      city: city2,
      address: address2,
      years: years2,
      open: open2
    });
    if (!find) {
      return false;
    } else {
      return true;
    }
};
  

const updateBranch = async (id2,city2,address2,years2,open2) => {
    // const branch = await getBranchById(id2);
    // if (!branch){
    //     return false;
    // }
    // if(city2 != undefined){
    // branch.city = city2;}
    // if(address2 != undefined){
    // branch.address = address2;}
    // if(years2 != undefined && years2 >=0 ){
    // branch.years = years2;}
    // if(open2 != undefined){
    // branch.open = open2;}
    // if(doesExist(branch.city,branch.address,branch.years,branch.open)){
    //     return false
    // }
    // await branch.save();

    const branch2 = await Branch.findByIdAndUpdate(id2, { city: city2, address: address2, years: years2, open: open2 }, {new: true})
    const branch = new Branch(branch2);
    return branch;
};

const deleteBranch = async (id) => {
    console.log("services delete id:"+id)
    const b = await Branch.findByIdAndDelete(id)
    if(!b) return falses
    // const branch = await getBranchById(id);
    // if (!branch)
    //     return false;

    // await branch.remove();
    else return true;
};

module.exports = {
    createBranch,
    getBranchById,
    getBranches,
    updateBranch,
    deleteBranch
}