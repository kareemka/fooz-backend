import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TelegramService {
    private readonly logger = new Logger(TelegramService.name);
    private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
    private readonly chatId = process.env.GROUP_CHAT_ID;

    async sendOrderNotification(order: any) {
        if (!this.botToken || !this.chatId) {
            this.logger.warn('Telegram Bot Token or Group Chat ID is missing. Notification not sent.');
            return;
        }

        const message = this.formatOrderMessage(order);

        try {
            const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text: message,
                    parse_mode: 'HTML',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                this.logger.error(`Failed to send Telegram notification: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            this.logger.error(`Error sending Telegram notification: ${error.message}`);
        }
    }

    private formatOrderMessage(order: any): string {
        const itemsList = order.items
            .map((item: any) => {
                const productName = item.product?.name || 'منتج';
                let itemDetails = `▫️ <b>${productName}</b> (x${item.quantity})`;

                const details = [];

                // Add size info
                if (item.sizeName) {
                    let sizeText = `المقاس: ${item.sizeName}`;
                    if (item.sizeDimensions) {
                        sizeText += ` (${item.sizeDimensions})`;
                    }
                    details.push(sizeText);
                }

                // Add color info
                if (item.surfaceColorName) details.push(`السطح: ${item.surfaceColorName}`);
                if (item.edgeColorName) details.push(`الحافة: ${item.edgeColorName}`);

                if (details.length > 0) {
                    itemDetails += `\n    ${details.join(' | ')}`;
                }

                if (item.accessories && item.accessories.length > 0) {
                    const accs = item.accessories.map((a: any) => a.name).join(', ');
                    itemDetails += `\n    الإضافات: ${accs}`;
                }

                return itemDetails;
            })
            .join('\n\n');

        const formatPrice = (price: number) => price.toLocaleString('en-US');

        const subtotal = order.totalAmount + order.discountAmount;
        const hasDiscount = order.discountAmount > 0;

        let priceSection = `💰 <b>الإجمالي:</b> ${formatPrice(order.totalAmount)} د.ع`;

        if (hasDiscount) {
            priceSection = `
💵 <b>المجموع الفرعي:</b> ${formatPrice(subtotal)} د.ع
🧧 <b>قيمة الخصم:</b> ${formatPrice(order.discountAmount)} د.ع
🎫 <b>الكوبون:</b> ${order.couponCode}
✨ <b>السعر النهائي:</b> ${formatPrice(order.totalAmount)} د.ع
      `.trim();
        }

        return `
🚀 <b>طلب جديد!</b>

🆔 <b>رقم الطلب:</b> <code>${order.orderNumber}</code>
👤 <b>العميل:</b> ${order.customerName}
📞 <b>الهاتف:</b> ${order.customerPhone}
📍 <b>العنوان:</b> ${order.shippingAddress}

📦 <b>المنتجات:</b>
${itemsList}

${priceSection}

⏰ <b>وقت الطلب:</b> ${new Date(order.createdAt).toLocaleString('ar-EG')}
    `.trim();
    }
}
