import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingByUser, postBookingByRoomId, putBookingByBookingId } from "@/controllers/booking-controller";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBookingByUser)
  .post("/", postBookingByRoomId)
  .put("/:bookingId", putBookingByBookingId );
export { bookingsRouter };
