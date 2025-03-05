import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore,
              private angularFireStorage: AngularFireStorage
  ) { }


public insertar(coleccion, datos){
return this.angularFirestore.collection(coleccion).add(datos);

}


public consultar(coleccion){
  return this.angularFirestore.collection(coleccion).snapshotChanges();
}



public borrar(coleccion, documentId) {
  return this.angularFirestore.collection(coleccion).doc(documentId).delete();
}

public actualizar(coleccion, documentId, datos) {
  return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
 }


 public consultarPorId(coleccion, documentId) {
  return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
}


public subirImagenBase64(nombreCarpeta:string,nombreArchivo:string,imagenBase64:string){
  let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
  return storageRef.putString(imagenBase64,'data_url');
}


public eliminarArchivoPorURL(url:string){
  return this.angularFireStorage.storage.refFromURL(url).delete();
}




}