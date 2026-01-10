import { getDb } from "@/lib/db";
import { AuthIdentitySchema } from "../../../../packages/shared-types";
import { AuthIdentityResolution, AuthRepositoryIdentity, CreateAuthIdentityInput, ResolveAuthIdentityInput } from "./auth-identity.types";
import { AuthIdentityRepository } from "./auth-identity.repository";


export const resolveAuthIdentity = async({provider, providerUserId}: ResolveAuthIdentityInput) : Promise< AuthIdentityResolution> => {

    const db = await getDb();

    const doc = await db.collection("auth_identities").findOne({provider, providerUserId});

    if (!doc) return {status: "not_found"};

    if (doc.disabledAt !== null) return {status: "disabled"};

    const domainIdentity = {
        userId : doc.userId,
        provider: doc.provider,
        providerUserId: doc.providerUserId,
        email: doc.email,
        emailVerified: doc.emailVerified
    };

    return {status: "active", identity: AuthIdentitySchema.parse(domainIdentity)};
    
}


export const createAuthIdentity = async(input: CreateAuthIdentityInput) : Promise<AuthRepositoryIdentity> => {

    const {
          provider,
          providerUserId,
          email,
          emailVerified,
          userId
        } = input;

    const db = await getDb();
    const doc = await db.collection("auth_identities").findOne({provider, providerUserId});
    
    if (doc && (doc.disabledAt === null)){
        const domainIdentity = {
          userId : doc.userId,
          provider: doc.provider,
          providerUserId: doc.providerUserId,
          email: doc.email,
          emailVerified: doc.emailVerified
          }
        
        return AuthIdentitySchema.parse(domainIdentity);
    }
    else if (doc && (doc.disabledAt !== null)){

        const domainIdentity = {
          userId : doc.userId,
          provider: doc.provider,
          providerUserId: doc.providerUserId,
          email: doc.email,
          emailVerified: doc.emailVerified
          }
        
        await db.collection("auth_identities").updateOne({provider, providerUserId}, { $set: {disabledAt:null}});

        return AuthIdentitySchema.parse(domainIdentity);
    
    }
    else {  // if doc doesn't exist
        const domainIdentity = {
            userId : userId,
            provider: provider,
            providerUserId: providerUserId,
            email: email,
            emailVerified: emailVerified
        }

        await db.collection("auth_identities").insertOne({ ...domainIdentity, disabledAt: null });

        return AuthIdentitySchema.parse(domainIdentity);

    }
   

}


export const disableAuthIdentity = async(input:ResolveAuthIdentityInput):Promise<void> => {

    const {provider, providerUserId} = input;
    const db = await getDb();

    await db.collection("auth_identities").updateOne({provider, providerUserId, disabledAt:null}, { $set:{disabledAt: new Date()} });
    
}


export const authIdentityRepository = {
  resolveAuthIdentity,
  createAuthIdentity,
  disableAuthIdentity
} satisfies AuthIdentityRepository;