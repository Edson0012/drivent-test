import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true }
  });
}

async function createBooking(roomId: number, userId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId
    }
  });
}

async function updateBookingById(bookingId: number, roomId: number) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId }  
  });
}

async function findRoomById( roomId: number ) {
  return prisma.room.findFirst({
    where: { id: roomId },
    include: { Booking: true }
  });
}

const bookingRepository = {
  findBooking,
  createBooking,
  updateBookingById,
  findRoomById
};

export { bookingRepository };
