import {Transaction} from "../../../../../src/decorator/transaction/Transaction";
import {Post} from "../entity/Post";
import {EntityManager} from "../../../../../src/entity-manager/EntityManager";
import {TransactionEntityManager} from "../../../../../src/decorator/transaction/TransactionEntityManager";
import {Category} from "../entity/Category";

export class PostController {

    @Transaction("sqlite") // "mysql" is a connection name. you can not pass it if you are using default connection.
    async save(post: Post, category: Category, @TransactionEntityManager() entityManager: EntityManager) {
        await entityManager.persist(post);
        await entityManager.persist(category);
    }

    // this save is not wrapped into the transaction
    async nonSafeSave(entityManager: EntityManager, post: Post, category: Category) {
        await entityManager.persist(post);
        await entityManager.persist(category);
    }

}