// function to cheak room is avalible or not

import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const checkAvailability = async ({checkInDate , checkOutDate , room}) =>{
    try {
         const bookings = await Booking.find({
            room , 
            checkInDate: {$lte : checkOutDate},
            checkOutDate: {$gte : checkInDate}
         });

         const isAvailable = bookings.length === 0;
         return isAvailable; // yahi show ho raha hai abhi because hotel resgister hi nahi hai
        
    } catch (error) {
        console.error(error.message);
        
    }
}


// api to chek abvallibity of rooom
// post api/bookings/ check-availavility

export const checkAvailabilityAPI = async (req , res) =>{
     try {
        const {room , checkInDate , checkOutDate} = req.body;
        const isAvailable = await checkAvailability({checkInDate , checkOutDate , room});
        res.json({success: true , isAvailable})
        
     } catch (error) {
        res.json({success:false , message:error.message})
        
     }
}

//api to create a new booking

// post /api/bookings/book

export const createBooking = async(req , res)=>{
    try {
        const {room , checkInDate , checkOutDate , guests} = req.body;
        const user = req.user._id;

        //before booking avaliblity chek karo
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate, room
        });
// yahi sse message aa raha hai baar bar room is not availbel
        if(!isAvailable){
            return res.json({success:false , message: "Room is not available"})
        }

        // get totalrpcie for room

        const roomData = await Room.findById(room).populate("hotel");

        let totalPrice = roomData.pricePerNight;
        //cal totalprice baed on chein and out

        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
         const timeDiff = checkOut.getTime() - checkIn.getTime();
          const nights = Math.ceil(timeDiff / (1000*3600*24))  ;
          totalPrice *= nights;
          
          const booking = await Booking.create({
             user ,
              room , 
              hotel:roomData.hotel._id , 
              guests: Number(guests) || 1, // fallback to 1 if invalid 
              checkInDate , 
              checkOutDate ,
               totalPrice,
          })
           const mailOptions = {
              from:process.env.SENDER_EMAIL,
           to: req.user.email,
           subject: "Hotel Booking Details",
          
           html: `
              <h2>Your Booking Details</h2>
              <p> Dear ${req.user.username},</p>
              <p>Thank you for your Booking! Here are Your details:</p>
                <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>

                <li><strong>Booking Amount:</strong> ₹${booking.totalPrice} /night</li>
                <p> We look forward to welcoming you!</p>
                <p> If you need to make any changes, feel free to contact us.</p>
                 </ul>`
           }
           await transporter.sendMail(mailOptions)

           res.json({success:true  , message: "Booking Created Successfully"})
    } catch (error) {

        console.log(error);
        res.json({success:false ,message: "failed to create booking"})
        
    }
}


//api to get all booing for user

// get /api/bookings/user

export const getUserBookings = async (req , res)=>{
    try {
        const user = req.user._id;
        const bookings = await Booking.find({user}).populate("room hotel").sort({createdAt: -1})

        res.json({success:true , bookings})
    } catch (error) {
        res.json({success:false , message: "failed to fetch bookings"})
    }
}

export const getHotelBookings = async (req , res)=>{
   try {
     const hotel = await Hotel.findOne({owner: req.auth.userId});
    if(!hotel){
        return res.json({success:false , message: "No Hotel Found"});
       
    }
     const bookings = await Booking.find({hotel: hotel._id}).populate("room hotel user").sort({createdAt: -1});

     // total booking
     const totalBookings = bookings.length;
     //total paisa

     const totalRevenue = bookings.reduce((acc , booking)=> acc + booking.totalPrice , 0)

     res.json({success: true , dashboardData: {totalBookings , totalRevenue , bookings}})
    
   } catch (error) {
      res.json({success: false , message: "failed to fecth bookings"})
   }
}

