import message from "../model/message.js";
import Session from "../model/sessions.js";
export async function getAllMessages(req, res) {
  await message.find({})

    .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export async function addOnceMessage(req,res) {
   console.log(req.body)
    const {
      recipient,
      sender,
      content,
     
  } = req.body;
    // Invoquer la méthode create directement sur le modèle
    try {
      const newMessage = await message.create({
        recipient: recipient,
        sender: sender,
        content: content,
      });
      res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
export async function fetchconversations (req,res){
  const userId = req.body.userId;
  var lastmessages =[]
    try {
        // Aggregate query to fetch the latest message for each user
        const latestMessages = await message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: [{ $eq: ['$sender', userId] }, '$recipient', '$sender']
                    },
                    lastMessage: { $first: '$$ROOT' },
                    timestamp: { $first: '$timestamp' }
                }
            }
        ]);
        latestMessages.forEach((result) => {
         lastmessages.push(result.lastMessage)      
        });
        res.json(lastmessages); // Sending the latest messages as JSON response
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
   
}
export async function getOnceMessage(req, res) {
    await message
    .findOne({ "content": req.params.content })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


export async function deleteOnceMessage(req, res) {
    await message
    .findOneAndDelete({ "content": req.params.content })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

// Create a new session
export async function getAllSessions2(req, res) {
    await Session.find({})
  
      .then(docs => {
          res.json(docs);
      })
      .catch(err => {
          res.status(500).json({ error: err });
      });
  }


// Update a session
export async function Updatesessions2(req, res) {
  try {
    const { Id, clientID, coachID,  sessiondate,Transfered } = req.body;
    const session = await Session.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    session.sessionId = Id;
    session.clientID = clientID;
    session.coachID = coachID;
    session.sessiondate = sessiondate;
    session.Transfered = Transfered;
    await session.save();
    res.status(200).json({ message: 'Session updated successfully', session });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getMessagesBySenderAndRecipient(req, res) {
    const senderId = req.params.senderId;
  const recipientId = req.params.recipientId;
       
        await message.find({
          $or: [
            { sender: senderId, recipient: recipientId },
            { sender: recipientId, recipient: senderId }
          ]
        })
    
       
      .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    }); 
}
