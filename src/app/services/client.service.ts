import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, Action, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clientsCollection: AngularFirestoreCollection<Client>;
  clientDoc: AngularFirestoreDocument<Client>;
  clients: Observable<Client[]>;
  client: Observable<Client>;

  constructor(private afs: AngularFirestore) { 
    this.clientsCollection = this.afs.collection('clients', ref => ref.orderBy('lastName', 'asc'));
    
  }

  getClients(): Observable<Client[]> {
    // Get clients with the ID
    this.clients = this.clientsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const client = a.payload.doc.data() as Client;
        client.id = a.payload.doc.id;
        return client;
      }))
    );

    return this.clients;
  }

  newClient(client: Client) {
    this.clientsCollection.add(client);
  }

  getClient(id: string): Observable<Client> {
    this.clientDoc = this.afs.doc<Client>(`clients/${id}`);

    this.client = this.clientDoc.snapshotChanges().pipe(
      map(a => {
        if (a.payload.exists === false) {
          return null;
        } else {
          const client = a.payload.data();
          client.id = a.payload.id;
          return client;
        }
     })
    );

      return this.client;
  }

  updateClient(client: Client) {
    this.clientDoc = this.afs.doc<Client>(`clients/${client.id}`);
    this.clientDoc.update(client);
  }



}
