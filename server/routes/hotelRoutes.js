import exprees from "express"
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel } from "../controllers/hotelController.js";

const hotelRouter = exprees.Router();

hotelRouter.post('/', protect , registerHotel);

export default hotelRouter;

