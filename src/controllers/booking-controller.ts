import { Request, Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services/booking-service";
import { BookingId, RoomId } from "@/protocols";

export async function getBookingByUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try{
    const result = await bookingService.getBooking(userId); 

    return res.status(httpStatus.OK).send({
      id: result.id,
      Room: result.Room
    });
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function postBookingByRoomId(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as RoomId;
  const { userId } = req;

  try{
    const result = await bookingService.postBooking(roomId, userId);
    return res.status(httpStatus.OK).send({ bookingId: result.id });
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "FORBIDDEN") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function putBookingByBookingId( req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body as RoomId;
  const bookingId = Number(req.params.bookingId);

  try {
    const result = await bookingService.putBooking(roomId, bookingId);
    return res.status(httpStatus.OK).send({ bookingId: result });
  } catch( error ) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }

    if(error.name === "FORBIDDEN") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
