import { Component, OnInit } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ServicesService } from '../services/services.service';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-add-fields',
  templateUrl: './add-fields.component.html',
  styleUrls: ['./add-fields.component.css']
})
export class AddFieldsComponent implements OnInit {
  viewSrc: string;
  closeResult: string;
  signatureImage;
  imageURL: string;

  mainImage: string;

  fileContent: any;
  userId: any;
  docID: string;
  doc: any;
  recpList: any;
  currentIndex: any;
  sendBtnHide: boolean = false;

  constructor(private modalService: NgbModal, private services: ServicesService) { }
  private modelref: NgbModalRef
  ngOnInit(): void {
    localStorage.removeItem('userData');
    // this.viewSrc = localStorage.getItem("PdfViewerSrc");

    // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/Roles-b81e.pdf";
    //console.log("srccccccc",this.viewSrc)
    this.userId = JSON.parse(localStorage.getItem('userDetails'))._id;
    this.docID = localStorage.getItem("docId");
    // console.log("dociiddddd",this.docID);
    this.getdrag();
    this.loadRecipientsList();
  }

  getdrag() {
    var sigcount = 1;
    var inicount = 1;
    $(function () {
      $("#sortable").sortable({
        revert: true
      });
      $(".draggable").draggable({
        containment: "parent",
        drag: function () {
          var offset = $(this).offset();

          //console.log("positions:", offset);
          var xPos = offset.left;
          var yPos = offset.top;
          $('#posX').text('x: ' + xPos);
          $('#posY').text('y: ' + yPos);
        }

      });


      $(".draggable1").draggable({
        connectToSortable: "#sortable",
        helper: "clone",
        revert: "invalid"
      });


      //$( ".one" ).draggable();

      //$( "ul, li" ).disableSelection();
    });
  }

  cloneSignature(user, index) {
    console.log('hello');

    this.sendBtnHide = true;
    if (!this.recpList[index].hasOwnProperty('signature')) {
      let temp = [
        {
          top: 0,
          left: 0
        }
      ];
      this.recpList[index]['signature'] = temp;
    } else {
      // console.log("recp list  have signature key");
      this.recpList[index]['signature'].push({
        top: 0,
        left: 0
      });
    }
    //console.log("rec list length", this.recpList[index]['positions'].length);

    $('.pdfViewerSection').prepend(`<div class="draggable2 drag-cls " style="display: inline; z-index:1; background: #ccccccba; padding: 10px 30px; border-radius: 5px; color: #fff; cursor: move; left:0px; top:0px;"
    id="drag_${index}_${this.recpList[index]['signature'].length}"
    >
    <p  class="ui-state-highlight" style="display: inline; color: #135699; font-weight: bold"><img style="height: 20px;" src="assets/images/sign.png">${user.Email}.${this.recpList[index]['signature'].length}</p></div>`);
    let self = this;
    $('.draggable2').draggable({
      containment: "parent",
      stop: function (event, ui) {
        console.log("draggable element id ", $(this).attr('id'));
        let [name, parentIndex, positionIndex] = $(this).attr('id').split("_");
        self.recpList[parentIndex]['signature'][positionIndex-1]['top'] = ui.position.top;
        self.recpList[parentIndex]['signature'][positionIndex-1]['left'] = ui.position.left;
        //console.log("recpList", self.recpList);
        localStorage.setItem('userData', JSON.stringify(self.recpList));
      }
    });
    //console.log("First");
    //console.log("recpList", self.recpList);
    localStorage.setItem('userData', JSON.stringify(self.recpList));
  }

  cloneIntial(user, index) {
    this.sendBtnHide = true;
    if (!this.recpList[index].hasOwnProperty('initial')) {
      let temp = [
        {
          top: 0,
          left: 0
        }
      ];
      this.recpList[index]['initial'] = temp;
    } else {
      // console.log("recp list  have signature key");
      this.recpList[index]['initial'].push({
        top: 0,
        left: 0
      });
    }

    $('.pdfViewerSection').prepend(`<div class="draggable3 drag-cls" style="display: inline; z-index:1; background: #ccccccba; padding: 10px 30px; border-radius: 5px; color: #fff; cursor: move" id="drag_${index}_${this.recpList[index]['initial'].length}"> <p  class="ui-state-highlight" style="display: inline; color: #135699;  font-weight: bold">${user.Name}</p></div>`);

    let self = this;
    $('.draggable3').draggable({
      containment: "parent",
      stop: function (event, ui) {
        let [name, parentIndex, positionIndex] = $(this).attr('id').split("_");
        self.recpList[parentIndex]['initial'][positionIndex-1]['top'] = ui.position.top;
        self.recpList[parentIndex]['initial'][positionIndex-1]['left'] = ui.position.left;
        //console.log("recpList", self.recpList);
        localStorage.setItem('userData', JSON.stringify(self.recpList));
      }
    });
    localStorage.setItem('userData', JSON.stringify(self.recpList));
  }

  loadRecipientsList() {

    let reqObj = {
      UserId: this.userId,
      DocId: this.docID
    }

    this.services.recipientsList(reqObj).subscribe((resp) => {
      //console.log("recpList resp-----", resp);
      this.recpList = resp.data.ReceiptsDetails[0].Receipts;
      //console.log("recpList- ", this.recpList)
      let docum = resp.data.DocDetails[0].Doc;
      //console.log("doccccccccc", docum);
      this.viewSrc = `http://15.207.202.132:7000/api/v1/documents/document/${docum}`;
    })
  }


  onPdfUpload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // this.viewSrc = "http://15.207.202.132:7000/api/v1/documents/document/57e98bd0-6fec-4379-b844-e2bc448ccefd-8ccd.pdf";
      // this.viewSrc = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  open(content, index) {
    //console.log("indexxxx", index);
    this.currentIndex = index;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed`;
    });
  }

  saveImage(data) {
    this.signatureImage = data;
    //console.log("Draw Signature image data--->", this.signatureImage);
    this.modelref.close();
  }

  onFileSelected(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileContent = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  uploadSignature() {
    //console.log('fileContent-->', this.fileContent);

    const reader = new FileReader();
    reader.onload = () => {
      this.mainImage = reader.result as string;
    }
    reader.readAsDataURL(this.fileContent);

    //console.log(this.mainImage);

  }

  updateCoordinates(){
    var  recepctData = JSON.stringify(localStorage.getItem('userData'));
    let object = {
      "UserId": this.userId,
      "DocId": this.docID,
      "Recipients": this.recpList
    }
    //console.log(object);
    this.services.insertDragObject(object).subscribe((resp) => {
      console.log("Final Coordiantes", resp);
      if(resp.statusCode == 200){
        alert('Coordinate send successfully.');
      }else{
        alert('Oops! Somthing went wrong.');
      }
    })
  }

}
