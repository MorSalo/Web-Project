const Users = require('../models/users')
const jwt = require('jsonwebtoken');
const getUsers = async (req, res) => {
    const users  = await Users.find()

    res.json({
        users
    })
};
function IsEmpty(username,email,password)
{
    return (!username || !email || !password);
        
}

async function validateUserRequest(req,res){
    const {username, email, password} = req.body;
    if(IsEmpty(username, email, password))
    {
        return res.status(404).json({errors: ['Missing some variables exists']});

    }
    const dbuser = await Users.findOne({ $or: [{ username }, { email }] });
    
    if(dbuser){
        return res.status(404).json({errors: ['User already exists']});
    }

}
const createUser = async (req, res) => {
    const {username, email, password, isAdmin} = req.body
    await validateUserRequest(req,res)
    const newUser = new Users({
        username,
        email,
        password,
        isAdmin
    })

    await newUser.save().catch(e => console.log(e))
    res.json({
        newUser,
        message:'New user created!'
    })
}

const updateUser = async (req, res) => {
    const {id} = req.params
    const {username, email, password,isAdmin} = req.body
    await validateUserRequest(req,res)

    const user = await Users.findById(id)

    if (!user) {
        return res.status(404).json({errors: ['User not found']});
    }

    await Users.updateOne({_id:id},{username, email, password,isAdmin})

    const users = await Users.find()
    res.json({
        users,
        message:'Song updated!'
    })
}

const deleteUser = async (req, res) => {
    const {id} = req.params

    const user = await Users.findById(id)

    if (!user) {
        return res.status(404).json({errors: ['User not found']});
    }

    await Users.deleteOne({_id: id})

    const users = await Songs.find()
    res.json({
        users,
        message: 'User deleted!'

    })
}

const validateUser = async (req, res) => {
    const {email, password} = req.body
    if(!email || !password)
    {
        return res.status(404).json({errors: ['Missing some variables exists']});

    }
    const user = await Users.findOne({email, password});
    if(!user)
    {
        return res.status(404).json({errors: ['Incorrect email or password.']});

    }
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET_KEY);
    res.json({ token });
  };

  const getUser = async (req,res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const dbUser = await Users.findOne({_id: user.sub});

      if (dbUser) {
        res.json({ user:dbUser });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    });

  }

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    validateUser
};