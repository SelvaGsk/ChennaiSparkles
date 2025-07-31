import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Reusable print utility
 * @param element - DOM element to print
 * @param title - PDF or print title
 */
export const printElement = async (element: HTMLElement, title = "Print Report") => {
  if (!element) return;

  const isMobile =  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  if (isMobile) {
    // ✅ Mobile: Generate PDF
    try {
      const clone = element.cloneNode(true) as HTMLElement;
      console.log("Mobile");

      // Remove Tailwind styles that use oklch
      clone.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("class");
        el.removeAttribute("style");
      });

      // Add base inline styles
      clone.style.padding = "20px";
      clone.style.backgroundColor = "#fff";
      clone.style.color = "#000";
      clone.style.fontFamily = "Arial, sans-serif";
      clone.style.fontSize = "14px";
      clone.style.width = "100%";

      // Apply safe inline styles to children
      clone.querySelectorAll("*").forEach((el) => {
        const elem = el as HTMLElement;
        elem.style.color = "#000";
        elem.style.backgroundColor = "#fff";
        elem.style.fontSize = "14px";
        elem.style.border = "1px solid #ccc";
        elem.style.padding = "4px";
        elem.style.boxSizing = "border-box";
      });

      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${title}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  } else {
    // ✅ Desktop: Use window.print()
    console.log("Desktop");
    const newWindow = window.open("", "_blank", "width=900,height=650");
    if (!newWindow) return;

    newWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 14px; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.onload = () => {
      newWindow.focus();
      setTimeout(() => {
        newWindow.print();
      }, 500);
    };
  }
};
