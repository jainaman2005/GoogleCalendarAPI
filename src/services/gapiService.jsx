import { gapi } from 'gapi-script';
import { CLIENT_ID, DISCOVERY_DOCS, SCOPES } from "../config.jsx";
const initClient = () => {
    return new Promise((resolve, reject) => {
        gapi.load('client:auth2', () => {
            gapi.client.init({
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            }).then(() => {
                resolve();
            }).catch(err => reject(err));
        });
    })
};
const handleSignedIn = () => {
    gapi.auth2.getAuthInstance().signIn();
};
const handleSignedOut = () => {
    gapi.auth2.getAuthInstance().signOut();
};
const getAuthInstance = () => {
    return gapi.auth2.getAuthInstance();
}
export { handleSignedIn, handleSignedOut, getAuthInstance, initClient };