import "reflect-metadata";
import {ConnectionOptions, createConnection} from "../../src/index";
import {Post} from "./entity/Post";
import {Author} from "./entity/Author";
import {MigrationExecutor} from "../../src/migration/MigrationExecutor";
import {PostRepository} from "./repository/PostRepository";
import {AuthorRepository} from "./repository/AuthorRepository";

const options: ConnectionOptions = {
    driver: {
        type: "sqlite",
        storage: "temp/sqlitedb.db"
    },
    autoSchemaSync: true,
    logging: {
        logQueries: true,
    },
    entities: [Post, Author],
};

createConnection(options).then(async connection => {

    const post = connection
        .getCustomRepository(PostRepository)
        .create();

    post.title = "Hello Repositories!";

    await connection
        .entityManager
        .getCustomRepository(PostRepository)
        .persist(post);

    const loadedPost = await connection
        .entityManager
        .getCustomRepository(PostRepository)
        .findMyPost();

    console.log("Post persisted! Loaded post: ", loadedPost);

    const author = await connection
        .getCustomRepository(AuthorRepository)
        .createAndSave("Umed", "Khudoiberdiev");

    const loadedAuthor = await connection
        .getCustomRepository(AuthorRepository)
        .findMyAuthor();

    console.log("Author persisted! Loaded author: ", loadedAuthor);

}).catch(error => console.log("Error: ", error));
