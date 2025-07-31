// utils/printToPDF.ts
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const printToPDF = async (elementId: string, fileName = 'document.pdf') => {
  const content = document.getElementById(elementId);
  if (!content) return;

  const canvas = await html2canvas(content);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(fileName);
};
