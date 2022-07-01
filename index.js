const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware 

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uwy5t.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const dailyTaskCollection = client.db('dailyTask').collection('task');
        const completedTasksCollection = client.db('dailyTask').collection('completed');

        app.post('/task', async(req, res) =>{
            const newTask = req.body;
            const result = await dailyTaskCollection.insertOne(newTask);
            res.send(result);
        });

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = dailyTaskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        });
        //created completed task post api
        app.post('/completed', async(req, res) =>{
            const completed = req.body;
            const result = await completedTasksCollection.insertOne(completed);
            res.send(result);
        });
        //created completed task get api
        app.get('/completed', async (req, res) => {
            const query = {};
            const cursor = completedTasksCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
        });
        
        app.get('/task/:id' , async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const tasks = await dailyTaskCollection.findOne(query);
            res.send(tasks);
        });

        app.put('/task/:id', async(req, res) =>{
            const id = req.params.id;
            const updateTask = req.body;
            const filter = {_id: ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set: {task: updateTask.task}
            };
            const result = await dailyTaskCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        });
        

    }
    finally{

    }

}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Running to-do-app Server');
});


app.listen(port, () => {
    console.log('listening to port', port);
})

