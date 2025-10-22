import User from "../modal/userModal.js";

const userSignUp = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(422).json({
            message: 'All the fields are required'
        })
    };

    const newUser = await User.create({
        name, email, password
    })
    return res.status(201).json({
        success: true,
        message: 'User Created Successfully'
    })
}

const userLogin = async (req, res) => {

}


export {
    userSignUp,
    userLogin
}