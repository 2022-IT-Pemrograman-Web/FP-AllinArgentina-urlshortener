import admin from 'firebase-admin';
import serviceAccount from"../serviceAccountKey.json"  assert {type: 'json'};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://url-short-29989-default-rtdb.asia-southeast1.firebasedatabase.app"
  });

const db = admin.firestore()

export {db}
export {admin}