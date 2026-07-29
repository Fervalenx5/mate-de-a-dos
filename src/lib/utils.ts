import { CartItem } from '@/types/types';

// Format price in Argentine Pesos
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Generate WhatsApp message from cart
export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  name: string,
  phone: string,
  observations: string
): string {
  let message = `Hola, quiero hacer este pedido 🧉\n\n`;
  message += `*Productos:*\n`;

  items.forEach((item) => {
    const colorStr = item.selectedColor ? ` (${item.selectedColor.name})` : '';
    message += `• ${item.product.name}${colorStr} x${item.quantity}\n`;
  });

  message += `\n*Total: ${formatPrice(total)}*\n\n`;
  message += `Mi nombre es: ${name}\n`;
  message += `Mi teléfono es: ${phone}\n`;

  if (observations.trim()) {
    message += `\nObservaciones: ${observations}\n`;
  }

  return message;
}

// Generate WhatsApp URL
export function getWhatsAppURL(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Generate Instagram message (same as WhatsApp but without emoji encoding issues)
export function generateInstagramMessage(
  items: CartItem[],
  total: number,
  name: string,
  phone: string,
  observations: string
): string {
  let message = `Hola, quiero hacer este pedido 🧉\n\n`;
  message += `Productos:\n`;

  items.forEach((item) => {
    const colorStr = item.selectedColor ? ` (${item.selectedColor.name})` : '';
    message += `• ${item.product.name}${colorStr} x${item.quantity}\n`;
  });

  message += `\nTotal: ${formatPrice(total)}\n\n`;
  message += `Mi nombre es: ${name}\n`;
  message += `Mi teléfono es: ${phone}\n`;

  if (observations.trim()) {
    message += `\nObservaciones: ${observations}\n`;
  }

  return message;
}

// Debounce utility
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// cn utility for conditional classnames
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
