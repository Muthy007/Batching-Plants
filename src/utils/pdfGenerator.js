import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const numberToWords = (num) => {
  if (num === 0) return "Zero Rupees Only";
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if ((num = num.toString()).length > 9) return 'overflow';
  const n = ('000000000' + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return ''; 
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees Only' : 'Rupees Only';
  return str;
};

export const generateInvoicePdf = async (details, title = "TAX INVOICE") => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 Size Portrait

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const drawText = (text, x, y, size, font = fontNormal, opts = {}) => {
    if (!text) return;
    page.drawText(String(text), { x, y, size, font, color: rgb(0, 0, 0), ...opts });
  };

  const drawLine = (x1, y1, x2, y2, thickness = 1) => {
    page.drawLine({
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      thickness,
      color: rgb(0, 0, 0),
    });
  };

  // Outer Border
  const mg = 30; // margin
  const width = 595.28 - mg * 2;
  const height = 841.89 - mg * 2;
  
  page.drawRectangle({
    x: mg, y: mg, width, height,
    borderColor: rgb(0,0,0),
    borderWidth: 1,
  });

  // Calculate coordinates starting from top down
  const topY = 841.89 - mg;
  let curY = topY;

  // Title Box
  curY -= 25;
  const titleWidth = fontBold.widthOfTextAtSize(title, 14);
  drawText(title, mg + (width - titleWidth) / 2, curY + 8, 14, fontBold);
  drawLine(mg, curY, mg + width, curY);

  // Upper section splits: Left (50%), Middle (25%), Right (25%)
  const col1X = mg;
  const col2X = mg + width * 0.5;
  const col3X = mg + width * 0.75;
  
  const sec1BottomY = curY - 90;
  drawLine(mg, sec1BottomY, mg + width, sec1BottomY);
  drawLine(col2X, curY, col2X, sec1BottomY);
  drawLine(col3X, curY, col3X, sec1BottomY);

  // Company Details
  drawText(details.cName || "", col1X + 5, curY - 15, 12, fontBold);
  drawText("Address", col1X + 5, curY - 30, 8, fontNormal, { color: rgb(0.4, 0.4, 0.4) });
  drawText(details.cAddress || "", col1X + 5, curY - 42, 9, fontNormal); // might overflow if too long, kept simple
  drawText(`GSTIN : ${details.cGst || ""}`, col1X + 5, curY - 75, 10, fontBold);

  // Invoice Details
  drawText("Invoice Number", col2X + 5, curY - 15, 9, fontNormal);
  drawText(details.invNo || "", col2X + 5, curY - 30, 10, fontBold);

  drawText("Invoice date", col3X + 5, curY - 15, 9, fontNormal);
  drawText(details.invDate || "", col3X + 5, curY - 30, 10, fontBold);

  // Next Horizontal Box (Vehicle, Driver, Buyer Order Date)
  curY = sec1BottomY;
  const sec2BottomY = curY - 35;
  drawLine(mg, sec2BottomY, mg + width, sec2BottomY);
  drawLine(col2X, curY, col2X, sec2BottomY); // Only divides Left and Middle+Right? The original template has 1.5, 1, 1 width ratio. Let's adapt.
  drawLine(col3X, curY, col3X, sec2BottomY);

  drawText("Vehicle No", col1X + 5, curY - 12, 8, fontNormal, { color: rgb(0.4, 0.4, 0.4) });
  drawText(details.vehNo || "", col1X + 5, curY - 26, 10, fontNormal);
  
  drawText("Driver", col1X + 130, curY - 12, 8, fontNormal, { color: rgb(0.4, 0.4, 0.4) });
  drawText(details.driver || "", col1X + 130, curY - 26, 10, fontNormal);

  drawText("Buyer Order Date", col3X + 5, curY - 12, 9, fontNormal);
  drawText(details.delDate || "", col3X + 5, curY - 26, 10, fontBold);

  // Custom/Consignee Info
  curY = sec2BottomY;
  const sec3BottomY = curY - 110;
  drawLine(mg, sec3BottomY, mg + width, sec3BottomY);
  drawLine(col2X, curY, col2X, sec3BottomY);

  drawText("Buyer:", col1X + 5, curY - 15, 10, fontBold);
  drawText(details.custCompany || "", col1X + 5, curY - 30, 10, fontBold);
  drawText("Address", col1X + 5, curY - 45, 8, fontNormal, { color: rgb(0.4, 0.4, 0.4) });
  drawText(details.custAddress || "", col1X + 5, curY - 57, 9, fontNormal);
  drawText(`GST IN:- ${details.custGst || ""}`, col1X + 5, curY - 95, 10, fontBold);

  drawText("Consignee:", col2X + 5, curY - 15, 10, fontBold);
  drawText(details.consigneeName || "", col2X + 5, curY - 30, 10, fontBold);
  drawText("Address", col2X + 5, curY - 45, 8, fontNormal, { color: rgb(0.4, 0.4, 0.4) });
  drawText(details.consigneeAddress || "", col2X + 5, curY - 57, 9, fontNormal);

  // Table Headers
  curY = sec3BottomY;
  const tableHeaderBottom = curY - 25;
  drawLine(mg, tableHeaderBottom, mg + width, tableHeaderBottom);

  const tCols = [
    mg,                   // SI no
    mg + 35,              // Description
    mg + 270,             // HSN/SAC
    mg + 330,             // RATE
    mg + 390,             // PER
    mg + 440,             // QTY
    mg + 490,             // AMOUNT
    mg + width            // Right Bound
  ];

  // Draw table vertical lines down to total row
  const tableBottom = curY - 280; 
  for(let x of tCols) {
    if(x !== mg && x !== mg + width) {
       drawLine(x, curY, x, tableBottom);
    }
  }

  const thLabels = ["SI no", "DESCRIPTION", "HSN/SAC", "RATE", "PER", "QTY", "AMOUNT"];
  for (let i = 0; i < thLabels.length; i++) {
    const colWidth = tCols[i+1] - tCols[i];
    const textWidth = fontBold.widthOfTextAtSize(thLabels[i], 9);
    drawText(thLabels[i], tCols[i] + (colWidth - textWidth)/2, curY - 16, 9, fontBold);
  }

  // Row 1 item
  curY = tableHeaderBottom;
  drawText("1", tCols[0] + 12, curY - 18, 10, fontNormal);
  drawText(`Ready Mix Concrete (${details.grade || "M25"})`, tCols[1] + 5, curY - 18, 10, fontBold);
  
  const vHsn = String(details.hsn || "");
  const vRate = parseFloat(details.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const vPer = String(details.per || "MCUBE");
  const vQty = parseFloat(details.qty || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  const subtotalNum = (parseFloat(details.rate || 0) * parseFloat(details.qty || 0));
  const vAmount = subtotalNum.toLocaleString('en-IN', { minimumFractionDigits: 2 });

  drawText(vHsn, tCols[2] + (tCols[3]-tCols[2]-fontNormal.widthOfTextAtSize(vHsn, 10))/2, curY-18, 10, fontNormal);
  drawText(vRate, tCols[4] - fontNormal.widthOfTextAtSize(vRate, 10) - 5, curY-18, 10, fontNormal);
  drawText(vPer, tCols[4] + (tCols[5]-tCols[4]-fontNormal.widthOfTextAtSize(vPer, 10))/2, curY-18, 10, fontNormal);
  drawText(vQty, tCols[5] + (tCols[6]-tCols[5]-fontNormal.widthOfTextAtSize(vQty, 10))/2, curY-18, 10, fontNormal);
  drawText(vAmount, tCols[7] - fontBold.widthOfTextAtSize(vAmount, 10) - 5, curY-18, 10, fontBold);

  // Subtotal/GST row (bottom of table)
  curY = tableBottom + 25; // inside the table
  drawLine(mg, curY, mg + width, curY, 1.5);
  // Redraw vertical lines over this thick line to keep grid look
  for(let x of tCols) {
    if(x !== mg && x !== mg + width) drawLine(x, curY, x, curY - 25);
  }
  
  const gstRowDesc = "IGST Output 18%";
  drawText(gstRowDesc, tCols[2] - fontBold.widthOfTextAtSize(gstRowDesc, 10) - 5, curY - 16, 10, fontItalic);
  const gstAmountNum = parseFloat(details.gstAmount !== undefined && details.gstAmount !== null ? details.gstAmount : (subtotalNum * 18 / 100));
  const vGst = gstAmountNum.toLocaleString('en-IN', { minimumFractionDigits: 2 });
  drawText(vGst, tCols[7] - fontBold.widthOfTextAtSize(vGst, 10) - 5, curY - 16, 10, fontBold);

  // Total Row
  curY -= 25;
  drawLine(mg, curY, mg + width, curY, 1.5);
  const vFinalAmt = (subtotalNum + gstAmountNum).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  
  // Fill background of total row
  page.drawRectangle({
    x: mg + 1, y: curY - 25 + 1,
    width: width - 2, height: 23,
    color: rgb(0.95, 0.95, 0.95)
  });
  drawLine(mg, curY - 25, mg + width, curY - 25, 1.5);
  drawLine(tCols[6], curY, tCols[6], curY - 25);
  
  drawText("Total", tCols[6] - fontBold.widthOfTextAtSize("Total", 11) - 5, curY - 16, 11, fontBold);
  drawText(vFinalAmt, tCols[7] - fontBold.widthOfTextAtSize(vFinalAmt, 11) - 5, curY - 16, 11, fontBold);

  // Bottom Section: Words & Declaration
  curY -= 25;
  const bottomBorderY = mg + 20; 
  drawLine(mg, bottomBorderY, mg + width, bottomBorderY);
  drawLine(mg + width * 0.7, curY, mg + width * 0.7, bottomBorderY);

  const wordStr = numberToWords(Math.round(subtotalNum + gstAmountNum));
  drawText("Amount in words", mg + 5, curY - 15, 10, fontBold);
  drawText(`INR:- ${wordStr}`, mg + 5, curY - 30, 11, fontBold);

  drawText("Declaration:", mg + 5, curY - 60, 10, fontBold);
  drawText("We declare that this invoice shows the actual price of the goods described", mg + 5, curY - 72, 8, fontNormal);
  drawText("and that all particulars are true and correct.", mg + 5, curY - 82, 8, fontNormal);

  drawText(`For, ${details.cName || ""}`, mg + width * 0.7 + 5, curY - 15, 8, fontNormal);
  drawText("Authorised Signatory", mg + width - fontBold.widthOfTextAtSize("Authorised Signatory", 9) - 5, bottomBorderY + 10, 9, fontBold);

  drawText("THIS IS COMPUTER GENERATED INVOICE", mg + (width - fontBold.widthOfTextAtSize("THIS IS COMPUTER GENERATED INVOICE", 8))/2, mg + 6, 8, fontBold);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
