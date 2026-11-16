import "server-only";
import { Resend } from "resend";
import { buildOrderRequestEmail, type OrderRequestEmailInput } from "./email";

const DEFAULT_FROM = "Maple Print Lab <orders@mapleprintlab.store>";

/**
 * Mails the request to the shop owner (reply-to: the customer). Never throws: the request is already saved,
 * so a mail failure is only logged. Without `RESEND_API_KEY` the mail is printed to the log (local development).
 */
export async function notifyOrderRequest(request: OrderRequestEmailInput): Promise<void> {
  const to = process.env.ORDER_NOTIFY_EMAIL;
  const mail = buildOrderRequestEmail(request);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || !to) {
    console.warn(`order-request: mail not sent (RESEND_API_KEY or ORDER_NOTIFY_EMAIL missing). Reply-To: ${request.email}\n${mail.subject}\n${mail.text}`);
    return;
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: process.env.ORDER_FROM_EMAIL || DEFAULT_FROM,
      to,
      replyTo: request.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) console.error("order-request: Resend rejected the mail", error);
  } catch (e) {
    console.error("order-request: sending the mail failed", e);
  }
}
