import { Hotel } from "@prisma/client";
import { prisma } from "@/config";
import { createHotel } from "./hotels-factory";
import faker from "@faker-js/faker";

export async function createRoomHotel(hotel?: Hotel) {
  const entraceHotel = hotel || await createHotel();

  return prisma.room.create({
    data: {
      name: `${faker.datatype.number({ min: 1, max: 9 }) * 100}`,
      capacity: faker.datatype.number({ min: 1, max: 6 }),
      hotelId: entraceHotel.id
    }
  });
}

export async function createRoomWithOne(hotel?: Hotel) {
  const entraceHotel = hotel || await createHotel();

  return prisma.room.create({
    data: {
      name: `${faker.datatype.number({ min: 1, max: 9 }) * 100}`,
      capacity: 1,
      hotelId: entraceHotel.id
    }
  });
}
