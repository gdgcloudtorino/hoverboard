import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import path from 'path';

export const bingoCardAdded = functions.storage.object().onFinalize(async (file) => {
  const filePath = file.name;
  const contentType = file.contentType;
  const dir = path.dirname(filePath);
  const name = path.basename(filePath);

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

  var images = 0;
  const catalogSnapshot = await firestore().collection("bingo").doc("0").get();
  if (catalogSnapshot.exists) {
    images = catalogSnapshot.get("images");
  } else {
    await firestore().collection("bingo").doc("0").set({
      images: images
    });
  }

  try {
    await firestore().runTransaction(async transaction => {
      images = parseInt(images) + 1;
      transaction.create(firestore().collection("bingo").doc("0").collection("images").doc(name), {
        seq: images,
        name: name,
        fullPath: file.name,
        mediaLink: file.mediaLink
      });
      transaction.create(firestore().collection("bingo").doc("0").collection("cards").doc(parseInt(images).toString()), {
        imageName: name,
        imageFullPath: file.name,
        imageId: file.id,
        imageMediaLink: file.mediaLink,
        assigned: false
      });
      
      transaction.update(firestore().collection("bingo").doc("0"), {
        images: images,
      });
    });
  } catch(e){
    console.log("Transaction failed: ", e);
    return console.log("Error while creating entry for bingo image");
  }

  return console.log("Entry created for bingo image");
});
