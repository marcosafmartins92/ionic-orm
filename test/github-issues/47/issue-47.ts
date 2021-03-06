import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {expect} from "chai";
import {Category} from "./entity/Category";

describe("github issues > #47 wrong sql syntax when loading lazy relation", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
        enabledDrivers: ["sqlite"] // we can properly test lazy-relations only on one platform
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should persist successfully and return persisted entity", () => Promise.all(connections.map(async connection => {

        // create objects to save
        const category1 = new Category();
        category1.name = "category #1";

        const post1 = new Post();
        post1.title = "Hello Post #1";
        post1.category = Promise.resolve(category1);

        const category2 = new Category();
        category2.name = "category #2";

        const post2 = new Post();
        post2.title = "Hello Post #2";
        post2.category = Promise.resolve(category2);

        // persist
        await connection.entityManager.persist(category1);
        await connection.entityManager.persist(post1);
        await connection.entityManager.persist(category2);
        await connection.entityManager.persist(post2);

        // check that all persisted objects exist
        const loadedPost = await connection.entityManager
            .createQueryBuilder(Post, "post")
            .getMany();

        const loadedCategory1 = await loadedPost[0].category;
        expect(loadedCategory1!).not.to.be.empty;
        loadedCategory1!.id.should.equal(1);
        loadedCategory1!.name.should.equal("category #1");

        const loadedCategory2 = await loadedPost[1].category;
        expect(loadedCategory2!).not.to.be.empty;
        loadedCategory2!.id.should.equal(2);
        loadedCategory2!.name.should.equal("category #2");

        const loadedPosts1 = await loadedCategory1.posts;
        expect(loadedPosts1!).not.to.be.empty;
        loadedPosts1![0].id.should.equal(1);
        loadedPosts1![0].title.should.equal("Hello Post #1");

        const loadedPosts2 = await loadedCategory2.posts;
        expect(loadedPosts2!).not.to.be.empty;
        loadedPosts2![0].id.should.equal(2);
        loadedPosts2![0].title.should.equal("Hello Post #2");

        // todo: need to test somehow how query is being generated, or how many raw data is returned

    })));

});
