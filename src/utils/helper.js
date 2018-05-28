/**
 * Bunch of helper functions
 *
 */
import $ from 'jquery';


// export utilities
let J = {};


// ensure $.val() returns string
$.fn.val2 = function(){
    return this.val() || '';
};


// deep clone an object
J.deepClone = (obj) => JSON.parse(JSON.stringify(obj));


// generate uuid
J.generateUUID = function(){
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};

// format phone number with dashes
J.formatPhone = function(phone){
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
};




export default J;