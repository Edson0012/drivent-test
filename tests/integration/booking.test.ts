import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import { createBooking, createEnrollmentWithAddress, createHotel, createPayment, createTicket, createTicketTypeWithHotel, createUser, createValidTicketType } from "../factories";
import * as jwt from "jsonwebtoken";
import { TicketStatus } from "@prisma/client";
import { createRoomHotel, createRoomWithOne } from "../factories/rooms-factory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
    
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when the user has no reservation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 when the user has reservation", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createValidTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const room = await createRoomHotel();
      const booking = await createBooking(user, room);

      const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          ...room,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString()
        }
      });
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
        
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
        
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
        
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
        
    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
 
  describe("when token is valid", () => {
    it("should respond with status 404 when room number is not found or does not exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };
      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(invalidBody);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 403 when there is no vacancy", async () => {
      const user = await createUser();
      const secondUser = await createUser();

      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const secondEnrollment = await createEnrollmentWithAddress(secondUser);

      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const secondTicket = await createTicket(secondEnrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(secondTicket.id, ticketType.price);

      const createdHotel = await createHotel();

      const createRoom = await createRoomWithOne(createdHotel);
      await createBooking(user, createRoom);

      const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send({ roomId: createRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  }); 
});
 
