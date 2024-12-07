import { openDB } from 'idb';


// Utility function to open IndexedDB
export const openIndexedDB = async () => {
    const db = await openDB('clientData', 1, {
        upgrade(db, oldVersion, newVersion, transaction, event) {
            // If it's the first time opening the database
            if (oldVersion < 1) {
                const store = db.createObjectStore('formData', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
                store.createIndex('facilityName', 'facilityName');
            }
        },
    });
    return db;
};

// Utility function to save form data
//@ts-expect-error: data varies and too complex to type
export const saveFormData = async (data) => {
    const db = await openIndexedDB();
    const tx = db.transaction('formData', 'readwrite');
    const store = tx.objectStore('formData');
    await store.put({...data, id: 0});
    await tx.done;
};

// Utility function to retrieve form data by ID
export const getFormData = async () => {
    const db = await openIndexedDB();
    const store = db.transaction('formData').objectStore('formData');
    return store.get(0);
};

// Utility function to get all form data
// export const getAllFormData = async () => {
//     const db = await openIndexedDB();
//     const store = db.transaction('formData').objectStore('formData');
//     return store.getAll();
// };
