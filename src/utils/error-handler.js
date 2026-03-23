// utils/error-handler.js
class AppError extends Error {
  constructor(message, code, statusCode = 500, userMessage = null) {
    super(message);
    this.code = code; // PDF_ERROR, AI_ERROR, PARSE_ERROR, NETWORK_ERROR, etc.
    this.statusCode = statusCode;
    this.userMessage = userMessage || message;
  }
}

// Función para manejar errores en componentes (muestra toast y loggea)
export const handleComponentError = (error, defaultMessage = 'Error inesperado') => {
  console.error('Error en componente:', error);

  // Determinar mensaje para usuario
  let userMessage = defaultMessage;
  if (error instanceof AppError) {
    userMessage = error.userMessage;
  } else if (error.message) {
    userMessage = error.message;
  }

  // Importar ModalAlert dinámicamente para evitar dependencias circulares
  import('../components/Toast').then(({ default: ModalAlert }) => {
    ModalAlert('error', userMessage);
  });
};

// Función para manejar errores en API routes
export const handleApiError = (error, NextResponse) => {
  console.error('Error en API route:', error);

  let statusCode = 500;
  let message = 'Error interno del servidor';
  let code = 'INTERNAL_ERROR';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.userMessage;
    code = error.code;
  } else if (error.message) {
    message = error.message;
  }

  return NextResponse.json({
    success: false,
    error: code,
    message
  }, { status: statusCode });
};

// Errores específicos comunes
export const ErrorCodes = {
  PDF_ERROR: 'PDF_ERROR',
  AI_ERROR: 'AI_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND'
};

export { AppError };