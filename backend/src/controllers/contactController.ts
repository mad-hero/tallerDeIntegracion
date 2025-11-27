import { Response } from 'express';
import { CustomError } from '../middleware/errorHandler';
import {
  sendContactFormToAdmin,
  sendContactFormConfirmation,
} from '../services/emailService';

export interface ContactFormRequest {
  type: 'quote' | 'pickup' | 'training' | 'general';
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  address?: string;
  numberOfParticipants?: number;
}

/**
 * Submit contact form
 */
export async function submitContactForm(req: any, res: Response): Promise<void> {
  try {
    const {
      type,
      name,
      email,
      phone,
      company,
      message,
      preferredDate,
      preferredTime,
      address,
      numberOfParticipants,
    } = req.body;

    // Validate required fields
    if (!type || !name || !email || !phone || !message) {
      throw new CustomError(
        'Tipo de solicitud, nombre, email, teléfono y mensaje son requeridos',
        400
      );
    }

    // Validate type
    if (!['quote', 'pickup', 'training', 'general'].includes(type)) {
      throw new CustomError('Tipo de solicitud inválido', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new CustomError('Email inválido', 400);
    }

    // Validate phone format (Chilean format)
    const phoneRegex = /^(\+56\s?)?[9]\s?\d{4}\s?\d{4}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      throw new CustomError(
        'Teléfono inválido. Debe ser un número chileno válido (ej: +56 9 1234 5678)',
        400
      );
    }

    // Type-specific validations
    if (type === 'pickup' && !address) {
      throw new CustomError('Dirección es requerida para agendar retiros', 400);
    }

    if (type === 'training' && !numberOfParticipants) {
      throw new CustomError(
        'Número de participantes es requerido para capacitaciones',
        400
      );
    }

    // Send emails
    await Promise.all([
      sendContactFormToAdmin({
        type,
        name,
        email,
        phone,
        company: company || '',
        message,
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        address: address || '',
        numberOfParticipants: numberOfParticipants || 0,
      }),
      sendContactFormConfirmation({
        type,
        name,
        email,
        message,
      }),
    ]);

    res.json({
      message: 'Solicitud enviada exitosamente. Te contactaremos pronto.',
      email: email,
    });
  } catch (error: any) {
    if (error instanceof CustomError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      console.error('Contact form submission error:', error);
      res.status(500).json({ error: 'Error al enviar solicitud' });
    }
  }
}

