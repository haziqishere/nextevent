import { connectDatabase, insertDocument, getAllDocuments } from '../../../helpers/db-util';

async function handler(req, res){
    const eventId = req.query.eventId;

    let client;

    try {
     // Connect to mongodb
     client = await connectDatabase();

    } catch (error) {
        res.status(500).json({ message: 'Connecting to the database failed!' });
        return;
    }


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
            client.close();
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

        let result;

        try {
            result = await insertDocument(client, 'comments', newComment);
            newComment._id = result.insertedId; // [Opt] newComment obj that has been entered in db. To make life easier, we put the insertedId by mongoDB into one of the properties of the comment obj

            res.status(201).json({message: 'Comment added', comment: newComment})

        } catch (error) {
            res.status(500).json({ message: 'Failed to insert comment '});
        }
    } 
    
    // if request method is GET
    else if (req.method === 'GET') {

        try {

            const documents = await getAllDocuments(client, 'comments', { _id: -1 });
            res.status(200).json({ comments: documents });
        } catch (error) {
            res.status(500).json({ message: 'Getting comments failed. '});
        }
    }
    client.close();
}

export default handler;