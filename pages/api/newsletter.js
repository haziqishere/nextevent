import { MongoClient } from 'mongodb';

async function connectDatabase() {
        // Connect to mongodb database. Database password: TsQcfOKPty2q4KgZ
        const client = await MongoClient.connect(
            'mongodb+srv://haziq:TsQcfOKPty2q4KgZ@cluster0.vwkwzqm.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0'
        );
        return client;
}

async function insertDocument(client, document) {
        // create a concrete of db
        const db = client.db();
        // get access to collection
        await db.collection('newsletter')
        //  run our queries for example insertOne for adding new entries (called doc in mongodb). [need to be JSON]
        .insertOne(document);
}

async function handler(req, res) {
    //if the operation is POST
    if (req.method === 'POST') {
        const userEmail = req.body.email; 

        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({messge: 'Invalid email address.'});
            return;    
        }

        let client; // initialize client var so inserDocument can be parse even if error occur

        try {
            // connect to mongodb
            client = await connectDatabase();
        } catch(error) {
            res.status(500).json({message: 'Connecting o the database failed'});
            return;
        }
        
        try {
            await insertDocument(client, { email: userEmail });
            client.close(); //close client 
        } catch (error) {
            res.status(500).json({message: 'Inserting data failed'});
            return;
        }
        res.status(201).json({ message: 'Signed up!' });
    } 
}

export default handler;