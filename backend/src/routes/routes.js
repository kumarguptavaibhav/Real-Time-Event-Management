import express from "express";
import { authenticateJWT } from "../middleware/middleware.js";
import {
  createEvent,
  createUser,
  login,
  getEvent,
  cancelEvent,
  getSingleEvent,
  joinEvent,
  updateEvent,
} from "../controllers/controllers.js";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("Invalid Payload");
    }
    const data = await createUser({ name, email, password });
    res.status(200).json({ error: false, response: data });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Invalid Payload");
    }
    const data = await login({ email, password });
    res.status(200).json({
      error: false,
      response: data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/create-event", authenticateJWT, async (req, res, next) => {
  try {
    const { data, user } = req.body;
    if (!data || !user) {
      throw new Error("Invalid Payload");
    }
    const result = await createEvent({ data, user });
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/get-event", async (req, res, next) => {
  try {
    const result = await getEvent();
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/cancel-event", authenticateJWT, async (req, res, next) => {
  try {
    const { id, user } = req.body;
    if (!id || !user) {
      throw new Error("Invalid Payload");
    }
    const result = await cancelEvent({ id, user });
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/update-event", authenticateJWT, async (req, res, next) => {
  try {
    const { eventId, user, data } = req.body;
    if (!eventId || !user || !data) {
      throw new Error("Invalid Payload");
    }
    const result = await updateEvent({ eventId, user, data });
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/get-single-event", authenticateJWT, async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      throw new Error("Invalid Payload");
    }
    const result = await getSingleEvent({ id });
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/join-event", authenticateJWT, async (req, res, next) => {
  try {
    const { userId, eventId } = req.body;
    if (!userId || !eventId) {
      throw new Error("Invalid Payload");
    }
    const result = await joinEvent({ eventId, userId });
    res.status(200).json({
      error: false,
      response: result,
    });
  } catch (error) {
    next(error);
  }
});
export default router;
