import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBookingByUser, postBookingByRoomId } from "@/controllers/booking-controller";

const bookingsRouter = Router();

bookingsRouter
  .all("/*", authenticateToken)
  .get("/", getBookingByUser)
  .post("/", postBookingByRoomId);
export { bookingsRouter };
