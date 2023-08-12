const { default: mongoose } = require("mongoose");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid email",
        ],
    },
    phone: {
        type: String, 
        required: [true, "Please add an address"],
    },
    password: {
        type: String, 
        required: [true, "Please add a password"],
        minLength: 6,
        select: false
    },
    role: {
        type: String, 
        enum: ["admin", "seller", "customer"],
        default: "customer"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) {
        next();
    }

    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
})

UserSchema.methods.isValidPassword = async function(password) {
    return bcryptjs.compare(password, this.password);
}

module.exports = mongoose.model("User", UserSchema);