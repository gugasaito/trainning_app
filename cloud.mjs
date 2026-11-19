import {isNative,nativeCall} from './native-bridge.mjs';
const config={apiKey:'AIzaSyDF5zc2PRrpW5eDfDx0dBNEeIxfzNq6Y6M',authDomain:'full-body-tracker-b4a42.firebaseapp.com',projectId:'full-body-tracker-b4a42',appId:'1:15807856618:web:edc3784651614ac8e93c93'};
export async function connect(){
 const [a,auth,f]=await Promise.all(['app','auth','firestore'].map(n=>import(`https://www.gstatic.com/firebasejs/13.2.0/firebase-${n}.js`)));
 const provider=()=>{const p=new auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p;};
 const app=a.initializeApp(config),au=auth.getAuth(app),db=f.getFirestore(app);
 return {watch:cb=>auth.onAuthStateChanged(au,cb),login:async()=>{if(!isNative())return auth.signInWithPopup(au,provider());const tokens=await nativeCall('googleLogin');return auth.signInWithCredential(au,auth.GoogleAuthProvider.credential(tokens.idToken,tokens.accessToken));},logout:async()=>{await auth.signOut(au);if(isNative())await nativeCall('googleLogout');},read:async uid=>{const s=await f.getDocFromServer(f.doc(db,'users',uid,'tracker','snapshot'));return s.exists()?s.data():null},write:(uid,data,expected)=>f.runTransaction(db,async tx=>{if(au.currentUser?.uid!==uid)throw Error('Conta alterada.');const ref=f.doc(db,'users',uid,'tracker','snapshot'),snap=await tx.get(ref),rev=snap.exists()?(snap.data().revision??0):0;if(rev!==expected){const e=Error('Histórico alterado em outro aparelho.');e.code='tracker/conflict';throw e;}tx.set(ref,{...data,revision:rev+1});return rev+1;})};
}
