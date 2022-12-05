import faker from "@faker-js/faker";
import { prisma } from "@/config";

//Sabe criar objetos - Hotel do banco
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.name.findName(),
      image: faker.image.imageUrl(),
    }
  });
}

export async function createRoomWithHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: "1020",
      capacity: 3,
      hotelId: hotelId,
    }
  });
}

export async function createRoomByHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: String(faker.random.numeric(4)),
      capacity: Number(faker.random.numeric(1)),
      hotelId: hotelId,
    }
  });
}
