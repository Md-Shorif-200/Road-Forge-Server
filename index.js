const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



// middleware
app.use(express.json());
app.use(cors());


// !Mongodb Database 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.56yvv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // !mongodb collections 
    const userCollection = client.db('roadForge-db').collection('users');
    const roadmapCollection = client.db('roadForge-db').collection('roadmap-item');
    const commentCollections = client.db('roadForge-db').collection('comments')


    // *** user related api

    app.post('/api/users',async(req,res) => {
        const newUser = req.body;
        const email = newUser.email;

        // varify user
        if(!email){
            return res.status(400).send({meassage : 'Email Is Required'})
        }

        // if User is already exist
        const existingUser = await userCollection.findOne({email});

        if(existingUser){
            return res.status(200).send({meassage : 'User Already Exist in database'})
        }

        const result = await userCollection.insertOne(newUser);
     res.send(result)
    })


    app.get('/api/users',async(req,res) => {
          const result = await userCollection.find().toArray();
          res.send(result)
    })

    
    // **** roadmap-Item Related Api
    app.get('/roadmap-item',async(req,res) => {
        const {filter,sort} = req.query;
        const filterQuery = {};
        let sortQuery = {}

        // check filter value
        if(filter && filter !== 'allItem'){
           filterQuery.status = filter
        }


        // sorting system
        if(sort === 'upvote'){        
          sortQuery = {upvotes : -1}
        }


      const result = await roadmapCollection.find(filterQuery).sort(sortQuery).toArray()
      res.send(result)
    })
        // update data
    app.patch('/roadmap-item/upvote/:id',async(req,res) => {
         const data = req.body;
         const id = req.params.id;
         const email = data.userEmail;
         const query = {_id : new ObjectId(id)}
            // if email not find
         if(!email || !id){
          return res.status(400).send({message : 'invlid reqest . please log in and try agian!'})
         }

        
        
        //  cheack if user already upvoted
        const roadmapItem = await roadmapCollection.findOne(query)
        if(roadmapItem.upvotedBy.includes(email)){
             return res.status(400).send({message : 'you have already upvoted'})
        }

        // increment upvoted cound and push user email 
              const result = await roadmapCollection.updateOne(
                query,
                {
                  $inc : {upvotes : 1},
                  $push : {upvotedBy : email},
                }
              );

              res.send(result)
          
    })


    // *** comments related api

    app.post('/api/comments',async(req,res) => {
        const data = req.body;
        //  console.log(data);
         
         try {
          //  ****  check data is reply message
           if(data.replyId){
                const query = {_id : new ObjectId(data.replyId)};
                const id =  `${Date.now()}`
                // creat reply object
                const reply = {
                   id : id,
                   name : data.name,
                   email : data.email,
                   photo : data.photo,
                   replyMessage : data.replyMessage,
                   time : data.time
                }

                const updatedDoc = {
                    $push : {replies : reply}
                }
                      // push reply data to comment collection
                const result = await  commentCollections.updateOne(
                        query,updatedDoc
                )

                res.send(result)
         }
         else if(data.nestedReplyId){
                        // console.log(data.commentId,data.nestedReplyId);
                        
                             //**** check data is nested-reply
                     const query = {_id : new ObjectId(data?.commentId)}
                     // find main comment
                     const  comment = await commentCollections.findOne(query)
                       console.log('comment data ' , comment);
                        
                    // find nested-reply object 
                    const  nestedReply = comment?.replies?.find(replyData => replyData?.id == data?.nestedReplyId) 
                    console.log( 'nested reply' , nestedReply);
                     

                    // check nested-replies array is Exist
                     if(!nestedReply.nestedReplies){
                       nestedReply.nestedReplies = []
                     }

                    
                     // creat nested reply object 
                     const id = `nested_reply_${Date.now()}`;
                    const reply = {
                      id : id,
                      name : data.name,
                     email : data.email,
                     photo : data.photo,
                     message : data.message,
                     time : data.time
                    }

                    // push object to nestedReplies
                    nestedReply.nestedReplies.push(reply)

                    const updatedDoc = {
                      $set : {replies : comment.replies}
                    }

                    // push nested reply data to comment collection
                    const result = await commentCollections.updateOne(
                      query,updatedDoc
                    )

                    res.send(result)

         }
         
         else{
           const result = await commentCollections.insertOne(data);
            res.send(result)
           
         }
        } catch (error) {
             return res.status(404).send({message : 'something is wrong'})
        }
        

    })

        // find all comments
       app.get('/api/comments',async(req,res) => {
        const result = await commentCollections.find().toArray()
        res.send(result)
    })


    // edit comments
    app.patch('/api/comments/edit/:id', async(req,res) => {
       const data = req.body;
       const id = req.params.id;
       const query = {_id : new ObjectId(id)};

       const updatedDoc = {
          $set : {
              comment : data.updatedComment
          }
       }

       const result = await commentCollections.updateOne(query,updatedDoc);
       res.send(result)
       

    })

    // delete comments 
    app.delete('/api/comments/delete/:id', async(req,res) => {
         const id = req.params.id;
         const query = {_id : new ObjectId(id)};
         const result = await commentCollections.deleteOne(query);
         res.send(result)
    })

    // replay related api

  






















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/',async(req,res) => {
     res.send('road-forge server is running')
})

app.listen(port,() => {
     console.log('road-forge server is running on port',port);
     
})