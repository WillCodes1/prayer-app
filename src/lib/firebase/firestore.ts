import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  CollectionReference,
  Query,
  QueryConstraint,
  writeBatch,
  runTransaction,
  onSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import { db } from './config';
import { FirebaseError } from './errors';

/**
 * Helper to get a document reference
 */
function getDocRef<T extends DocumentData>(
  collectionPath: string, 
  docId?: string
): DocumentReference<T> {
  const collRef = collection(db, collectionPath) as CollectionReference<T>;
  return docId ? doc(collRef, docId) : doc(collRef);
}

/**
 * Helper to get a collection reference
 */
function getCollectionRef<T extends DocumentData>(
  collectionPath: string
): CollectionReference<T> {
  return collection(db, collectionPath) as CollectionReference<T>;
}

/**
 * Get a document by ID
 */
export async function getDocument<T extends DocumentData>(
  collectionPath: string, 
  docId: string
): Promise<T | null> {
  try {
    const docRef = getDocRef<T>(collectionPath, docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return { 
      id: docSnap.id, 
      ...docSnap.data() 
    } as T;
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Set a document with the given data
 */
export async function setDocument<T extends DocumentData>(
  collectionPath: string, 
  data: T,
  docId?: string,
  merge = true
): Promise<string> {
  try {
    if (docId) {
      await setDoc(getDocRef(collectionPath, docId), data, { merge });
      return docId;
    } else {
      const newDocRef = await addDoc(getCollectionRef(collectionPath), data);
      return newDocRef.id;
    }
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Update a document
 */
export async function updateDocument<T extends DocumentData>(
  collectionPath: string, 
  docId: string, 
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = getDocRef(collectionPath, docId);
    await updateDoc(docRef, { 
      ...data, 
      updatedAt: serverTimestamp() 
    });
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionPath: string, 
  docId: string
): Promise<void> {
  try {
    const docRef = getDocRef(collectionPath, docId);
    await deleteDoc(docRef);
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Query documents with filters
 */
export async function queryDocuments<T extends DocumentData>(
  collectionPath: string,
  ...queryConstraints: QueryConstraint[]
): Promise<T[]> {
  try {
    const q = query(
      getCollectionRef<T>(collectionPath),
      ...queryConstraints
    ) as Query<T>;
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Get a document and subscribe to changes
 */
export function subscribeToDocument<T extends DocumentData>(
  collectionPath: string,
  docId: string,
  callback: (data: (T & { id: string }) | null, error?: Error) => void
): () => void {
  const docRef = getDocRef<T>(collectionPath, docId);
  
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap: DocumentSnapshot<T>) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T & { id: string });
      } else {
        callback(null);
      }
    },
    (error: Error) => {
      console.error('Error subscribing to document:', error);
      callback(null, new FirebaseError(error));
    }
  );
  
  return unsubscribe;
}

/**
 * Subscribe to a collection query
 */
export function subscribeToCollection<T extends DocumentData>(
  collectionPath: string,
  callback: (data: (T & { id: string })[], error?: Error) => void,
  ...queryConstraints: QueryConstraint[]
): () => void {
  const q = query(
    getCollectionRef<T>(collectionPath),
    ...queryConstraints
  ) as Query<T>;
  
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot<T>) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(data);
    },
    (error: Error) => {
      console.error('Error subscribing to collection:', error);
      callback([], new FirebaseError(error as Error));
    }
  );
  
  return unsubscribe;
}

/**
 * Run a Firestore transaction
 */
export async function runFirestoreTransaction<T>(
  updateFunction: (transaction: any) => Promise<T>
): Promise<T> {
  try {
    return await runTransaction(db, updateFunction);
  } catch (error) {
    throw new FirebaseError(error as Error);
  }
}

/**
 * Create a batch write
 */
export function createBatch() {
  return {
    batch: writeBatch(db),
    set: function<T extends DocumentData>(
      collectionPath: string, 
      data: T, 
      docId?: string
    ) {
      const docRef = docId 
        ? getDocRef(collectionPath, docId)
        : doc(getCollectionRef(collectionPath));
      
      this.batch.set(docRef, data);
      return docRef.id;
    },
    update: function<T extends DocumentData>(
      collectionPath: string, 
      docId: string, 
      data: Partial<T>
    ) {
      const docRef = getDocRef(collectionPath, docId);
      this.batch.update(docRef, data as DocumentData);
    },
    delete: function(collectionPath: string, docId: string) {
      const docRef = getDocRef(collectionPath, docId);
      this.batch.delete(docRef);
    },
    commit: async function() {
      try {
        await this.batch.commit();
      } catch (error) {
        throw new FirebaseError(error as Error);
      }
    }
  };
}

/**
 * Helper to convert Firestore timestamps to JS Dates
 */
export function convertTimestamps(data: any): any {
  if (!data) return data;
  
  if (data.toDate && typeof data.toDate === 'function') {
    return data.toDate();
  }
  
  if (Array.isArray(data)) {
    return data.map(item => convertTimestamps(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, convertTimestamps(value)])
    );
  }
  
  return data;
}
