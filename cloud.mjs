const config={apiKey:'AIzaSyDF5zc2PRrpW5eDfDx0dBNEeIxfzNq6Y6M',authDomain:'full-body-tracker-b4a42.firebaseapp.com',projectId:'full-body-tracker-b4a42',appId:'1:15807856618:web:edc3784651614ac8e93c93'};
export async function connect(){
 const [a,auth,f]=await Promise.all(['app','auth','firestore'].map(n=>import(`https://www.gstatic.com/firebasejs/13.2.0/firebase-${n}.js`)));
 const app=a.initializeApp(config),au=auth.getAuth(app),db=f.getFirestore(app);
 return {watch:cb=>auth.onAuthStateChanged(au,cb),login:()=>auth.signInWithPopup(au,new auth.GoogleAuthProvider()),logout:()=>auth.signOut(au),read:async uid=>{const s=await f.getDocFromServer(f.doc(db,'users',uid,'tracker','snapshot'));return s.exists()?s.data():null},write:(uid,data)=>f.setDoc(f.doc(db,'users',uid,'tracker','snapshot'),data)};
}
