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

    // Retrieve existing data with the same key
    const existingData = await store.get(0);

    // Merge the existing data with the new data (always id 0)
    const mergedData = { ...existingData, ...data, id: 0 };

    // Save the merged data back to the database
    await store.put(mergedData);

    await tx.done;
};

// Utility function to retrieve form data by ID
export const getFormData = async () => {
    const db = await openIndexedDB();
    const store = db.transaction('formData').objectStore('formData');
    return store.get(0);
};

export const deleteField = async (fieldName: string) => {
    const db = await openIndexedDB();
    // const store = db.transaction('formData').objectStore('formData');

    const tx = db.transaction('formData', 'readwrite');
    const store = tx.objectStore('formData');

    // Get all records (or use a cursor if needed)
    const firstRecord = await store.get(0);
    if (firstRecord) {
        // Set the field to an empty string
        firstRecord[fieldName] = '';
        // Update the record
        await store.put(firstRecord);
    }

}

