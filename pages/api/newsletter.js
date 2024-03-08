import { MongoClient } from 'mongodb';

async function handler(req, res) {
    //if the operation is POST
    if (req.method === 'POST') {
        const userEmail = req.body.email; 

        if (!userEmail || !userEmail.includes('@')) {
            res.status(422).json({messge: 'Invalid email address.'});
            return;    
        }
        // Connect to mongodb database. Database password: TsQcfOKPty2q4KgZ
        const client = await MongoClient.connect(
            'mongodb+srv://haziq:TsQcfOKPty2q4KgZ@cluster0.vwkwzqm.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0'
        );
        // get concrete of the db we connected
        const db = client.db();

        // get access to collection
        await db.collection('newsletter')
        //  run our queries for example insertOne for adding new entries (called doc in mongodb). [need to be JSON]
        .insertOne({email: userEmail});

        client.close(); //close client 

        res.status(201).json({message: 'Signed up!'});
    } 
}

export default handler;