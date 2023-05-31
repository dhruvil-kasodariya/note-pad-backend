const router = require("express").Router();
const Note = require("../models/Note");
const CryptoJS = require("crypto-js");

//add note
router.post("/addNote", async (req, res) => {
  let encryptNoteTitle = CryptoJS.AES.encrypt(
    req.body.noteTitle,
    process.env.CRYPTIC_NOTE_TITLE_KEY
  ).toString();
  let encryptNoteContent = CryptoJS.AES.encrypt(
    req.body.noteContent,
    process.env.CRYPTIC_NOTE_CONTENT_KEY
  ).toString();
  const newNote = new Note({
    noteTitle: encryptNoteTitle,
    noteContent: encryptNoteContent,
    user: {
      userId: req.body.user.userId,
      useremail: req.body.user.useremail,
    },
  });

  try {
    const savedNote = await newNote.save();
    if (savedNote) {
      savedNote.noteTitle = CryptoJS.AES.decrypt(
        savedNote.noteTitle,
        process.env.CRYPTIC_NOTE_TITLE_KEY
      ).toString(CryptoJS.enc.Utf8);
      savedNote.noteContent = CryptoJS.AES.decrypt(
        savedNote.noteContent,
        process.env.CRYPTIC_NOTE_CONTENT_KEY
      ).toString(CryptoJS.enc.Utf8);
      res.status(200).json(savedNote);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get notes by userId
router.get("/user/getNotes/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    const Notes = await Note.find({ "user.userId": userId });
    if (Notes) {
      Notes.forEach((Notes) => {
        Notes.noteTitle = CryptoJS.AES.decrypt(
          Notes.noteTitle,
          process.env.CRYPTIC_NOTE_TITLE_KEY
        ).toString(CryptoJS.enc.Utf8);
      });
      Notes.forEach((Notes) => {
        Notes.noteContent = CryptoJS.AES.decrypt(
          Notes.noteContent,
          process.env.CRYPTIC_NOTE_CONTENT_KEY
        ).toString(CryptoJS.enc.Utf8);
      });
      res.status(200).json(Notes);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete all notes by userId
router.delete("/user/delete/:userId", async (req, res) => {
  let userId = req.params.userId;
  try {
    await Note.deleteMany({ "user.userId": userId });
    res.status(200).send({ message: "User All Note Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete note by id
router.delete("/delete/:noteId", async (req, res) => {
  let noteId = req.params.noteId;
  try {
    await Note.findByIdAndDelete({ _id: noteId });
    res.status(200).send({ message: "Note Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

//get note by Id
router.get("/getNote/:noteId", async (req, res) => {
  let noteId = req.params.noteId;
  console.log(noteId);
  try {
    const getNote = await Note.find({ _id: noteId });

    if (getNote) {
      getNote[0].noteTitle = CryptoJS.AES.decrypt(
        getNote[0].noteTitle,
        process.env.CRYPTIC_NOTE_TITLE_KEY
      ).toString(CryptoJS.enc.Utf8);
      getNote[0].noteContent = CryptoJS.AES.decrypt(
        getNote[0].noteContent,
        process.env.CRYPTIC_NOTE_CONTENT_KEY
      ).toString(CryptoJS.enc.Utf8);
      res.status(200).json(getNote);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//update note by id
router.put("/update/:noteId", async (req, res) => {
  let noteId = req.params.noteId;
  req.body.noteTitle = CryptoJS.AES.encrypt(
    req.body.noteTitle,
    process.env.CRYPTIC_NOTE_TITLE_KEY
  ).toString();
  req.body.noteContent = CryptoJS.AES.encrypt(
    req.body.noteContent,
    process.env.CRYPTIC_NOTE_CONTENT_KEY
  ).toString();
  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: req.body },
      { new: true }
    );
    if (updatedNote) {
      updatedNote.noteTitle = CryptoJS.AES.decrypt(
        updatedNote.noteTitle,
        process.env.CRYPTIC_NOTE_TITLE_KEY
      ).toString(CryptoJS.enc.Utf8);
      updatedNote.noteContent = CryptoJS.AES.decrypt(
        updatedNote.noteContent,
        process.env.CRYPTIC_NOTE_CONTENT_KEY
      ).toString(CryptoJS.enc.Utf8);
      res.status(201).json(updatedNote);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/update/title/:noteId", async (req, res) => {
  let noteId = req.params.noteId;
  req.body.noteTitle = CryptoJS.AES.encrypt(
    req.body.noteTitle,
    process.env.CRYPTIC_NOTE_TITLE_KEY
  ).toString();
  try {
    const updatedNote = await Note.findByIdAndUpdate(noteId, {
      noteTitle: req.body.noteTitle,
    });
    if (updatedNote) {
      updatedNote.noteTitle = CryptoJS.AES.decrypt(
        updatedNote.noteTitle,
        process.env.CRYPTIC_NOTE_TITLE_KEY
      ).toString(CryptoJS.enc.Utf8);
      updatedNote.noteContent = CryptoJS.AES.decrypt(
        updatedNote.noteContent,
        process.env.CRYPTIC_NOTE_CONTENT_KEY
      ).toString(CryptoJS.enc.Utf8);
      res.status(201).json(updatedNote);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
