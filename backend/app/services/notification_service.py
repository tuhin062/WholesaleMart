"""
Mock notification service for WhatsApp messages
Simulates sending notifications without external APIs
"""
import logging

logger = logging.getLogger(__name__)


def send_whatsapp_notification(phone_number: str, message: str) -> bool:
    """
    Simulate WhatsApp notification
    In production, this would integrate with Twilio or similar service
    
    Args:
        phone_number: Recipient phone number
        message: Message to send
    Returns:
        True if successful (always true in simulation)
    """
    logger.info(f"📱 WhatsApp → {phone_number}: {message}")
    print(f"\n{'='*60}")
    print(f"📱 WhatsApp Notification (Simulated)")
    print(f"To: {phone_number}")
    print(f"Message: {message}")
    print(f"{'='*60}\n")
    return True


def send_otp(phone_number: str) -> str:
    """
    Simulate OTP generation and sending
    Returns hardcoded OTP for demo purposes
    
    Args:
        phone_number: Recipient phone number
    Returns:
        OTP code (always "1234" for demo)
    """
    otp = "1234"
    message = f"Your WholesaleMart OTP is: {otp}. Valid for 10 minutes."
    send_whatsapp_notification(phone_number, message)
    return otp


def notify_order_created(phone_number: str, order_id: int, total_amount: float):
    """Notify customer of new order creation"""
    message = f"Order #{order_id} confirmed! Total: ₹{total_amount:.2f}. Thank you for your purchase!"
    send_whatsapp_notification(phone_number, message)


def notify_order_status_update(phone_number: str, order_id: int, status: str):
    """Notify customer of order status change"""
    status_messages = {
        "confirmed": f"Order #{order_id} has been confirmed and is being processed.",
        "delivered": f"Order #{order_id} has been delivered. Thank you!"
    }
    message = status_messages.get(status, f"Order #{order_id} status updated to: {status}")
    send_whatsapp_notification(phone_number, message)
