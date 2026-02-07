import axios from 'axios';
import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import { connect, url } from "../../../../config/db/index.js";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import Journal from "../../../../model/Paper/Journals/Journals.js";
import Project from "../../../../model/Teachings/projects/index.js";
import Conference from "../../../../model/Paper/Conference/Conference.js";
import Books from "../../../../model/Paper/Books/Books.js";
import Workshops from "../../../../model/Paper/Workshops/Workshops.js";
import Patents from "../../../../model/Paper/Patents/Patents.js";
import event from "../../../../model/Highlights/events.js";
import news from "../../../../model/Highlights/news.js";
import announcement from "../../../../model/Highlights/announcements.js";
import springSemester from '../../../../model/Teachings/springSemester/springSemester.js';
import autumnSemester from '../../../../model/Teachings/autumnSemester/autumnSemester.js';
import student from "../../../../model/People/student.js";
import achievement from "../../../../model/People/achievement.js";
import graduateStudent from "../../../../model/People/graduate.js";
import memories from "../../../../model/Highlights/gallery.js";
import activity from "../../../../model/Teachings/activities.js";
import awardsandtalks from "../../../../model/Teachings/awardsAndHonour.js";



const router = express.Router();
// import authentication from "../../../../middleware/authFromTokenForAdmin/index.js";
// router.use(authentication);

const app = express();
app.use(bodyParser.json());
app.use(express.json());

const User = new MongoClient(url);

// mongoose
//   .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err));

let isConnected = false;

const connectClient = async () => {
  if (!isConnected) {
    await User.connect();
    isConnected = true;
  }
};

const closeClient = async () => {
  if (isConnected) {
    await User.connect();
    isConnected = false;
  }
};


