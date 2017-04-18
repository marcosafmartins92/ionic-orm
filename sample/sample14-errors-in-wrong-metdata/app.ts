import "reflect-metadata";
import {ConnectionOptions, createConnection} from "../../src/index";
import {Post} from "./entity/Post";
import {PostAuthor} from "./entity/PostAuthor";

const options: ConnectionOptions = {
    driver: {
        type: "sqlite",
        storage: "temp/sqlitedb.db"
    },
    autoSchemaSync: true,
    entities: [Post, PostAuthor]
};

createConnection(options).then(connection => {

    let author = new PostAuthor();
    author.name = "Umed";
    
    let post = new Post();
    post.text = "Hello how are you?";
    post.title = "hello";
    post.author = author;

    let postRepository = connection.getRepository(Post);

    postRepository
        .persist(post)
        .then(post => console.log("Post has been saved"))
        .catch(error => console.log("Cannot save. Error: ", error));

}, error => console.log("Cannot connect: ", error));
