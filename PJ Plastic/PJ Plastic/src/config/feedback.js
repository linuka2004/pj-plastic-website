// Configure your Google Form endpoint and field entry IDs here.
// How to set up:
// 1) Create a Google Form with fields: Name, Email, Phone (optional), Message.
// 2) In the form, open the "Get pre-filled link" and inspect the generated URL to find each entry.<ID> for your inputs.
// 3) Set GOOGLE_FORM_ACTION to your form's formResponse URL (not form, but formResponse), like:
//    https://docs.google.com/forms/u/0/d/e/FORM_ID/formResponse
// 4) Map each field below to the correct entry.<ID> from your form.
// 5) In Google Forms, link responses to a Google Sheet (Responses tab -> Link to Sheets). That Sheet lives in your Google Drive.

export const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/u/0/d/e/REPLACE_FORM_ID/formResponse";

export const GOOGLE_FORM_FIELDS = {
  name: "entry.REPLACE_NAME_ID",
  email: "entry.REPLACE_EMAIL_ID",
  phone: "entry.REPLACE_PHONE_ID", // optional; leave blank string if not used
  message: "entry.REPLACE_MESSAGE_ID",
};
