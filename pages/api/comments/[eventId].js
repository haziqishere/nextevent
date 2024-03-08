import { MongoClient } from 'mongodb';

async function handler(req, res){
    const eventId = req.query.eventId;

    // Connect to mongodb
    const client = await MongoClient.connect(
        'mongodb+srv://haziq:TsQcfOKPty2q4KgZ@cluster0.vwkwzqm.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0'
    );

    // if request method is POST
    if (req.method === 'POST') {
        const { email, name, text } = req.body;

        // add server-side validation
        if (
            !email.includes('@') || 
            !name || 
            name.trim()=== '' || 
            !text || 
            text.trim() === ''
        ) {
            res.status(422).json({message: 'invalid input.'});  
            return;
        }

        // console log data
        console.log(email, name, text);
        const newComment = {
            email,
            name,
            text,
            eventId
        };

        // get concrete of the db we connected
        const db = client.db();

        // insert comment into mongodb under collection named 'comments'
        const result = await db.collection('comments').insertOne(newComment);

        console.log(result);

        newComment.id = result.insertedId; // [Opt] newComment obj that has been entered in db. To make life easier, we put the insertedId by mongoDB into one of the properties of the comment obj

        res.status(201).json({message: 'Comment added', comment: newComment})

    } 
    
    // if request method is GET
    else if (req.method === 'GET') {

        //create concrete of client
        const db = client.db();

        // find method ofcourse to narrow searches. But if we write only 'find()' it will display all
        // sort to simplify search. sort according to id by using "_id" in descending order
        // toArray simplify but giving all the entries in Array. Originally we only got a cursor
        const documents = await db.collection('comments').find().sort({ _id: -1}).toArray();

        res.status(200).json({ comments: documents });
    }
    client.close();
}

export default handler;