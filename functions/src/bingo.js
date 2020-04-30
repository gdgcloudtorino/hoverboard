import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import Storage from '@google-cloud/storage';
import path from 'path';

export const bingoCardAdded = functions.storage.object().onFinalize(async (file) => {
  const filePath = file.name;
  const contentType = file.contentType;
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);
  const bucket = gcs.bucket(file.bucket);
  const file = bucket.file(filePath);

  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  if (dir != 'bingo') {
    return console.log('This is not a bingo card.');
  }

  const imageSnapshot = await firestore().collection("bingo").doc("0").collection("images").doc(name).get();
  if (imageSnapshot.exists) {
    return console.log('This image already exists in bingo catalog.');
  }

  try {
    await firestore().runTransaction(async transaction => {
      images = parseInt(images) + 1;
      const downloadOptions = {
        action: 'read',
        expires: '05-31-2020'
      };
      const [downloadUrl] = await file.getSignedUrl(downloadOptions);
      const cardRef = firestore().collection("bingo").doc("0").collection("cards").doc()
      transaction.create(cardRef, {
        imageName: name,
        imageFullPath: file.name,
        imageId: file.id,
        imageMediaLink: downloadUrl,
        assigned: false
      });
      transaction.create(firestore().collection("bingo").doc("0").collection("images").doc(name), {
        seq: images,
        name: name,
        fullPath: file.name,
        mediaLink: downloadUrl,
        cardRef: cardRef.id
      });
    });
  } catch(e){
    console.log("Transaction failed: ", e);
    return console.log("Error while creating entry for bingo image");
  }

  return console.log("Entry created for bingo image");
});

export const bingoCardRequested = functions.firestore.document('cardRequests/{requestId}').onWrite(async (change, context) => {
  const requestSnapshot = await firestore().collection("cardRequests").doc(context.params.requestId).get();
  if (requestSnapshot.get("assigned") == true ) {
    return console.log('There are already card assigned to the same email: '+ context.params.requestId);
  }

  const cardsQuery = await firestore().collection("bingo").doc("0").collection("cards")
    .where("assigned", "==", true).get();
  if (cardsQuery.empty || cardsQuery.size < 2) {
    await firestore().collection("discardedRequests").doc(context.params.requestId).set({
      email: requestSnapshot.get("email"),
      name: requestSnapshot.get("name"),
      lastName: requestSnapshot.get("lastName")
    });
    return console.log('All images have been assigned');
  }

  try {
    await firestore().runTransaction(async transaction => {
      transaction.update(firestore().collection("cardRequests").doc(context.params.requestId), {
        assigned: true,
      });
      const saturdayCardId = cardsQuery.docs[0].id;
      const saturdayCard = cardsQuery.docs[0].data();
      const sundayCardId = cardsQuery.docs[1].id;
      const sundayCard = cardsQuery.docs[1].data();

      transaction.update(firestore().collection("bingo").doc("0").collection("cards").doc(saturdayCardId), {
        assigned: true,
        assignedTo: context.params.requestId
      });
      transaction.update(firestore().collection("bingo").doc("0").collection("cards").doc(sundayCardId), {
        assigned: true,
        assignedTo: context.params.requestId
      });

      transaction.create(firestore().collection("assignedCards").doc(context.params.requestId), {
        email: requestSnapshot.get("email"),
        name: requestSnapshot.get("name"),
        lastName: requestSnapshot.get("lastName"),
        saturdayCardId: saturdayCardId,
        saturdayMediaLink: saturdayCard.imageMediaLink,
        sundayCardId: sundayCardId,
        sundayMediaLink: sundayCard.imageMediaLink
      });
    });
  } catch(e){
    console.log("Transaction failed: ", e);
    return console.log("Error while assigning bingo card");
  }

  return console.log("Bingo card assigned");
});
