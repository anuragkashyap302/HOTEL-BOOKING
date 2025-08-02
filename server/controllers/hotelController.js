import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req , res)=>{
    try {
         const {name , address , contact , city} = req.body;
         const owner = req.user._id

         //cheak if user alreday registered
         const hotel = await Hotel.findOne({owner});
         // abhi hum user ko ek hi baar hotel register karne denge
         // agar user ne pehle se hotel register kiya hai to hum usko error message bhejenge
         // aur agar nahi kiya hai to hum hotel register karenge  
         //multiple ke llye ye cheak hatna padega
          if(hotel){
            return res.json({success:false , message: "Hotel Already Registered"})
          }

          await Hotel.create({name , address , contact , city , owner});

          await User.findByIdAndUpdate(owner , {role: "hotelOwner"});

          res.json({success:true , message: "Hotel Registered Successfully"})
        
    } catch (error) {
        res.json({success:false , message: error.message});
        
    }
}