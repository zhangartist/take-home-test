/**
 * Dummy request module, support Promise
 *
 */
import _ from 'underscore';
import J from './helper.js';
import { setAjaxInProcess } from '../pages/home/home.js';
import initialUsers from './initialUsers.js';


// configs
const HTTP_RESPONSE_DELAY = 400; // in ms
let DATABASE_USERS = initialUsers; // simulate a user database


// simulate HTTP request on a dummy server
export default function request({ type, url, payload }){
    // log it and show loader
    console.log(`${type} ${url}`, payload || '');
    setAjaxInProcess(true);

    // hold http response
    let httpResponse;

    // extract user id from url
    let urlChunk = url.match(/^\/contact\/(.+)/);
    let userId = urlChunk ? urlChunk[1] : null;

    // list available /contacts, return array of user jsons
    if (type == 'GET' && url == '/contacts'){
        httpResponse = DATABASE_USERS;
    }

    // view /contact/<id>, return user json
    else if (type == 'GET' && userId){
        httpResponse = _.findWhere(DATABASE_USERS, { userId });
    }

    // create /contact, return user json
    else if (type == 'PUT' && url == '/contact'){
        let newUser = { userId: J.generateUUID(), ...payload };
        DATABASE_USERS.push(newUser);
        httpResponse = newUser;
    }

    // edit /contact/<id>, return user json
    else if (type == 'POST' && userId){
        let user = _.findWhere(DATABASE_USERS, { userId });
        _.extend(user, payload);
        httpResponse = user;
    }

    // delete /contact/<id>, return { success: TRUE/FALSE }
    else if (type == 'DELETE' && userId){
        DATABASE_USERS = _.reject(DATABASE_USERS, user => user.userId == userId);
        console.log(DATABASE_USERS)
        httpResponse = { success: true };
    }

    // return a promise, to allow async/await
    return new Promise(function(resolve, reject){
        setTimeout(() => {
            if (httpResponse) resolve(J.deepClone(httpResponse));
            else reject('Server failed to generate a response.');

            // remove loader and log response
            setAjaxInProcess(false);
            console.log('Response', httpResponse);
        }, HTTP_RESPONSE_DELAY)
    });
}
