import { Injectable } from "@angular/core";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
@Injectable()
export class PDFService {
  printPDF(tableReference, fileName = "record") {
    html2canvas(tableReference, { scale: 5 }).then((canvas) => {
      console.log(canvas.width);
      let imgData = canvas.toDataURL();
      let pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "JPG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}.pdf`);
    });
  }
}
