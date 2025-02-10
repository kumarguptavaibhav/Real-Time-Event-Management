import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { io } from "../index.js";
const prisma = new PrismaClient();
import moment from "moment-timezone";

export const createUser = async ({ name, password, email }) => {
  try {
    const response = await prisma.user.create({
      data: {
        name,
        password,
        email,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async ({ email, password }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ error: true, response: "Invalid credentials" });

    const isMatch = password === user.password;
    if (!isMatch)
      return res
        .status(400)
        .json({ error: true, response: "Invalid credentials" });
    const tokenPayload = { user };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    return { token, user: { name: user.name, email: user.email } };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createEvent = async ({ data, user }) => {
  try {
    const response = await prisma.event.create({
      data: {
        ...data,
        start_date: moment.tz(data.start_date, "Asia/Kolkata").toDate(),
        end_date: moment.tz(data.end_date, "Asia/Kolkata").toDate(),
        created_by: user.id,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const getEvent = async () => {
  try {
    const response = await prisma.event.findMany({
      where: {
        is_cancelled: false,
      },
      include: {
        attendees: true,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelEvent = async ({ id, user }) => {
  try {
    const response = await prisma.event.update({
      where: {
        id: id,
      },
      data: {
        is_cancelled: true,
        updated_by: user.id,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateEvent = async ({ eventId, user, data }) => {
  try {
    const response = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        ...data,
        updated_by: user.id,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSingleEvent = async ({ id }) => {
  try {
    const response = await prisma.event.findMany({
      where: {
        is_cancelled: false,
        id: id,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const joinEvent = async ({ eventId, userId }) => {
  try {
    const existingAttendee = await prisma.attendee.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });

    if (existingAttendee) {
      throw new Error("User is already joined in the event.");
    }

    const response = await prisma.attendee.create({
      data: { userId, eventId },
    });

    io.to(eventId).emit("attendeeUpdate", { eventId, userId, action: "join" });

    return response;
  } catch (error) {
    console.error("Error joining event:", error);
    throw new Error(error.message);
  }
};
