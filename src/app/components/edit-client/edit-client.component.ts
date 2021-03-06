import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { SettingsService } from '../../services/settings.service';
import { Client } from '../../models/Client';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {
  id: string;
  client: Client;
  disableBalanceOnEdit: boolean;

  constructor(
    private clientService: ClientService,
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessage: FlashMessagesService
  ) { 
    this.client = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      balance: 0
    };
  }

  ngOnInit() {
    this.disableBalanceOnEdit = this.settingsService.getSettings().disableBalanceOnEdit;
    
    // Get ID from URL
    this.id = this.route.snapshot.params['id'];
    // Get client from firestore
    this.clientService.getClient(this.id).subscribe(client => {
      this.client = client;
    });
  }

  onSubmit(form) {
    if (!form.valid) {
      this.flashMessage.show('Please fill out the form correctly', {
        cssClass: 'alert-danger', timeout: 4000
      });
    } else {
      // Add ID to a Client in the Form
      form.value.id = this.id;
      // Update the Client
      this.clientService.updateClient(form.value);

      this.flashMessage.show('Client Updated', {
        cssClass: 'alert-success', timeout: 4000
      });

      this.router.navigate([`/client/${this.id}`])
    }
  }

}
