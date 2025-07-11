import mongoose from "mongoose";
const UserSchema = mongoose.Schema({
    _id :{type: String , required:true},
     username :{type: String , required:true},
    email :{type: String , required:true},
     imgae :{type: String , required:true},
    role :{type: String , enum: ["user" , "hotelOwner"] , default:"user"},
     recentSearchCities :[{type: String , required:true}],
} ,{timestamps:true}
);

const User = mongoose.model("User" , UserSchema);
export default User;