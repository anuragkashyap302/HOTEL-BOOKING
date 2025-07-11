import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req , res)=>{
    // create a svix instance with clerk wevhook secret
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        // getting headeres form svix
        const headers = {
             "svix-id": req.headers["svix-id"],
             "svix-timestamp": req.headers["svix-timestamp"],
             "svix-signature": req.headers["svix-signature"]
        };

        await whook.verify(JSON.stringify(req.body) , headers)

        // getting data from req body
         const userData = {
            _id: data.id,
            email :data.email_adresses[0].email_address,
            username:data.first_name + " "+ data.last_name,
            image:data.image_url,
         }
         // switch cases for diffrent events

         switch (type) {
            case "user.created":{
                await User.create(userData);
                break;
            }

             case "user.updated":{
                await User.findByIdAndUpdate(data.id , userData);
                break;
            }
             case "user.deleted":{
                await User.findByIdAndDelete(data.id)
                break;
            }  
         
            default:
                break;
         }

         res.json({success:true , message: "Webhook Recieved"})
        
    } catch (error) {
        console.log(error.message);
        res.json({success:false , message: error.message})
        
    }
}

 export default clerkWebhooks;