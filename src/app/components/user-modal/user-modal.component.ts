import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { ClientService } from 'services/client.service';

@Component({
  selector: 'user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.sass']
})
export class UserModalComponent implements OnInit {

  @ViewChild('login') private loginRef: TemplateRef<any>;
  @ViewChild('info') private infoRef: TemplateRef<any>;
  @ViewChild('log_off') private logOffRef: TemplateRef<any>;

  myForm!: FormGroup;
  user: any;

  closeResult = '';
  err_msg = '';

  constructor(
    private modalService: NgbModal,
    private client: ClientService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  modal() {
    /* Opens a modal and returns its content on close as a Observable */

    /*
    isLoggedIn()
      Either Send Expiry w/ JWT
      Or find someway to get expiray from JWT

    Only retives getInfo on Login, or on Init when already logged in 
    */
    this.client.getInfo().subscribe(data => {
      var modal: TemplateRef<any>;
      if (data) {
        this.user = data;
        modal = this.infoRef;
        console.log("User Modal")
        console.log(this.user)
      } else {
        this.myForm = this.fb.group({
          username: ['', [Validators.required]],
          password: ['', [Validators.required]]
        })
        this.myForm.valueChanges.subscribe(console.log);
        modal = this.loginRef;
      }
      this._openModal(modal);
    })
  }

  _openModal(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', scrollable: true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  /*    Close Modal     */
  saveLogin(formData: FormGroup, close: Function) {
    console.log(formData)
    this.client.logIn(formData.value).subscribe(res => {
      if ('error' in res) {
        this.err_msg = res['error'];
        /* Dunno if this the best way, showing the direct response */
        return
      }
      if ('msg' in res) {
        if (res['msg'] === 'Successful Login') {
          /* Store Token */
          localStorage.setItem("SESSIONID", res['token'])
          close('Save')
          window.location.reload();//refresh
        }
      }
      console.log(res);
    })
    
  }
  logOffCheck(close: Function) {
    close('Close')
    this._openModal(this.logOffRef)
  }
  logOut(close: Function) {
    close('Log Off')
    localStorage.removeItem("SESSIONID")
    window.location.reload();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  get username() {
    return this.myForm.get('username');
  }
  get password() {
    return this.myForm.get('password');
  }
}
