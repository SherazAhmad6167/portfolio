// Contact form storage in the site's Firebase project. The web config only identifies the
// project and is safe to ship; firestore.rules decides what visitors may write (new messages only).
// The SDK loads on first submit, so it adds nothing to the page's initial download.

const firebaseConfig = {
  apiKey: "AIzaSyC8hKsyKwDOzKtRfI0EtLzFWb78xlg_3r4",
  authDomain: "muhammadsherazahmad.firebaseapp.com",
  projectId: "muhammadsherazahmad",
  storageBucket: "muhammadsherazahmad.firebasestorage.app",
  messagingSenderId: "776686548614",
  appId: "1:776686548614:web:683e7bc94ff8a773c28307",
};

export type ContactMessage = { name: string; email: string; message: string; needs: string[] };

/** Saves a contact-form message to the `messages` collection (read it in the Firebase console). */
export async function saveMessage(msg: ContactMessage) {
  const [{ getApps, initializeApp }, { addDoc, collection, getFirestore, serverTimestamp }] = await Promise.all([
    import("firebase/app"),
    import("firebase/firestore/lite"),
  ]);
  const app = getApps()[0] ?? initializeApp(firebaseConfig);
  await addDoc(collection(getFirestore(app), "messages"), { ...msg, createdAt: serverTimestamp() });
}
