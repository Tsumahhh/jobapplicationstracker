const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.autoDeleteTrash = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const db = admin.firestore();
  const now = Date.now();
  const cutoff = now - 10 * 24 * 60 * 60 * 1000;
  const trashRef = db.collection('applications').where('status', '==', 'trash').where('deletedAt', '<=', cutoff);
  const snapshot = await trashRef.get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
});