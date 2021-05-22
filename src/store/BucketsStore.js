import { Buckets } from "@textile/buckets";

export class BucketsStore {
    static buckets = null;

    static getBuckets = (spaceUser) => {
        if(this.buckets !== null) {
            return this.buckets;
        } else if(spaceUser === null) {
            return Error('Space USer not set');
        } 
        else {
            this.buckets = Buckets.withUserAuth(spaceUser.storageAuth);
            return this.buckets;
        }
    }
}