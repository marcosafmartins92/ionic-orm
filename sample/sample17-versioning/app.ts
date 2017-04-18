import "reflect-metadata";
import {createConnection, ConnectionOptions} from "../../src/index";
import {Post} from "./entity/Post";

const options: ConnectionOptions = {
    driver: {
        type: "sqlite",
        storage: "temp/sqlitedb.db"
    },
    logging: {
        logOnlyFailedQueries: true,
        logFailedQueryError: true
    },
    autoSchemaSync: true,
    entities: [Post]
};

createConnection(options).then(connection => {

    let post = new Post();
    post.text = "Hello how are you?";
    post.title = "hello";

    let postRepository = connection.getRepository(Post);
    
    postRepository
        .persist(post)
        .then(post => {
            console.log(`Post has been saved: `, post);
            console.log(`Post's version is ${post.version}. Lets change post's text and update it:`);
            post.title = "updating title";
            return postRepository.persist(post);
            
        }).then(post => {
            console.log(`Post has been updated. Post's version is ${post.version}`);
        });

}, error => console.log("Cannot connect: ", error));
