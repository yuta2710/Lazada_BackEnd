// const userModel = require("./user.model");

// exports.createUser = async (name, email, phone, password, address, role) => {
//     try {
//         const user = await userModel.create({
//             name,
//             email,
//             phone,
//             password,
//             address,
//             role,
//         });

//         return user;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// exports.fetchAllUsers = async () => {
//     try {
//         const users = await userModel.find().exec();

//         return users;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// exports.fetchUserById = async (userId) => {
//     try {
//         const user = await userModel.findById(userId).exec();

//         if(!user) {
//             throw new Error(`User <${userId} does not found>`);
//         }
//         return user;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// exports.updateUserById = async (userId, data) => {
//     try {
//         const user = await userModel.findByIdAndUpdate(userId, data, {new: true}).exec();

//         if (!user) {
//             throw new Error(`User <${userId} does not found>`);
//         }

//         return user;
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };

// exports.deleteUserById = async (userId) => {
//     try {
//         await userModel.findByIdAndDelete(userId);
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };