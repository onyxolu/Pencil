import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class PencilService {
  uid: string;
  db_key: string;

  constructor(private authService: AuthService, private afs: AngularFirestore) {
    setTimeout(() => {
      this.authService.user.subscribe((data) => {
        if (data) {
          this.uid = data.id;
        }
      });
    }, 2000);
  }
  getUid() {
    return new Promise((res) => {
      this.authService.user.subscribe((user) => {
        if (user) {
          this.uid = user.uid;
        }
        res(this.uid);
      });
    });
  }

  nativeGlobal() {
    return window;
  }

  createPenData(postdata: {}) {
    return new Promise<any>((restore, reject) => {
      this.afs
        .collection('pen')
        .add(postdata)
        .then((r) => {})
        .catch((e) => console.log(e));
    });
  }

  getPenData() {
    return this.afs.collection('pen').snapshotChanges();
  }

  updatePenData(docId, penData) {
    return this.afs
      .collection('pen')
      .doc(docId)
      .set({ penData: penData }, { merge: true });
  }
}
