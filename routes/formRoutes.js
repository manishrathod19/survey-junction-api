const express = require("express");
const { getDB } = require("../config/db");
const moment = require("moment/moment");
const router = express.Router();
require("moment-timezone");

router.get("/getForm", async (req, res) => {
  const { formId } = req.query;
  try {
    if (!formId) {
      res.status(400).json({ message: "Missing formId" });
      return;
    }

    const db = getDB();
    const form = await db.collection("forms").findOne({ formId: formId });
    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
    }

    res.status(201).json({ message: "Form received", data: form });
  } catch (error) {
    console.log("getForm Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/createForm", async (req, res) => {
  const { formId, userId } = req.body;

  try {
    if (!(formId || userId)) {
      res.status(400).json({ message: "Missing properties" });
      return;
    }

    const db = getDB();
    const form = await db.collection("forms").findOne({ formId: formId });
    console.log("form", form);
    if (form) {
      res.status(201).json({ message: "Form already exists" });
      return;
    }
    const createForm = await db.collection("forms").insertOne({
      formId: formId,
      userId: userId,
      heading: "Untitled form",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    res.status(201).json({ message: "Form created successfully" });
  } catch (error) {
    console.log("createForm Error - ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.put("/updateForm", async (req, res) => {
  const { formId, userId, dataToUpdate } = req.body;

  try {
    if (!(formId || userId || dataToUpdate)) {
      res.status(400).json({ message: "Missing property" });
      return;
    }
    const db = getDB();

    const form = await db.collection("forms").findOne({ formId: formId });

    // If form exist, then update it
    if (!form) {
      res.status(400).json({ message: "Form does not exist" });
      return;
    }

    console.log("form", form);
    console.log("form userId", form.userId);
    console.log("userId", userId);

    // If some other user tries to update the form
    if (form.userId != userId) {
      res
        .status(401)
        .json({ message: "You are not authorized to update the form" });
      return;
    }

    // Create an object to store the fields that are not null
    const updateFields = {
      updatedAt: new Date(),
    };

    // Iterate through the fields in the updatedData
    for (const key in dataToUpdate) {
      if (dataToUpdate[key] !== null) {
        updateFields[key] = dataToUpdate[key];
      }
    }

    const updateForm = await db.collection("forms").updateOne(
      { formId: formId },
      {
        $set: updateFields,
      }
    );
    res.status(201).json({ message: "Form updated successfully" });
  } catch (error) {
    console.log("updateForm Error - ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/deleteForm", async (req, res) => {
  const { formId } = req.body;

  try {
    if (!formId) {
      res.status(400).json({ message: "Missing formId" });
      return;
    }

    const db = getDB();

    const form = await db.collection("forms").findOne({ formId: formId });

    // If form exist, then update it
    if (form) {
      const deleteForm = await db
        .collection("forms")
        .deleteOne({ formId: formId });
      res.status(201).json({ message: "Form deleted successfully" });
    }

    res.status(400).json({ message: "Form does not exist" });
  } catch (error) {
    console.log("deleteForm Error - ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/response", async (req, res) => {
  const { formId, response } = req.body;

  try {
    if (!(formId || response)) {
      res.status(400).json("Missing property");
      return;
    }

    const db = getDB();

    const form = await db.collection("forms").findOne({ formId: formId });

    if (!form) {
      res.status(400).json("Form does not exists");
      return;
    }

    await db.collection("responses").insertOne({
      formId: formId,
      response: response,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ message: "Collected response successfully" });
  } catch (error) {
    console.log("response error", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
