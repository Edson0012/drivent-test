import { createRoomHotel } from "./rooms-factory";
import { prisma } from "@/config";
import { createUser } from "./users-factory";
import { Room, User } from "@prisma/client";

export async function createBooking(user?: User, room?: Room) {
  const newUser = user || await createUser();
  const hotelRoom = room || await createRoomHotel();

  return prisma.booking.create({
    data: {
      userId: newUser.id,
      roomId: hotelRoom.id
    }
  });
}
