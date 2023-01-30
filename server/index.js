const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DataBase_USER}:${process.env.DataBase_PASS}@cluster0.mordayw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('unauthorized access');
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded;
        next();
    })

}

async function run() {
    try {
        const usersCollection = client.db("trainee-web-instructor").collection("users");
        const billingsCollection = client.db("trainee-web-instructor").collection("billing");



        // JWT
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '24h' })
                return res.send({ accessToken: token });
            }
            res.status(403).send({ accessToken: '' })
        });

        //User post
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.post('/api/registration', async (req, res) => {
            const about = req.body;
            const result = await usersCollection.insertOne(about);
            res.send(result);
        })

        app.get('/api/login', async (req, res) => {
            const query = {}
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/api/add-billing', async (req, res) => {
            const bill = req.body;
            const result = await billingsCollection.insertOne(bill);
            res.send(result);
        })

        app.get('/api/billing-list', async (req, res) => {
            const search = req.query.search
            console.log(search);
            let query = {};
            if (search.length) {
                query = {
                    $text: { $search: search }
                }
            }
            const cursors = billingsCollection.find(query).sort({ date: -1 })
            const items = await cursors.toArray()
            const count = await billingsCollection.estimatedDocumentCount()
            res.send(items)
        })

        // app.get('/api/billing-list', async (req, res) =>{
        //     const search = req.query.search
        //     console.log(search);
        //     if(ips.includes(req.ips)){
        //         res.send({success: true, message: 'You already User'})
        //     }else{
        //         res.send({success: true})
        //         ips.push(req.ips)
        //     }
        // })

        // app.get('/api/billing-list/count', async (req, res) => {
        //     const query = {};
        //     const cursors = billingsCollection.find(query).sort({ date: -1 })
        //     const items = await cursors.toArray()
        //     const count = await billingsCollection.estimatedDocumentCount()
        //     res.send({ count, items })
        // })

        app.patch('/api/update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updatedDoc = {
                $set: {

                }
            }
        })

        app.delete('/api/delete-billing/:id', verifyJWT, async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await billingsCollection.deleteOne(query);
            res.send(result);
        })

    } finally {
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Marriage Media is Running')
})

app.listen(port, () => {
    console.log(`Marriage Media running on Server ${port}`);
})