export const getHelloWorld = async (req, res) => {
  try {
    res.status(200).send("Hello World");
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

// This is for creation in Publication By Admin which have collections are Journal,Conference,Workshops,,Patents2,Books

export const createPublicationJournal = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const JournalDatabase = database.collection("Journals");
     const serialno = await JournalDatabase.find({}).sort({serialno:-1}).toArray();
     const sr =  (Object.keys(serialno).length===0)? 0 : serialno[0];
     const sr2 = (sr===0)?0:sr.serialno;
    const publicationJSON = new Journal(req.body);
    publicationJSON.serialno = sr2+1;
    const savePublications = await publicationJSON.save();
    console.log(savePublications)
    const data = await JournalDatabase.insertOne(savePublications);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const createPublicationConference = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const ConferenceDatabase = database.collection("Conference");
    const serialno = await ConferenceDatabase.find({}).sort({serialno:-1}).toArray();
    const sr =  (Object.keys(serialno).length===0)? 0 : serialno[0];
    const sr2 = (sr===0)?0:sr.serialno;
    const publicationJSON = new Conference(req.body);
    publicationJSON.serialno = sr2+1;
    console.log(publicationJSON);
    const savePublications = await publicationJSON.save();
    const data = await ConferenceDatabase.insertOne(savePublications);
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const createPublicationPatents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const ConferencePatents = database.collection("Patents");
    const serialno = await ConferencePatents.find({}).sort({serialno:-1}).toArray();
    const sr =  (Object.keys(serialno).length===0)? 0 : serialno[0];
    const sr2 = (sr===0)?0:sr.serialno;
    const publicationJSON = new Patents(req.body);
    publicationJSON.serialno = sr2+1;
    const data = await ConferencePatents.insertOne(publicationJSON);
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const createPublicationBooks = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const BooksDatabase = database.collection("Books");
    const serialno = await BooksDatabase.find({}).sort({serialno:-1}).toArray();
    const sr =  (Object.keys(serialno).length===0)? 0 : serialno[0];
    const sr2 = (sr===0)?0:sr.serialno;
    const publicationJSON = new Books(req.body);
    publicationJSON.serialno = sr2+1;
    console.log(publicationJSON);
    const data = await BooksDatabase.insertOne(publicationJSON);
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const createPublicationWorkshops = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const WorkshopsDatabase = database.collection("Workshops");
    const serialno = await WorkshopsDatabase.find({}).sort({serialno:-1}).toArray();
    const publicationJSON = new Workshops(req.body);
    const sr =  (Object.keys(serialno).length===0)? 0 : serialno[0];
    const sr2 = (sr===0)?0:sr.serialno;
   
    publicationJSON.serialno = sr2+1;
    const data = await WorkshopsDatabase.insertOne(publicationJSON);
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};



// This is for get in Publication By title Admin which have collections to update are Journal,Conference,Workshops,Patents,Books

export const getASinglePublicationOnBasisTitleBooks = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Books");
    const titleFilter = req.params.title;
    const DataForUpdate = await postData
      .find({ title: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getASinglePublicationOnBasisTitleConference = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Conference");
    const titleFilter = req.params.title;
    const DataForUpdate = await postData
      .find({ title: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// Add this function to get ALL conference publications
export const getAllPublicationsConference = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Conference");
    
    // Get all conferences, sorted by serial number or date
    const DataForUpdate = await postData
      .find({})
      .sort({ serialno: -1 })
      .toArray();
    
    console.log(`Found ${DataForUpdate.length} conference publications`);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    console.error("Error getting all conferences:", error);
    res.status(500).send({ message: error.message });
  }
};

export const getASinglePublicationOnBasisTitleJournal = async (req, res) => {
  try {
    await connectClient();
    const titleFilter = req.params.title;
    const database = User.db("Paper");
    const postData = database.collection("Journals");
    const DataForUpdate = await postData
      .find({ title: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// Add this function to get ALL journal publications
export const getAllPublicationsJournal = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Journals");
    
    // Get all journals, sorted by serial number or date
    const DataForUpdate = await postData
      .find({})
      .sort({ serialno: -1 }) // or { publishedOn: -1 } for newest first
      .toArray();
    
    console.log(`Found ${DataForUpdate.length} journal publications`);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    console.error("Error getting all journals:", error);
    res.status(500).send({ message: error.message });
  }
};

// In your controller file (controller/Admin/actions/Admin/index.js)

// Add this function
export const getAllPublicationsBooks = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Books");
    
    // Get all books, sorted by publishingDate or serialno
    const DataForUpdate = await postData
      .find({})
      .sort({ serialno: -1 }) // or { publishingDate: -1 } for newest first
      .toArray();
    
    console.log(`Found ${DataForUpdate.length} book publications`);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    console.error("Error getting all books:", error);
    res.status(500).send({ message: error.message });
  }
};

export const getASinglePublicationOnBasisTitlePatents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Patents");
    const titleFilter = req.params.title;
    const DataForUpdate = await postData
      .find({ title: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// Add this function to get ALL patent publications
export const getAllPublicationsPatent = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Patents");
    
    // Get all patents, sorted by date or serialno
    const DataForUpdate = await postData
      .find({})
      .sort({ date: -1 }) // newest first
      .toArray();
    
    console.log(`Found ${DataForUpdate.length} patent publications`);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    console.error("Error getting all patents:", error);
    res.status(500).send({ message: error.message });
  }
};

export const getASinglePublicationOnBasisTitleWorkshops = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Workshops");
    const titleFilter = req.params.title;
    const DataForUpdate = await postData
      .find({ title: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getAllPublicationsWorkshops = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Paper");
    const postData = database.collection("Workshops");
    
    const DataForUpdate = await postData
      .find({})
      .sort({ year: -1 })
      .toArray();
    
    console.log(`Found ${DataForUpdate.length} workshop publications`);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    console.error("Error getting all workshops:", error);
    res.status(500).send({ message: error.message });
  }
};
// This is for updating in Publication By Admin which have collections are Journal,Conference,Workshops,Patents,Books

export const UpdatePublicationBooks = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findId = new ObjectId(id)
    console.log(findId);
    const database = User.db("Paper");
    const postData = database.collection("Books");
    const BooksJson = new Books(req.body);

    const result = await postData.findOneAndUpdate(
      { _id:findId },
      {
        $set: {
     
          authors: BooksJson.authors,
          title: BooksJson.title,
          additionalInfo: BooksJson.additionalInfo,
          ISBN: BooksJson.ISBN,
          volume: BooksJson.volume,
          pages: BooksJson.pages,
          publishingDate: BooksJson.publishingDate,
          publisher: BooksJson.publisher,
          weblink: BooksJson.weblink,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    console.log(result);

    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const UpdatePublicationConference = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const FindId = new ObjectId(id)
    const publicationJSONConference = new Conference(req.body);
    console.log(FindId);
    const database = User.db("Paper");
    const postData = database.collection("Conference");
    const result = await postData.findOneAndUpdate(
      { _id: FindId },
      {
        $set: {
          
          authors: publicationJSONConference.authors,
          roleInProject: publicationJSONConference.roleInProject,
          title: publicationJSONConference.title,
          conference: publicationJSONConference.conference,
          location: publicationJSONConference.location,
          ranking: publicationJSONConference.ranking,
          DOI: publicationJSONConference.DOI,
          pages: publicationJSONConference.pages,
          additionalInfo: publicationJSONConference.additionalInfo,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    console.log(result);
    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const UpdatePublicationJournal = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const publicationJSONJournal = new Journal(req.body);
    const findId = new ObjectId(id);
    console.log(findId);
    const database = User.db("Paper");
    const postData = database.collection("Journals");
    const result = await postData.findOneAndUpdate(
      { _id: findId },
      {
        $set: {
          authors: publicationJSONJournal.authors,
          title: publicationJSONJournal.title,
          journal: publicationJSONJournal.journal,
          volume: publicationJSONJournal.volume,
          pages: publicationJSONJournal.pages,
          publishedOn: publicationJSONJournal.publishedOn,
          DOI: publicationJSONJournal.DOI,
          IF: publicationJSONJournal.IF,
          SJR: publicationJSONJournal.SJR,
          additionalInfo: publicationJSONJournal.additionalInfo,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    console.log(publicationJSONJournal);
    console.log(result);
    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const UpdatePublicationPatents = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const publicationJSONPatents = new Patents(req.body);
    const findId = new ObjectId(id)
    const database = User.db("Paper");
    const postData = database.collection("Patents");
    const result = await postData.findOneAndUpdate(
      { _id: findId },
      {
        $set: {
          status: publicationJSONPatents.status,
          authors: publicationJSONPatents.authors,
          title: publicationJSONPatents.title,
          date: publicationJSONPatents.date,
          pages: publicationJSONPatents.pages,
          patent_number: publicationJSONPatents.patent_number,
          application_number: publicationJSONPatents.application_number,
          publisher: publicationJSONPatents.publisher,
          weblink: publicationJSONPatents.publisher,
          additionalInfo: publicationJSONPatents.additionalInfo,
        },
      },
      { returnDocument: "after" }
    );

    console.log(result);
    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const UpdatePublicationWorkshops = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const publicationJSONWorkShop = new Workshops(req.body);
    const findeId = new ObjectId(id);
    console.log(publicationJSONWorkShop);
    const database = User.db("Paper");
    const postData = database.collection("Workshops");

    const result = await postData.findOneAndUpdate(
      { _id: findeId },
      {
        $set: {
          names: publicationJSONWorkShop.names,
          title: publicationJSONWorkShop.title,
          workshop: publicationJSONWorkShop.workshop,
          pages: publicationJSONWorkShop.pages,
          location: publicationJSONWorkShop.location,
          year: publicationJSONWorkShop.year,
          weblink: publicationJSONWorkShop.weblink,
          ranking: publicationJSONWorkShop.ranking,
          awardedBy: publicationJSONWorkShop.awardedBy,
          updatedAt: new Date(),
          additionalInfo: publicationJSONWorkShop.additionalInfo,
        },
      },
      { returnDocument: "after" }
    );

    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// This is for deleting in Publication By Admin which have collections are Journal,Conference,Workshops,Patents,Books

export const DeletePublicationBooks = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Paper");
    const postData = database.collection("Books");
    const result = await postData.findOneAndDelete(
      { _id:findeId},
      { returnDocument: "after" }
    );
    console.log(result);
    res.status(200).send({ DeleteData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const DeletePublicationConference = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Paper");
    const postData = database.collection("Conference");
    const result = await postData.findOneAndDelete(
      { _id:findeId },
      { returnDocument: "after" }
    );

    console.log(result);
    res.status(200).send({ DeleteData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const DeletePublicationJournal = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const publicationJSONJournal = new Journal(req.body);
    const database = User.db("Paper");
    const postData = database.collection("Journals");
    const result = await postData.findOneAndDelete(
      { _id: findeId },
      { returnDocument: "after" }
    );
    console.log(publicationJSONJournal);
    console.log(result);
    res.status(200).send({ DeleteData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const DeletePublicationPatents = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Paper");
    const postData = database.collection("Patents");
    const result = await postData.findOneAndDelete(
      { _id: findeId },
      { returnDocument: "after" }
    );

    console.log(result);
    res.status(200).send({ DeleteData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const DeletePublicationWorkshops = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Paper");
    const postData = database.collection("Workshops");
    const result = await postData.findOneAndDelete(
      { _id: findeId },
      { returnDocument: "after" }
    );
    res.status(200).send({ DeleteData: result });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// This is for creation in projects By Admin which have collections are projects

export const createProjects = async (req, res) => {
  try {
    await connectClient();
    const publicationJSON = new Project(req.body);
    const savePublications = await publicationJSON.save();
    const database = User.db("Teachings");
    const JournalDatabase = database.collection("projects");
    const data = await JournalDatabase.insertOne(savePublications);
    console.log(data);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const getASingleProjectOnBasisProjects = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const postData = database.collection("projects");
    const titleFilter = req.params.title;
    console.log(titleFilter);
    const DataForUpdate = await postData
      .find({ projectTitle: { $regex: titleFilter, $options: "i" } })
      .toArray();
    console.log(DataForUpdate);
    res.status(200).send({ DataForUpdate: DataForUpdate });
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

export const updateProject = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeById = new ObjectId(id)
    const {
      projectTitle,
      typeOfProject,
      roleInProject,
      sponsors,
      collaboration,
      total_grant_inr,
      total_grant_usd,
      duration,
      additionalInfo,
      status
    } = req.body;
  console.log(status)
    const database = User.db("Teachings");
    const postData = database.collection("projects");

    const result = await postData.findOneAndUpdate(
      { _id: findeById },
      {
        $set: {
          projectTitle:projectTitle,
          typeOfProject:typeOfProject,
          roleInProject:roleInProject,
          sponsors:sponsors,
          collaboration:collaboration,
          total_grant_inr:total_grant_inr,
          total_grant_usd:total_grant_usd,
          duration:duration,
          additionalInfo:additionalInfo,
          updatedAt: new Date(),
          status:status
        },
      },
      { returnDocument: "after" }
    );
     console.log(result)
    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

export const DeleteProject = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);

    const database = User.db("Teachings");
    const postData = database.collection("projects");

    const result = await postData.findOneAndDelete(
      { _id:findeId},
      { returnDocument: "after" }
    );

    console.log(result);
    res.status(200).send({ DeleteData: result, Document: "delete" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// This is for find a specific Event, News, Announcements

// getSelected Events
export const getSelectedEvents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const eventCollection = database.collection("events");

    const eventDescription = req.query.eventDescription || "";
    const specificDate = req.query.date ? new Date(req.query.date) : null;

    const query = {};

    if (eventDescription) {
      query.eventDescription = { $regex: eventDescription, $options: "i" };
    }

    if (specificDate && !isNaN(specificDate.getTime())) {
      const startOfDay = new Date(specificDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(specificDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const projection = { _id: 1, date: 1, eventDescription: 1, url: 1 };

    const events = await eventCollection
      .find(query, { projection })
      .sort({ date: -1 })
      .toArray();

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found on this date" });
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// getSelected News

export const  getSelectedNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const newsCollection = database.collection("news");

    const specificDate = req.query.date ? new Date(req.query.date) : null;

    if (!specificDate || isNaN(specificDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid or missing date parameter" });
    }

    const startOfDay = new Date(specificDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(specificDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const query = {
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    };

    const projection = {
      _id: 1,
      newsTopic: 1,
      createdAt: 1,
      newsDescription: 1,
      urlToImage: 1,
      url: 1,
    };

    const News = await newsCollection
      .find(query, { projection })
      .sort({ createdAt: -1 })
      .toArray();

    if (News.length === 0) {
      return res.status(404).json({ message: "No news found on this date" });
    }
    res.status(200).json(News);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

//getAll News

// New function to get ALL news (doesn't require date parameter)
export const getAllNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const newsCollection = database.collection("news");

    const projection = {
      _id: 1,
      newsTopic: 1,
      createdAt: 1,
      newsDescription: 1,
      urlToImage: 1,
      url: 1,
    };

    const News = await newsCollection
      .find({}, { projection }) // Empty query = get all documents
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    res.status(200).json(News);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// getSelected Announcements

export const getSelectedAnnouncements = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const announcementCollection = database.collection("announcements");

    const specificDate = req.query.date ? new Date(req.query.date) : null;
    const query = {};

    if (specificDate && !isNaN(specificDate.getTime())) {
      const startOfDay = new Date(specificDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(specificDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    const projection = {
      _id: 1,
      date: 1,
      topicOfAnnouncement: 1,
      readMore: 1,
    };

    const Announcements = await announcementCollection
      .find(query, { projection })
      .sort({ date: -1 })
      .toArray();

    if (Announcements.length === 0) {
      return res
        .status(404)
        .json({ message: "No announcements found on this date" });
    }
    res.status(200).json(Announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// This is for creation in Events By Admin which have collections are events.

// Create an Event
export const createEvent = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const eventsCollection = database.collection("events");
    const { date, eventDescription, url } = req.body;
    const eventDate = new Date(date);

    const newEvent = {
      date: eventDate,
      eventDescription,
      url,
    };

    try {
      const result = await eventsCollection.insertOne(newEvent);
      const createdEvent = {
        _id: result.insertedId,
        ...newEvent,
      };
      res.status(201).json(createdEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update an Event
export const updateEvent = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const eventsCollection = database.collection("events");
    const { id } = req.params;
    const {
      year: newYear,
      month: newMonth,
      day: newDay,
      eventDescription,
      url,
    } = req.body;

    const newDate = new Date(Date.UTC(newYear, newMonth - 1, newDay, 0, 0, 0));

    try {
      const eventId = new ObjectId(id);
      const event = await eventsCollection.findOne({ _id: eventId });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      const updatedEvent = {
        ...event,
        eventDescription,
        url,
        date: newDate,
        updatedAt: new Date(),
      };

      await eventsCollection.updateOne(
        { _id: eventId },
        { $set: updatedEvent }
      );
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete an Event
export const deleteEvent = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const eventsCollection = database.collection("events");
    const { id } = req.params;

    try {
      const eventId = new ObjectId(id); // Convert id to ObjectId
      const event = await eventsCollection.findOne({ _id: eventId });

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      await eventsCollection.deleteOne({ _id: eventId });
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// This is for creation in News By Admin which have collections are news.

// Create News
export const createNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const newsCollection = database.collection("news");
    const { date, newsTopic, newsDescription, urlToImage, url } = req.body;
    const createdAt = new Date(date); // month - 1 because month is zero-indexed in Date

    const newNews = {
      newsTopic,
      createdAt,
      newsDescription,
      urlToImage,
      url,
    };

    try {
      const result = await newsCollection.insertOne(newNews);
      const createdNews = {
        _id: result.insertedId,
        ...newNews,
      };
      res.status(201).json(createdNews); // Send the created news back to the client
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update News
export const updateNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const newsCollection = database.collection("news");
    const { id } = req.params;
    const { newsTopic, newsDescription, urlToImage, url } = req.body;
   console.log(newsTopic, newsDescription, urlToImage, url);

    try {
      const newsId = new ObjectId(id); // Convert id to ObjectId
      const news = await newsCollection.findOne({ _id: newsId });

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

   

      const updatedNews = {
        ...news,
        newsTopic,
        newsDescription,
        urlToImage,
        url,
        updatedAt: new Date(), // Update updatedAt to current date
      };

      await newsCollection.updateOne({ _id: newsId }, { $set: updatedNews });
      res.status(200).json(updatedNews);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};
// Delete News
export const deleteNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const newsCollection = database.collection("news");
    const { id } = req.params;

    try {
      const newsId = new ObjectId(id);
      const news = await newsCollection.findOne({ _id: newsId });

      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }

      await newsCollection.deleteOne({ _id: newsId });
      res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// This is for creation in Announcements By Admin which have collections are announcements.

// Create Announcement


export const createAnnouncement = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const announcementsCollection = database.collection("announcements");
    const { announcementDate, topicOfAnnouncement, readMore } = req.body;
    const date = new Date(announcementDate);
    const newAnnouncement = {
      date,
      topicOfAnnouncement,
      readMore,
    };
    console.log(newAnnouncement)
    try {
      const result = await announcementsCollection.insertOne(newAnnouncement);
      const createdAnnouncement = {
        _id: result.insertedId,
        ...newAnnouncement
      };
      res.status(201).json(createdAnnouncement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};


// Update Announcement
export const updateAnnouncement = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const announcementsCollection = database.collection("announcements");
    const { id } = req.params;
    const {
      year: newYear,
      month: newMonth,
      day: newDay,
      topicOfAnnouncement,
      readMore,
    } = req.body;

    const newDate = new Date(Date.UTC(newYear, newMonth - 1, newDay, 0, 0, 0));

    try {
      const announcementId = new ObjectId(id);
      const announcement = await announcementsCollection.findOne({
        _id: announcementId,
      });

      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      const updatedAnnouncement = {
        ...announcement,
        topicOfAnnouncement,
        readMore,
        date: newDate,
      };

      await announcementsCollection.updateOne(
        { _id: announcementId },
        { $set: updatedAnnouncement }
      );
      res.status(200).json(updatedAnnouncement);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Announcement
export const deleteAnnouncement = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Highlights");
    const announcementsCollection = database.collection("announcements");
    const { id } = req.params;

    try {
      const announcementId = new ObjectId(id);
      const announcement = await announcementsCollection.findOne({
        _id: announcementId,
      });

      if (!announcement) {
        return res.status(404).json({ message: "Announcement not found" });
      }

      await announcementsCollection.deleteOne({ _id: announcementId });
      res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};



// This is for creating Teaching semester updating or deleting



export const createSemester = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const semester = req.params.semester;
    const trueSemester = (semester=="springSemester")?"springSemester":"autumnSemester";
    console.log(trueSemester);
    const semesterForAdd = database.collection(trueSemester);
    const { year, courses } = req.body;
    const courseForAdd = {
      year,
      courses
    };
    console.log(courseForAdd)
    try {
      const result = await semesterForAdd.insertOne(courseForAdd);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};




export const getSelectedSemester = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const springSemesterCollection = database.collection("springSemester");
    const autumnSemesterCollection = database.collection("autumnSemester");
    const year = req.params.year;
    console.log(year);
    const DataForSpringSemesterCollection = await springSemesterCollection.find({ year: year}).toArray();
    const DataForautumnSemesterCollection = await autumnSemesterCollection.find({ year: year}).toArray();
    res.status(200).json({DataForSpringSemesterCollection:DataForSpringSemesterCollection,DataForautumnSemesterCollection:DataForautumnSemesterCollection});
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};


export const UpdateSelectedSemester = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const semester = req.params.semester;
    const trueSemester = (semester=="springSemester")?"springSemester":"autumnSemester";
    console.log(trueSemester);
    if(trueSemester=="autumnSemester")
    {
      const autumnSemesterJSON =  req.body; 
      const findeId = new ObjectId(id);
      console.log(autumnSemesterJSON);
     const database = User.db("Teachings");
    const postData = database.collection("autumnSemester");
    const spring = await postData.findOne({
      _id: findeId,
    });

    if (!spring) {
      return res.status(404).json({ message: "autumnSemester not found" });
    }
    const result = await postData.findOneAndUpdate(
      { _id: findeId },
      {
        $set: {
          year: autumnSemesterJSON.year,
          courses: autumnSemesterJSON.courses
        },
      },
      { returnDocument: "after" }
    );
    res.status(200).send({ updateData: result });
    }
    else{
 
          const springSemesterJSON =  req.body; 
          const findeId = new ObjectId(id);
          console.log(springSemesterJSON);
         const database = User.db("Teachings");
        const postData = database.collection("springSemester");
        const autumn = await postData.findOne({
          _id: findeId,
        });
    
        if (!autumn) {
          return res.status(404).json({ message: "springSemester not found" });
        }
        const result = await postData.findOneAndUpdate(
          { _id: findeId },
          {
            $set: {
              year: springSemesterJSON.year,
              courses: springSemesterJSON.courses
            },
          },
          { returnDocument: "after" }
        );
        res.status(200).send({ updateData: result });
        
    }
  } 
  catch (error) {
    console.log("This is an error",error)
    res.status(500).send({ error });
  } finally {
    await closeClient();
  }
};



export const deleteSelectedSemester = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Teachings");
    const autumnData = database.collection("autumnSemester");
    const springData = database.collection("springSemester");
    const autumn = await autumnData.findOne({
      _id: findeId
    });
    const spring = await springData.findOne({
      _id: findeId,
    });
  if(autumn)
  {
    const DeletedAutumn = await autumnData.findOneAndDelete({
      _id: findeId
    },
    { returnDocument: "after" });

    res.status(200).send({ DeletedAutumn: DeletedAutumn });
  }
  else if(spring)
  {
    const DeletedSpring = await springData.findOneAndDelete({
      _id: findeId
    },
    { returnDocument: "after" });

    res.status(200).send({ DeletedSpring: DeletedSpring });
  }
  else
  {
    return res.status(404).json({ message: "Semester not found to delete" });
  }
  } 
  catch (error) {
    console.log("This is an error",error)
    res.status(500).send({ error });
  } finally {
    await closeClient();
  }
};


//This is for creating,updating or deleting ResearchArea 
export const createResearchArea = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const researchareaAdd = database.collection("researcharea");
    const {researcharea_name, details } = req.body;
    const researcharea = {
      researcharea_name,
      details
    };
    console.log(researcharea)
      const result = await researchareaAdd.insertOne(researcharea);
      res.status(201).json(result);

  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};


export const getSelectedResearchArea = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const researchareaCollection = database.collection("researcharea");
    const title = req.params.title;
    const DataForResearchAreaCollection = await researchareaCollection.find({ researcharea_name: { $regex: title, $options: "i" }}).toArray();
    if (!DataForResearchAreaCollection) {
      return res.status(404).json({ message: "Researcharea not found" });
    }
    res.status(200).json({DataForResearchAreaCollection:DataForResearchAreaCollection});
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};


export const UpdateResearchArea = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
     const ResearchAreaJSON =  req.body; 
      const findeId = new ObjectId(id);
      console.log(ResearchAreaJSON);
     const database = User.db("Teachings");
    const postData = database.collection("researcharea");
    const researcharea = await postData.findOne({
      _id: findeId,
    });
    if (!researcharea) {
      return res.status(404).json({ message: "Researcharea not found" });
    }
  
        const result = await postData.findOneAndUpdate(
          { _id: findeId },
          {
            $set: {
              researcharea_name: ResearchAreaJSON.researcharea_name,
              details: ResearchAreaJSON.details
            },
          },
          { returnDocument: "after" }
        );
        res.status(200).send({ updateData: result });
        
    }
  catch (error) {
    console.log("This is an error",error)
    res.status(500).send({ error });
  } finally {
    await closeClient();
  }
};


export const deleteSelectedResearchArea = async (req, res) => {
  try {
    await connectClient();
    const id = req.params.id;
    const findeId = new ObjectId(id);
    const database = User.db("Teachings");
    const postData = database.collection("researcharea");
    const researcharea = await postData.findOne({
      _id: findeId,
    });
    if (!researcharea) {
      return res.status(404).json({ message: "Researcharea not found" });
    }

    const DeletedResearchArea = await postData.findOneAndDelete({
      _id: findeId
    },
    { returnDocument: "after" });

    res.status(200).send({ DeletedResearchArea: DeletedResearchArea });
  } 
  catch (error) {
    console.log("This is an error",error)
    res.status(500).send({ error });
  } finally {
    await closeClient();
  }
};

// Add this new function to your backend controller file
// This will allow fetching ALL research areas without requiring a search parameter

export const getAllResearchAreas = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("Teachings");
    const researchareaCollection = database.collection("researcharea");
    
    // Fetch all research areas, sorted by newest first
    const DataForResearchAreaCollection = await researchareaCollection
      .find({})
      .sort({ _id: -1 })
      .toArray();
    
    res.status(200).json({ DataForResearchAreaCollection: DataForResearchAreaCollection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

 

// This is for creation in Gallery By Admin which have collections are gallery.
// getSelected Memory

export const getSelectedGallery = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('Highlights');
    const galleryCollection = database.collection('gallery');

    const photoCaption = req.query.photo_caption || "";
    console.log(photoCaption);

    const query = {};

    if (photoCaption) {
      query.photo_caption = { $regex: new RegExp(photoCaption, "i") };
    }

    const projection = { _id: 1, photo_caption: 1, urlToImage: 1 };

    const memories = await galleryCollection
      .find(query, { projection })
      .sort({ _id: -1 })
      .toArray();

    if (memories.length === 0) {
      return res.status(404).json({ message: "No memories found" });
    }

    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Create Memory
export const createMemory = async (req, res) => {
  try {
    await connectClient();
    const GalleryData = new memories (req.body);
    const database = User.db('Highlights');
    const galleryCollection = database.collection('gallery');
    const result = await galleryCollection.insertOne(GalleryData);
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update Memory
export const updateMemory = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const memoryId = new ObjectId(id);
    const updateFields = req.body;

    const database = User.db('Highlights');
    const galleryCollection = database.collection('gallery');

    const result = await galleryCollection.findOneAndUpdate(
      { _id: memoryId },
      { $set: updateFields },
      { returnDocument: "after", returnNewDocument: true }
    );

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Memory
export const deleteMemory = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const memoryId = new ObjectId(id);

    const database = User.db('Highlights');
    const galleryCollection = database.collection('gallery');

    const result = await galleryCollection.findOneAndDelete({ _id: memoryId },
      { returnDocument: "after" }
    );

    res.status(200).send({ message: 'Memory deleted successfully', data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};


// This is for creation in Activities By Admin which have collections are Activities.
// Create Activity
export const createActivity = async (req, res) => {
  try {
    await connectClient();
    const newActivities = new activity (req.body);
    const savedActivity = await newActivities.save();
    const database = User.db('Teachings');
    const activitiesCollection = database.collection('activities');

    const result = await activitiesCollection.insertOne(savedActivity);
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update Activity
export const updateActivity = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const updateFields = req.body;

    const database = User.db('Teachings');
    const activitiesCollection = database.collection('activities');

    const result = await activitiesCollection.findOneAndUpdate(
      { _id: new ObjectId(id)},
      { $set: updateFields },
      { returnDocument: "after", returnNewDocument: true }
    );
    
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Activity
export const deleteActivity = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const database = User.db('Teachings');
    const activitiesCollection = database.collection('activities');
    const result = await activitiesCollection.findOneAndDelete({_id: new ObjectId(id)},
    { returnDocument: "after" });

    res.status(200).send({ message: "Activity deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Get Selected Activity
export const getSelectedActivity = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('Teachings');
    const activitiesCollection = database.collection('activities');
    const activityName = req.query.activity_name || "";

    const query = {};
    if (activityName) {
      query.activity_name = { $regex: new RegExp(activityName, "i") };
    }
    const projection = { _id: 1, activity_name: 1, details: 1 };
    const activities = await activitiesCollection.find(query, projection).sort({ _id: -1 }).toArray();

    if (activities.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};


// This is for creation in Current Students By Admin which have collections are Current Students.
// getCurrentStudents

export const getCurrentStudents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("People");
    const studentsCollection = database.collection("students");

    const studentName = req.query.name || "";

    const query = {};

    if (studentName) {
      query.name = { $regex: studentName, $options: "i" };
    }

    const projection = {
      _id: 1,
      name: 1,
      enrolledCourse: 1,
      domain: 1,
      subtitle: 1,
      graduatingYear: 1,
      areaOfInterest: 1,
      urlToImage: 1,
      overview: 1,
      researches: 1,
      thesis_title: 1,
      publications: 1,
      contactInformation: 1
    };

    const students = await studentsCollection
      .find(query, { projection })
      .sort({ _id: -1 }) 
      .toArray();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found with this name" });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Create Student
export const createStudent = async (req, res) => {
  try {
    await connectClient();
    const studentData = new student(req.body);
    const savedStudent = await studentData.save();
    const database = User.db("People");
    const studentsCollection = database.collection("students");
    const data = await studentsCollection.insertOne(savedStudent);
    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const studentId = new ObjectId(id);

    const updateFields = req.body;
    const { enrolledCourse, domain, graduatingYear, thesis_title, publications, contactInformation } = updateFields;

    const updateData = {
      name: updateFields.name,
      enrolledCourse,
      subtitle: updateFields.subtitle || null,
      areaOfInterest: updateFields.areaOfInterest,
      urlToImage: updateFields.urlToImage,
      overview: updateFields.overview,
      researches: updateFields.researches,
      contactInformation: {
        email: contactInformation.email || "Not Provided",
        googleScholarLink: contactInformation.googleScholarLink || "Not Provided",
        orcidLink: contactInformation.orcidLink || "Not Provided",
        linkedIn: contactInformation.linkedIn || "Not Provided",
        clickForMore: contactInformation.clickForMore || "Not Provided",
        researchGateId: contactInformation.researchGateId || "Not Provided"
      }
    };

    if (enrolledCourse === 'PhD') {
      updateData.publications = publications;
      updateData.domain = undefined;
      updateData.graduatingYear = undefined;
      updateData.thesis_title = undefined;
    } else if (enrolledCourse === 'M.Tech') {
      updateData.domain = domain;
      updateData.graduatingYear = graduatingYear;
      updateData.thesis_title = thesis_title;
      updateData.publications = undefined;
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const database = User.db("People");
    const studentsCollection = database.collection("students");

    const result = await studentsCollection.findOneAndUpdate(
      { _id: studentId },
      { $set: updateData },
      { returnDocument: "after", returnNewDocument: true }
    );

    res.status(200).send({ updateData: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const studentId = new ObjectId(id);

    const database = User.db("People");
    const studentsCollection = database.collection("students");

    const result = await studentsCollection.findOneAndDelete(
      { _id: studentId },
      { returnDocument: "after" }
    );

    res.status(200).send({ message: 'Student deleted successfully', data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};



// This is for creation in Graduate Students By Admin which have collections are graduate Students.
// getGraduatedStudents

export const getGraduatedStudents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db("People");
    const studentsCollection = database.collection("graduated");

    const enrolledIn = req.query.enrolledIn || "";

    const query = {};

    if (enrolledIn) {
      query.enrolledIn = { $regex: new RegExp(enrolledIn, "i") };
    }

    const projection = { _id: 1, name: 1, enrolledIn: 1, graduating_year: 1, thesis_title: 1, no_of_journal_papers: 1, no_of_conference_papers: 1, current_working_status: 1, place_of_work: 1, branch: 1, university_name: 1, degree: 1, internship_domain: 1, duration: 1 };

    const students = await studentsCollection
      .find(query, { projection })
      .sort({ _id: -1 }) 
      .toArray();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Create Student
export const createNewStudent = async (req, res) => {
  try {
    await connectClient();
    const studentData = new graduateStudent(req.body);
    const savedStudent = await studentData.save();

    const database = User.db("People");
    const studentsCollection = database.collection("graduated");
    const data = await studentsCollection.insertOne(savedStudent);

    res.status(200).send({ data: data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update Student
export const updateNewStudent = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const studentId = new ObjectId(id);
    const updateFields = req.body;

    const validFields = {
      "PhD Scholar": ["name", "enrolledIn", "graduating_year", "thesis_title", "no_of_journal_papers", "no_of_conference_papers", "current_working_status", "place_of_work"],
      "M.Tech": ["name", "enrolledIn", "graduating_year", "branch", "thesis_title", "current_working_status"],
      "B.Tech": ["name", "enrolledIn", "graduating_year", "branch", "thesis_title", "current_working_status"],
      "Intern": ["name", "enrolledIn", "graduating_year", "university_name", "degree", "branch", "internship_domain", "duration"]
    };

    const allowedFields = validFields[updateFields.enrolledIn] || [];
    const filteredUpdate = Object.keys(updateFields)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateFields[key];
        return obj;
      }, {});

    const database = User.db("People");
    const studentsCollection = database.collection("graduated");
    const result = await studentsCollection.findOneAndUpdate(
      { _id: studentId },
      { $set: filteredUpdate },
      { returnDocument: "after", returnNewDocument: true }
    );

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Student
export const deleteNewStudent = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const studentId = new ObjectId(id);

    const database = User.db("People");
    const studentsCollection = database.collection("graduated");
    const result = await studentsCollection.findOneAndDelete(
      { _id: studentId },
      { returnDocument: "after" }
    );

    res.status(200).send({ message: 'Student deleted successfully', data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};








// This is for creation in Achievements By Admin which have collections are Achievements.

// Create Achievement
export const createAchievement = async (req, res) => {
  try {
    await connectClient();
    const newAchievement = new achievement(req.body);
    const savedAchievement = await newAchievement.save();
    const database = User.db('People');
    const achievementsCollection = database.collection('achievements');

    const result = await achievementsCollection.insertOne(savedAchievement);
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Update Achievement
export const updateAchievement = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const updateFields = req.body;

    // Ensure updateFields has the required structure and types
    const updateData = {
      ...updateFields,
      achievement: {
        ...updateFields.achievement,
        date: new Date(updateFields.achievement.date) // Ensure date is in correct format
      }
    };

    const database = User.db('People');
    const achievementsCollection = database.collection('achievements');

    const result = await achievementsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after", returnNewDocument: true }
    );

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Delete Achievement
export const deleteAchievement = async (req, res) => {
  try {
    await connectClient();
    const { id } = req.params;
    const database = User.db('People');
    const achievementsCollection = database.collection('achievements');
    const result = await achievementsCollection.findOneAndDelete(
      { _id: new ObjectId(id) },
      { returnDocument: "after" }
    );

    res.status(200).send({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Get Selected Achievements
export const getSelectedAchievement = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('People');
    const achievementsCollection = database.collection('achievements');
    const title = req.query.title || "";

    const query = {};
    if (title) {
      query['achievement.title'] = { $regex: new RegExp(title, "i") };
    }

    const projection = { _id: 1, name: 1, department: 1, achievement: 1 };
    const achievements = await achievementsCollection.find(query, { projection }).sort({ _id: -1 }).toArray();

    if (achievements.length === 0) {
      return res.status(404).json({ message: "No achievements found" });
    }
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// This is for creation in Achievements By Admin which have collections are Achievements.
// Create AwardsAndTalks
export const createAwardsAndTalks = async (req, res) => {
  try {
      await connectClient();
      const newAwardsAndTalks = new awardsandtalks (req.body);
      const savedFields = await newAwardsAndTalks.save();
      
      const database = User.db('Teachings'); 
      const awardsAndTalksCollection = database.collection('awardsandtalks');
      const result = await awardsAndTalksCollection.insertOne(savedFields);

      res.status(200).send({ data: result });
  } catch (error) {
      res.status(500).send({ message: error.message });
  } finally {
      await closeClient();
  }
};

// Update AwardsAndTalks
export const updateAwardsAndTalks = async (req, res) => {
  try {
      await connectClient();
      const { id } = req.params;
      const updateFields = req.body;

      const database = User.db('Teachings'); 
      const awardsAndTalksCollection = database.collection('awardsandtalks');

      const result = await awardsAndTalksCollection.findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: updateFields },
          { returnDocument: "after", returnNewDocument: true }
      );

      res.status(200).send({ data: result });
  } catch (error) {
      res.status(500).send({ message: error.message });
  } finally {
      await closeClient();
  }
};

// Delete AwardsAndTalks
export const deleteAwardsAndTalks = async (req, res) => {
  try {
      await connectClient();
      const { id } = req.params;

      const database = User.db('Teachings'); 
      const awardsAndTalksCollection = database.collection('awardsandtalks');

      const result = await awardsAndTalksCollection.findOneAndDelete(
          { _id: new ObjectId(id) },
          { returnDocument: "after" }
      );

      res.status(200).send({ message: "AwardsAndTalks deleted successfully" });
  } catch (error) {
      res.status(500).send({ message: error.message });
  } finally {
      await closeClient();
  }
};

// Get Selected AwardsAndTalks
export const getSelectedAwardsAndTalks = async (req, res) => {
  try {
      await connectClient();

      const database = User.db('Teachings'); 
      const awardsAndTalksCollection = database.collection('awardsandtalks');
      const field = req.query.field || "";

      const query = {};
      if (field) {
          query.field = { $regex: new RegExp(field, "i") };
      }

      const projection = { _id: 1, field: 1, additionalInfo: 1 };
      const awardsAndTalks = await awardsAndTalksCollection.find(query).project(projection).sort({ _id: -1 }).toArray();

      if (awardsAndTalks.length === 0) {
          return res.status(404).json({ message: "No awards and talks found" });
      }

      res.status(200).json(awardsAndTalks);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};




