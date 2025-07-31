import * as functions from 'firebase-functions'; // for WhatsApp (v2 style)
import * as functionsV1 from 'firebase-functions/v1'; // for Realtime DB (v1 style)
import * as admin from 'firebase-admin';
import puppeteer from "puppeteer";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import corsLib from "cors";
import twilio from "twilio";
import dotenv from "dotenv";
import { https } from "firebase-functions";

const cors = corsLib({ origin: true });

// const token = functions.config().whatsapp.token;
// const phoneId = functions.config().whatsapp.phone_id;
// const ownerNumber = functions.config().whatsapp.owner;

dotenv.config();
admin.initializeApp();
const bucket = admin.storage().bucket();

interface WhatsAppPayload {
  customerNumber: string;
  message: string;
}

interface WhatsAppRequest {
  phone: string;
  templateId: string;
  templateParams: Record<string, string>;
  mediaUrl?: string;
}

interface SendWhatsAppRequest {
  to: string;
  message: string;
}

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

// Triggered when a new order is placed in Realtime Database
export const notifyAdminsOnOrder = functionsV1.database
  .ref('/CSC/CustomerOrder/{userId}/{orderId}') // ✅ corrected path
  .onCreate(async (snapshot, context) => {
    const orderData = snapshot.val();
    const orderId = context.params.orderId;
    console.log('Order Data:', JSON.stringify(orderData, null, 2));
    console.log(context);
    const customername = orderData?.custName || "Unknown";

    const message = {
      notification: {
        title: 'New Order Received',
        body: `Customer Name: ${customername}\nOrder ID: ${orderId} has been placed.`,
      },
      topic: 'admin',
    };

    try {
      await admin.messaging().send(message);
      console.log(`Notification sent for order: ${orderId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    return null;
  });

  export const generatePdf = functionsV1
  .runWith({ memory: "512MB", timeoutSeconds: 60 })
  .https.onCall(async (data, context) => {
    try {
      console.log("Incoming data:", data);
  
      const { html, fileName } = data;
  
      if (!html || !fileName) {
        console.error("Missing parameters:", { html, fileName});
        throw new functions.https.HttpsError("invalid-argument", "Missing html or fileName");
      }
  
      const browser = await require("puppeteer").launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
  
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });
  
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });
  
      await browser.close();
  
      const bucket = admin.storage().bucket();
      const file = bucket.file(`orders/${fileName}.pdf`);
      await file.save(pdfBuffer, {
        metadata: { contentType: "application/pdf" },
      });
      
      await file.makePublic(); // ✅ This makes it accessible via public URL
  
      const mediaUrl = `https://storage.googleapis.com/${bucket.name}/orders/${fileName}.pdf`;
  
      console.log("PDF uploaded and public:", mediaUrl);

      // const client = twilio(
      //   process.env.TWILIO_ACCOUNT_SID!,
      //   process.env.TWILIO_AUTH_TOKEN!
      // );
  
      // await client.messages.create({
      //   from: 'whatsapp:+15556468934', //`whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      //   to: `whatsapp:${phone}`,
      //   contentSid: 'HX185e28f40f2e20c013e24d33fe5aa50f', // Optional: use with conversations
      //   contentVariables: JSON.stringify({
      //     1: `${customer}`,  // if your template has variables
      //     2: `${orderid}`,
      //     3: `${fileName}`
      //   }),
      //   body: `🧾 Order copy for Order ID: ${fileName}`,
      // });
  
      return { success: true, mediaUrl };
    } catch (error: any) {
      console.error("🔥 PDF generation failed:", {
        message: error?.message,
        stack: error?.stack,
      });
      throw new functions.https.HttpsError("internal", "PDF generation failed");
    }
  });
  
  export const sendWhatsAppMessageOrderPlace = https.onCall(
    async (request: functions.https.CallableRequest<WhatsAppRequest>) => {
      const { phone, templateId, templateParams, mediaUrl } = request.data;
  
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
  
      const messagePayload: any = {
        from: 'whatsapp:+918939394643',
        to: `whatsapp:${phone}`,
        contentSid: templateId,
        contentVariables: JSON.stringify(templateParams),
      };
  
      if (mediaUrl) {
        messagePayload.mediaUrl = [mediaUrl];
      }
  
      try {
        const message = await client.messages.create(messagePayload);
        return { success: true, sid: message.sid };
      } catch (error: any) {
        console.error("WhatsApp Error:", error);
        return { success: false, error: error.message };
      }
    }
  );
  
  export const sendWhatsAppMessageOrderStatus = functions.https.onCall(
    async (request: functions.https.CallableRequest<WhatsAppRequest>) => {
      const { phone, templateId, templateParams } = request.data;
  
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
  
      const messagePayload = {
        from: "whatsapp:+918939394643", // your Twilio number
        to: `whatsapp:${phone}`,
        contentSid: templateId, // SID of 'order_payment_update' template
        contentVariables: JSON.stringify(templateParams),
      };
  
      try {
        const message = await client.messages.create(messagePayload);
        return { success: true, sid: message.sid };
      } catch (error: any) {
        console.error("WhatsApp Error:", error);
        return { success: false, error: error.message };
      }
    }
  );
  
  export const sendWhatsAppMessagePackedShipped = https.onCall(
    async (request: functions.https.CallableRequest<WhatsAppRequest>) => {
      const { phone, templateId, templateParams, mediaUrl } = request.data;
  
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID!,
        process.env.TWILIO_AUTH_TOKEN!
      );
  
      const messagePayload: any = {
        from: 'whatsapp:+918939394643',
        to: `whatsapp:${phone}`,
        contentSid: templateId,
        contentVariables: JSON.stringify(templateParams),
      };
  
      if (mediaUrl) {
        messagePayload.mediaUrl = [mediaUrl];
      }
  
      try {
        const message = await client.messages.create(messagePayload);
        return { success: true, sid: message.sid };
      } catch (error: any) {
        console.error("WhatsApp Error:", error);
        return { success: false, error: error.message };
      }
    }
  );

  export const sendWhatsApp = functions.https.onCall(
    async (request: functions.https.CallableRequest<SendWhatsAppRequest>) => {
      const { to, message } = request.data;
  
      if (!to || !message) {
        throw new functions.https.HttpsError("invalid-argument", "Missing phone or message");
      }
  
      try {
        const result = await client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE_NUMBER!,
          to: `whatsapp:${to}`,
        });
  
        return { success: true, sid: result.sid };
      } catch (error: any) {
        throw new functions.https.HttpsError("internal", error.message || "Unknown error");
      }
    }
  );
  
  
 