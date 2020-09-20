import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ServicesService } from '../services/services.service';
import {NgbModal,  ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
declare var jquery: any;
declare var $: any;

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf';



@Component({
  selector: 'app-pdfview',
  templateUrl: './pdfview.component.html',
  styleUrls: ['./pdfview.component.css']
})
export class PdfviewComponent implements OnInit {
  viewSrc: string;
  userId: any;
  docID: string;
  docfile: string;
  recpList: any;
  currentIndex: any;
  userData: any;
  imageURL: String;
  signatureImage;
  fileContent: any;
  mainImage: any;
  itemId: any;
  uploadedFiles = [];
  useRecId: any;
  userDocId: any;
  signatureFile: any;
  initialFile: any;
  @ViewChild("mymodal",{static: false})mymodal:TemplateRef<any>

  constructor(private modalService: NgbModal, private services: ServicesService) { }

  ngOnInit(): void {
    
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.docID = localStorage.getItem("docId");
    this.docfile = localStorage.getItem("docfile");
    this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${this.docfile}`;
    this.loadRecipientsList();
  }

  loadRecipientsList() {

    let reqObj = {
      UserId: this.userId,
      DocId: this.docID
    }

    /* this.services.recipientsList(reqObj).subscribe((resp) => {
      console.log("recpList resp-----", resp);
      this.recpList = resp.data.ReceiptsDetails[0].Receipts;
      console.log("recpList---> ", this.recpList)
      let docum = resp.data.DocDetails[0].Doc;
      console.log("doccccccccc", docum);
      this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${docum}`;
    }) */


    this.services.getpdfcoordinates(reqObj).subscribe((resp) => {
      console.log('coordinats-->', resp);
      this.userData = resp.data[0].Recipients;

      this.useRecId = resp.data[0].Recipients[0].ReceiptId;
      this.userDocId = resp.data[0].DocId;
      console.log(this.userData);
    })

    //this.userData = JSON.parse(localStorage.getItem('userData'));
    console.log(this.userData);
  }

  draggable_Signature(id) {
    console.log(id)
    this.modalService.open(this.mymodal);
    //this.modelref.close();
    console.log("method working");
    localStorage.setItem('itemId',id);
  }

  saveImage(data) {
    let self= this;
    var reader = new FileReader();
    reader.readAsDataURL(data); 
    reader.onloadend = function() {
        var base64data = reader.result;                
        self.itemId = localStorage.getItem('itemId');
        if(self.itemId == 1){
          var xx = '.drag';
          var yy = '.remove';
          var aa = 'remove';
          self.signatureImage = data;
        }else{
          var xx = '.idrag';
          var yy = '.iremove';
          var aa = 'iremove';
          self.initialFile = data;
        }
        $(yy).remove();
        $(xx).css({"background-color": "transparent", "padding": 0});
        $(xx).append(`<img class="${aa}" style="height: 70px;width: 300px;" src="${base64data}">`);
    }
  }

  onFileSelected(event) {
    console.log("onFileSelected--->", event);
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  uploadSignature() {
    this.itemId = localStorage.getItem('itemId');

    /* if(this.uploadedFiles.length > 0){
      if(this.itemId == 1){
        this.uploadedFiles[0] = this.fileContent;
      }else{
        this.uploadedFiles[1] = this.fileContent;
      }
    }else{
      if(this.itemId == 1){
        this.uploadedFiles.push({
          'signature' : this.fileContent
        })
        this.uploadedFiles.push({
          'initial' : ''
        })
      }else{
        this.uploadedFiles.push({
          'signature' : ''
        })
        this.uploadedFiles.push({
          'initial' : this.fileContent
        })
      }
    } */

    /* if(!this.uploadedFiles.hasOwnProperty('signature')){
      this.uploadedFiles.push({
        'signature' : ''
      })
    }

    if(!this.uploadedFiles.hasOwnProperty('initial')){
      this.uploadedFiles.push({
        'initial' : ''
      })
    } */


    console.log("uploadSignature--->", this.fileContent);
    const reader = new FileReader();
    reader.onload = () => {
      console.log("res--->",reader.result );
      this.mainImage = reader.result as string;

      /* append image here */
      
      if(this.itemId == 1){
        var xx = '.drag';
        var yy = '.remove';
        var aa = 'remove';
        this.signatureImage = this.fileContent;
      }else{
        var xx = '.idrag';
        var yy = '.iremove';
        var aa = 'iremove';
        this.initialFile =  this.fileContent;
      }
      console.log("yy--->",yy);
      console.log("xx--->",xx);
      $(yy).remove();
      $(xx).css({"background-color": "transparent", "padding": 0});
      $(xx).append(`<img class="${aa}" style="height: 70px;width: 300px;" src="${this.mainImage}">`);

      console.log(this.uploadedFiles)
    }
    reader.readAsDataURL(this.fileContent);

  }

  /* generatePdf() {
    const filename  = 'Invoice.pdf';
		html2canvas(document.querySelector('#content'), {scale: 4}).then(canvas => {
			let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 200);
			pdf.save(filename);
		});
  } */

  updateSignature(){
    const formData = new FormData();
    formData.append('DocId', this.userDocId);
    formData.append('RecipientID', this.useRecId);
    formData.append('initialImage', this.initialFile);
    formData.append('signatureImage', this.signatureImage);

    console.log('formData--->', formData);

    this.services.sendRecipientFiles(formData).subscribe((resp) => {
      console.log('coordinats-->', resp);
      /* this.userData = resp.data[0].Recipients;
      console.log(this.userData); */
    })

    //console.log(finObj)
    //console.log(this.signatureImage)
  }

}
