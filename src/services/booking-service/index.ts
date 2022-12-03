import { forbidden, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(+userId);
  if(!booking) throw notFoundError();

  return booking;
}

async function postBooking(roomId: number, userId: number) {
  if(!roomId) throw notFoundError();

  const bedroom = await bookingRepository.findRoomById(roomId);

  if(bedroom.Booking.length ===  bedroom.capacity ) throw forbidden();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if(!enrollment) throw forbidden();

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket) throw forbidden();

  if(ticket.status !== "PAID") throw forbidden();

  if(ticket.TicketType.includesHotel !== true && ticket.TicketType.isRemote !== false) throw forbidden();

  const insertBooking = await bookingRepository.createBooking(roomId, userId);

  return insertBooking; 
}

async function putBooking(roomId: number, bookingId: number) {
  if(!roomId) throw notFoundError();

  const bedroom = await bookingRepository.findRoomById(roomId);

  if(bedroom.Booking.length ===  bedroom.capacity ) throw forbidden();

  const updateBooking = await bookingRepository.updateBookingById(roomId, bookingId);

  if(!updateBooking) throw notFoundError();

  return updateBooking;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking
};

export { bookingService };
