import  express from "express";
import bodyParser from 'body-parser';
import 'dotenv/config';
import stringFunction from '../../../../config/db/index.js';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import Journal from "../../../../model/Paper/Journals/Journals.js";
import Project from "../../../../model/Teachings/projects/index.js";
import Conference from "../../../../model/Paper/Conference/Conference.js";


export const HelloWorld = (async(req,res)=>{
    try {
          res.status(200).send({data:"Hello World"});
    } catch (error) {
        res.status(500).send({'message':error})
    }
})



