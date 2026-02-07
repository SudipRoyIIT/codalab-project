import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import { connect, url } from "../../../config/db/index.js";
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { stringify } from 'flatted'; // Use flatted to handle circular JSON structures
import Patents from '../../../model/Paper/Patents/Patents.js';

const app = express();
app.use(bodyParser.json());


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

export const getPublication = async (req, res) => {
  try {
    await connectClient(); // Connect to MongoDB

    const database = User.db("Paper"); // Assuming User is your MongoDB client and "Paper" is your database

    // Define collections and their corresponding names
    const collections = [
      { name: "Journals", variableName: "arrayOfJournals" },
      { name: "Conference", variableName: "arrayOfConference" },
      { name: "Workshops", variableName: "arrayOfWorkshops" }
  ];

    // Fetch data for each collection and sort by year
    const results = {};

    // Fetch patent data
    const patentData = database.collection("Patents");

    // Fetch granted patents
    const grantedPatents = await patentData.find({ status: "Granted" }).sort({ date: -1 }).toArray();
    results["arrayOfGrantedPatents"] = grantedPatents;

    // Fetch filed patents
    const filedPatents = await patentData.find({ status: "Filed" }).sort({ date: -1 }).toArray();
    results["arrayOfFiledPatents"] = filedPatents;

    // Fetch data for each collection and sort by year
    for (const collection of collections) {
      const col = database.collection(collection.name);
      results[collection.variableName] = await col.find({
        $or: [
          { publishedOn: { $gte: new Date("2015") } }, // Example filter for publishedOn field
          { date: { $gte: new Date("2015") } },
          {year:{$gte:2015}},
          {publishingDate:{$gte:new Date(2015)}} // Example filter for date field
          // Add more filters as per your schema
        ]
      }).sort({ year: -1 }).toArray();
    }

    // Respond with all arrays in a single object
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient(); // Close MongoDB connection
  }
}; 





export const getAllStudents = async (req, res) => {
  const pipeline = [
    {
        $group: {
            _id: "$enrolledCourse",
            students: {
                $push: {
                    studentId: "$_id",
                    name: "$name",
                    subtitle: "$subtitle",
                    domain: "$domain",
                    graduatingYear: "$graduatingYear",
                    areaOfInterest: "$areaOfInterest",
                    urlToImage: "$urlToImage",
                    overview: "$overview",
                    researches: "$researches",
                    publications: "$publications",
                    thesis_title: "$thesis_title",
                    contactInformation: {
                        email: "$contactInformation.email",
                        googleScholarLink: "$contactInformation.googleScholarLink",
                        orcidLink: "$contactInformation.orcidLink",
                        linkedIn: "$contactInformation.linkedIn",
                        clickForMore: "$contactInformation.clickForMore",
                        researchGateId: "$contactInformation.researchGateId"
                    }
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            enrolledCourse: "$_id",
            students: 1
        }
    }
];


  try {
    await connectClient();
    const database = User.db('People');
    const studentsCollection = database.collection('students');

    const students = await studentsCollection.aggregate(pipeline).toArray();
    const result = students.reduce((acc, { enrolledCourse, students }) => {
      acc[enrolledCourse] = students;
      return acc;
    }, {});

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  finally {
    await closeClient();
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid student ID" });
  }

  const pipeline = [
    { $match: { _id: new ObjectId(id) } },
    {
      $project: {
        _id: 0,
        studentId: "$_id",
        name: 1,
        subtitle: 1,
        domain: 1,
        graduatingYear: 1,
        areaOfInterest: 1,
        urlToImage: 1,
        overview: 1,
        researches: 1,
        publications: 1,
        thesis_title: 1,
        contactInformation: {
          email: 1,
          googleScholarLink: 1,
          orcidLink: 1,
          linkedIn: 1,
          clickForMore: 1,
          researchGateId: 1
        }
      }
    }
  ];

  try {
    await connectClient();
    const database = User.db('People');
    const studentsCollection = database.collection('students');

    const student = await studentsCollection.aggregate(pipeline).toArray();

    if (student.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await closeClient();
  }
};

// Events
export const getEvents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('Highlights');
    const eventCollection = database.collection('events');
    const Events = await eventCollection.find().sort({ date: -1 }).toArray();
    res.status(200).json(Events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  finally {
    await closeClient();
  }
};


//News 

export const getAllNews = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('Highlights');
    const newsCollection = database.collection('news');
    const News = await newsCollection.find().sort({ createdAt: -1 }).toArray(); // Newest first
    res.status(200).json(News);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  finally {
    await closeClient();
  }
};


// New Students
export const getNewStudents = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('People');
    const graduateCollection = database.collection('graduated');
    const students = await graduateCollection.find({}).toArray();
    const groupedData = {
      "PhD Scholar": [],
      "M.Tech": [],
      "B.Tech": [],
      "Intern": []
    };

    students.forEach(student => {
      if (groupedData[student.enrolledIn]) {
        groupedData[student.enrolledIn].push({
          id: student._id,
          name: student.name,
          enrolledIn: student.enrolledIn,
          graduating_year: student.graduating_year,
          thesis_title: student.thesis_title,
          no_of_journal_papers: student.no_of_journal_papers,
          no_of_conference_papers: student.no_of_conference_papers,
          current_working_status: student.current_working_status,
          place_of_work: student.place_of_work,
          university_name: student.university_name,
          degree: student.degree,
          branch: student.branch,
          internship_domain: student.internship_domain,
          duration: student.duration,
          additionalInfo: student.additionalInfo
        });
      }
    });

    Object.keys(groupedData).forEach(key => {
      groupedData[key].sort((a, b) => new Date(b.graduating_year) - new Date(a.graduating_year));
    });

    res.status(200).json(Object.entries(groupedData).map(([key, value]) => ({ [key]: value })));
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
  finally {
    await closeClient();
  }
};

// Gallery

export const getAllMemories = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('Highlights');
      const galleryCollection = database.collection('gallery');

      const memories = await galleryCollection.find().sort({ _id: -1 }).toArray();

      res.status(200).json(memories);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};

// Achievements

export const getAllAchievements = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('People');
      const achievementsCollection = database.collection('achievements');

      const result = await achievementsCollection.find().sort({ 'achievement.date': -1 }).toArray();

      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};

// ResearchArea

export const getResearchArea = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('Teachings');
      const researchAreaCollection = database.collection('researcharea');

      const result = await researchAreaCollection.find().sort({ _id: -1 }).toArray();

      res.status(200).json(result);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};
// Export app for further use