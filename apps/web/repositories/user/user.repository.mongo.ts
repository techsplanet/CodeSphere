
import { UserSchema, UserStatus } from "../../../../packages/shared-types";
import { UserRepository } from "./user.repository";
import { RepositoryUser, RepositoryUserId, RepositoryCreateUserInput, RepositoryAuthProviders } from "./user.types";
import { getDb } from "@/lib/db";
import { nanoid } from "nanoid";






// exposing limited number of db operation and isolating db query from upper layers of the app.

export const findUserById = async(userId: RepositoryUserId):Promise<RepositoryUser|null> => {
    
    const db = await getDb();
    // deleted user can also be filter here using this  -  deletedAt: { $exists: false };
    // but don't do this because already handled by maping function;
    const user = await db.collection("users").findOne({id: userId}); 
    
    if (!user){
        return null;
    }

    return  mapMongoUserToDomain(user)
}


export const findUserByAuthId = async(provider:RepositoryAuthProviders, providerUserId:string): Promise<RepositoryUser | null> => {

     const db = await getDb();
     
     const authIdentity = await db.collection("auth_identities").findOne({provider, providerUserId, disabledAt: null});

     if (!authIdentity){
        return null;
     }

     const { userId } = authIdentity;

     const user = await db.collection("users").findOne({id:userId});

     if (!user){
        return null;
     }

     return mapMongoUserToDomain(user);

}


export const createUser = async( input: RepositoryCreateUserInput ): Promise<RepositoryUser> => {
       
    const domainObj  = {
        ...input,        // ***learing-1
         id : nanoid(),  // compact, url-safe, and faster unique-id method
         status: UserStatus.Active,
         createdAt : new Date(),
         lastActiveAt : new Date()
    };

    const validatedDomainObj = UserSchema.parse(domainObj);

    const doc = {
        ...validatedDomainObj,
        deletedAt: null
    };

    
    const db = await getDb();

    await db.collection("users").insertOne(doc);

    return validatedDomainObj
}





//---> helper function for mapping mongodb documnets to domain objects. <---
export const mapMongoUserToDomain = (doc: unknown): RepositoryUser|null => {
    
    // type narrowing for input: doc.
    if (!doc || typeof doc !== 'object') {
        throw new Error("Mapping failed: Input must be a valid MongoDB document object.");
    }

    // type casting to needed before accessing the fields of unknown type.
    const d = doc as Record<string, unknown>;
    
    if (d.deletedAt){
        return null
    }

    const rawData = {
                        id: d.id,
                        username: d.username,
                        displayName: d.displayName,
                        avatarUrl: d?.avatarUrl,
                        status: d.status,
                        createdAt: d.createdAt,
                        lastActiveAt: d.lastActiveAt
                    };
    
    // unnecessary persistance concerning field get strip.
    const validationResult = UserSchema.safeParse(rawData); 

    if (!validationResult.success){
        console.error("Error in mapping Mongo -> Domain: ", validationResult.error)
        throw new Error("Failed to resolve user identity", { cause: validationResult.error });
    }

    return validationResult.data;
}

const deleteUserById = async(input:RepositoryUserId):Promise<void> => {

    const db = await getDb();
    await db.collection("users").updateOne({ id:input, deletedAt:null }, { $set:{deletedAt:new Date()} });

}


// ---> Satisfying the userRepository interface <---

export const userRepository = {
  findUserById,
  findUserByAuthId,
  createUser,
  deleteUserById
} satisfies UserRepository; // "satisfies" -- maintain the rich, specific type information that TypeScript infers from your actual value.


// Learning-1 : spreading order matters so value which is not allowed to modified by same field name value that value must come after modifiable value