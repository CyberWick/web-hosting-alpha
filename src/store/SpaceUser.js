import { Users } from "@spacehq/users";
import { PrivateKey } from "@textile/hub";

const users = new Users({ endpoint: 'wss://auth.space.storage' });

export class SpaceUser {

    static user = null;
    
    static getUser = async(pk) => {
        console.log('IN GETUSER')
        if(this.user !== null) {
            console.log('IN IF GETUSER', this.user);
            return this.user;
        } else {
            const identity = PrivateKey.fromString(pk);
            const spaceUser = await users.authenticate(identity);
            this.user = spaceUser;
            console.log('IN ELSE GETUSER', this.user);
            return spaceUser;
        }
    }
}