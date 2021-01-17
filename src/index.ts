import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import express, { Request, Response } from 'express';
import { Post } from "./entity/Post";
import { validate } from "class-validator";

const app = express();

app.use(express.json())


//CREATE
app.post('/users', async (req: Request, res: Response) => {

    const { name, email, role } = req.body;

    try {
        const user = User.create({ name, email, role })
        const errors = await validate(user);

        if (errors.length > 0) {
            throw errors
        } else {
            await user.save();
            return res.status(201).json(user)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})
//READ
app.get('/users', async (req: Request, res: Response) => {

    try {
        const users = await User.find({relations:['posts']})

        return res.status(200).json(users)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
})
//UPDATE

app.put('/users/:uuid', async (req: Request, res: Response) => {
    const uuid = req.params.uuid;
    const { name, email, role } = req.body;

    try {
        const user = await User.findOneOrFail({ uuid })

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save()

        return res.status(201).json(user);
    } catch (err) {
        console.log(err)
    }

})
//DELETE

app.delete('/users/:uuid', async (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    try {
        const user = await User.findOneOrFail({ uuid })

        await user.remove()

        return res.status(204).json({ message: "User has been removed" });
    } catch (err) {
        console.log(err)
    }

})
//FIND
app.get('/users/:uuid', async (req: Request, res: Response) => {
    const uuid = req.params.uuid;

    try {
        const user = await User.findOneOrFail({ uuid })
        return res.json(user);
    } catch (err) {
        console.log(err)
    }

})

// Create a Post
app.post('/posts',async (req:Request,res:Response) => {
    const { userUuid, title, body } = req.body;

    try {
        const user = await User.findOneOrFail({uuid:userUuid})

        const post = new Post({title,body,user});
        const errors = await validate(post);
        if (errors.length > 0) {
            throw errors;
        } else {
            await post.save();
            return res.json(user)
        }
    } catch(err) {
        console.log(err);
        return res.status(500).json({error:"Something went wrong"})
    }
})
// Read all Posts
app.get('/posts',async (req:Request,res:Response) => {

    try {
        const post = await Post.find({
            relations:['user']
        }) 


        return res.json(post);
    } catch(err) {
        console.log(err);
        return res.status(500).json({error:"Something went wrong"})
    }
})

createConnection().then(async () => {

    app.listen(5000, () => console.log('Server up at http://localhost:5000'))

}).catch(error => console.log(error));
