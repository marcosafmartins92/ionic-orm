import "reflect-metadata";
import {createConnection, ConnectionOptions} from "../../src/index";
import {Post} from "./entity/Post";
import {CustomNamingStrategy} from "./naming-strategy/CustomNamingStrategy";

const options: ConnectionOptions = {
    driver: {
        type: "sqlite",
        storage: "temp/sqlitedb.db"
    },
    autoSchemaSync: true,
    usedNamingStrategy: "custom_strategy",
    entities: [Post],
    namingStrategies: [CustomNamingStrategy]
};

createConnection(options).then(connection => {

    let post = new Post();
    post.text = "Hello how are you?";
    post.title = "hello";

    let postRepository = connection.getRepository(Post);

    postRepository
        .persist(post)
        .then(post => console.log("Post has been saved"))
        .catch(error => console.log("Cannot save. Error: ", error));

}, error => console.log("Cannot connect: ", error));
