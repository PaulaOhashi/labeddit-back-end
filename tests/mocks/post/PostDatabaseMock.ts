import { BaseDatabase } from "../../../src/database/BaseDatabase";
import { PostModelDB, PostDB } from "../../../src/models/Post"
import { usersMock } from "../user/UserDatabaseMock";

const postsMock: PostDB[] = [
    {
        id: "p001",
        creator_id: "id-mock-fulano",
        content: "string",
        likes: 0,
        dislikes: 0,
        comments: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: "p002",
        creator_id: "id-mock-astrodev",
        content: "string2",
        likes: 0,
        dislikes: 0,
        comments: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

export class PostDatabaseMock extends BaseDatabase {
    TABLE_NAME = "posts"

    public insertPost = async (newPostDB: PostDB): Promise<void> => {
       
    }

    public findPosts = async (): Promise<PostModelDB[]> => {
        const result: PostModelDB[] = postsMock.map(postMock => {
            const findUser = usersMock.find(user => user.id === postMock.creator_id)
            return {
                id: postMock.id,
                creator_id: postMock.creator_id,
                content: postMock.content,
                likes: postMock.likes,
                dislikes: postMock.dislikes,
                comments: postMock.comments,
                created_at: postMock.created_at,
                updated_at: postMock.updated_at,
                creatorId: postMock.creator_id,
                creatorName: findUser?.name as string
            }
        })
        return result
    }

    public findPostById = async (id: string): Promise<PostDB> => {
        return postsMock.filter(postMock => postMock.id === id)[0]
    }

    public updatedPost = async (postUpdate: PostDB): Promise<void> => { }
    
    public deletePostById = async (id: string): Promise<void> => { }
    
    public incrementLike = async (id: string): Promise<void> => { }
    
    public decrementLike = async (id: string): Promise<void> => { }
    
    public incrementDislike = async (id: string): Promise<void> => { }
    
    public decrementDislike = async (id: string): Promise<void> => { }
    
    public incrementComments = async (id: string): Promise<void> => { }
    
    public decrementComments = async (id: string): Promise<void> => { }

    public reverseLikeUp = async (postId: string): Promise<void> => { }
    
    public reverseDislikeUp = async (postId: string): Promise<void> => { }
    
}