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
        const dummyList = [
            { id: 'c1', name: 'Max', text: 'A first comment!' },
            { id: 'c2', name: 'Manuel', text: 'A second comment!' },
        ];

        res.status(200).json({ comments: dummyList });
    }
    client.close();
}

export default handler;