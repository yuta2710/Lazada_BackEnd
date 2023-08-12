const userModel = require("./user.model");

class UserService {
    model = userModel;

    constructor(){
        
    }

    createUser = async (name, email, phone, password, address, role) => {
        try {
            const {name, email, phone, password, address, role} = req.body;

            const user = await this.model.create({
                name,
                email,
                phone,
                password,
                address,
                role,
            });

            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}