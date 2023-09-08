import { LikeDislikeDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";


export class LikeDislikeDatabase extends BaseDatabase{
    public static TABLE_LIKES  = "posts_likes_dislikes"

    public findLikesDislikes = async (id_post: string, id_user: string): Promise<LikeDislikeDB | undefined> => {
        const [likesDislikesDB]: LikeDislikeDB[] | undefined = await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES).where({ post_id: id_post }).andWhere({ user_id: id_user })
        
        return likesDislikesDB
    }

    public createLikesDislikes = async (input: LikeDislikeDB): Promise<void> => {
      await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES).insert(input)
    }

    public deleteLikesDislikes = async (userId: string, postId: string): Promise<void> => {
        await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES).del().where({ user_id : userId }).andWhere({ post_id : postId })
    }

    public updateLikesDislikes = async ({ like, user_id, post_id }: LikeDislikeDB): Promise<void> => {
        await BaseDatabase.connection(LikeDislikeDatabase.TABLE_LIKES).update({ like }).where({ user_id }).andWhere({ post_id })
    }
}