import bodyParser from 'body-parser';
import express from 'express';
import 'dotenv/config';
import { connect, url } from "../../../config/db/index.js";
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';


const app = express();
app.use(bodyParser.json());


const User = new MongoClient(url);

// mongoose
//   .connect(url)
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


// Export app for further use



export const getHelloWorld = (async(req,res)=>{
    try {
        res.status(200).send("Hello World From sir routes")
    } catch (error) {
        res.status(400).send({'message':error})
    }
})

//News 

export const getNews = async (req, res) => {
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


//Announcements

export const getAnnouncements = async (req, res) => {
  try {
    await connectClient();
    const database = User.db('Highlights');
    const announcementCollection = database.collection('announcements');
    const Announcements = await announcementCollection.find().sort({ date: -1 }).toArray();
    res.status(200).json(Announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  finally {
    await closeClient();
  }
};

//Teaching 

export const getAutumnSemester = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('Teachings');
      const autumnSemesterCollection = database.collection('autumnSemester');
      const data = await autumnSemesterCollection.find().sort({ year: -1 }).toArray();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};

export const getSpringSemester = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('Teachings');
      const springSemesterCollection = database.collection('springSemester');
      const data = await springSemesterCollection.find().sort({ year: -1 }).toArray();
      res.status(200).json(data);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};


  export const getPublicationsOfSudipRoy = async (req, res) => {
  try {
    await connectClient(); // Connect to MongoDB

    const database = User.db("Paper"); // Assuming User is your MongoDB client and "Paper" is your database

    // Define collections and their corresponding names
    const collections = [
      { name: "Journals", variableName: "arrayOfJournals" },
      { name: "Conference", variableName: "arrayOfConference" },
      { name: "Books", variableName: "arrayOfBooks" },
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
      results[collection.variableName] = await col.find().sort({ year: -1 }).toArray();
    }

    // Respond with all arrays in a single object
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient(); // Close MongoDB connection
  }
}; 


export const getProjects = async (req, res) => {
  try {
    await connectClient(); // Connect to MongoDB

    const database = User.db("Teachings"); 

  
    const results = {};

    // Fetch patent data
    const ProjectsData = database.collection("projects");

    // Fetch granted patents
    const OngoingProjects = await ProjectsData.find({ status: true }).sort({ start_date: -1 }).toArray();
    results["arrayOfOngoingProjects"] = OngoingProjects;

    // Fetch filed patents
    const FundedProjects = await ProjectsData.find({ status: false }).sort({  start_date: -1 }).toArray();
    results["arrayOfFundedProjects"] = FundedProjects;

 

    // Respond with all arrays in a single object
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: error.message });
  } finally {
    await closeClient(); // Close MongoDB connection
  }
}; 

 // Activities

 export const getAllActivity = async (req, res) => {
  try {
      await connectClient();
      const database = User.db('Teachings');
      const activityCollection = database.collection('activities');

      const pipeline = [
          {
              $sort: { _id: -1 } // Sort by _id in descending order
          },
          {
              $group: {
                  _id: "$activity_name",
                  activities: {
                      $push: {
                          details: "$details"
                      }
                  }
              }
          },
          {
              $project: {
                  _id: 0,
                  activity_name: "$_id",
                  activities: 1
              }
          }
      ];

      const activities = await activityCollection.aggregate(pipeline).toArray();

      const formattedActivities = activities.reduce((acc, curr) => {
          acc[curr.activity_name] = curr.activities;
          return acc;
      }, {});

      res.status(200).json(formattedActivities);
  } catch (error) {
      res.status(500).json({ message: error.message });
  } finally {
      await closeClient();
  }
};

// Honors And Rewards

export const getAllHonors = async (req, res) => {
try {
    await connectClient();
    const database = User.db('Teachings');
    const awardsCollection = database.collection('awardsandtalks');

    const pipeline = [
        {
            $sort: { _id: -1 } // Sort by _id in descending order
        },
        {
            $group: {
                _id: "$field",
                activities: {
                    $push: {
                        additionalInfo: "$additionalInfo"
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                field: "$_id",
                activities: 1
            }
        }
    ];

    const honors = await awardsCollection.aggregate(pipeline).toArray();

    const formattedHonors = honors.reduce((acc, curr) => {
        acc[curr.field] = curr.activities;
        return acc;
    }, {});

    res.status(200).json(formattedHonors);
} catch (error) {
    res.status(500).json({ message: error.message });
} finally {
    await closeClient();
}
};