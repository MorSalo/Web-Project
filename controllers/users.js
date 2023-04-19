const Users = require('../models/users')
const jwt = require('jsonwebtoken');

const getUsers = async (req, res) => {
    const users = await Users.find()

    res.json({
        users
    })
};

const createUser = async (req, res) => {
    const {username, email, password, isAdmin} = req.body
    if( await validateUserRequest(req, res)!=1)
        return;
    const newUser = new Users({
        username,
        email,
        password,
        isAdmin
        
    })
    await newUser.save().catch(e => console.log(e))
    const io = req.app.get('socketio');
    io.emit('new-user', {
        user: newUser
    });
    res.json({
        newUser
    })
}

function IsEmpty(username, email, password) {
    return (!username || !email || !password);

}

async function validateUserRequest(req, res) {
    const {username, email, password, isAdmin } = req.body;
    if (IsEmpty(username, email, password)) {
        return res.status(404).json({errors: ['Missing some variables exists']});
    }
    if(!email.includes('@'))
    {
        return res.status(404).json({errors: ['Not a valid email']});
    }
    const dbuser = await Users.findOne({username, email, password, isAdmin });

    if (dbuser) {
        return res.status(404).json({errors: ['User already exists']});
    }
    return 1;
}

const updateUser = async (req, res) => {
    const {id} = req.params
    const {username, email, password, isAdmin } = req.body
    if(await validateUserRequest(req, res)!=1)
    {
        return;
    }

    const user = await Users.findById(id)

    if (!user) {
        return res.status(404).json({errors: ['User not found']});
    }

    await Users.updateOne({_id: id}, {username, email, password, isAdmin })
    const updatedUser = await Users.findOne({username, email, password, isAdmin });
    const users = await Users.find()
    const io = req.app.get('socketio');
    io.emit('updated-user', {
        user: updatedUser
    });
    res.json({
        users,
        message: 'User updated!'
    })
}

const deleteUser = async (req, res) => {
    const {id} = req.params

    const deleted_user = await Users.findById(id)

    if (!deleted_user) {
        return res.status(404).json({errors: ['User not found']});
    }

    await Users.deleteOne({_id: id})
    const io = req.app.get('socketio');
    io.emit('deleted-user', {
        user: deleted_user
    });
    const users = await Users.find()
    res.json({
        users
    })
}

const findUsers = async (req,res) => {
    console.log("in the controller")
    const {username,email,isAdmin} = req.params
    console.log("Controllers: the params we got from routs: "+"username= "+username+" ,email= "+email+" ,isAdmin= "+isAdmin);
    const users = await findAllUsers(username,email,isAdmin);
    if(users == undefined){
      return res.json({users})
    }
    res.json({users});
  }
const findAllUsers = async (username2,email2,isAdmin2) => {
    console.log("Services: the params we got from the controller are: "+ "username= "+username2+" ,email= "+email2+" ,isAdmin= "+isAdmin2)
    if(username2 != undefined && email2 != undefined && isAdmin2 != undefined){
        const ret =Users.find({username:username2,email:email2,isAdmin:isAdmin2})
        return ret
    }
    //username email
    else if(username2 != undefined && email2 != undefined && isAdmin2 == undefined){
        const ret =Users.find({username:username2,email:email2})
        return ret
    }
    //username isAdmin
    else if(username2 != undefined && email2 == undefined && isAdmin2 != undefined){
        const ret =Users.find({username:username2,isAdmin:isAdmin2})
        return ret
    }
    //email isAdmin
    else if(username2 == undefined && email2 != undefined && isAdmin2 != undefined){
        const ret =Users.find({email:email2,isAdmin:isAdmin2})
        return ret
    }
    //username
    else if(username2 != undefined && email2 == undefined && isAdmin2 == undefined){
        const ret =Users.find({username:username2})
        return ret
    }
    //email
    else if(username2 == undefined && email2 != undefined && isAdmin2 == undefined){
        const ret =Users.find({email:email2})
        return ret
    }
    //isAdmin
    else if(username2 == undefined && email2 == undefined && isAdmin2 != undefined){
        const ret =Users.find({isAdmin:isAdmin2})
        return ret
    }
    //nothing
    else if(username2 == undefined && email2 == undefined && isAdmin2 == undefined){
        return undefined
    }
}
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
    const isAdmin = user.isAdmin;
    res.json({ token, isAdmin});
  };
module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    findUsers,
    getUser,
    validateUser
};