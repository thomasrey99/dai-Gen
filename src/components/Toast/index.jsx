import { addToast } from '@heroui/react';

export default function Toast(type = 'success', text = '') {
  return addToast({
    title: type === 'success' ? 'Listo!' : type === 'error' ? 'Hubo un error' : 'Alerta',
    description: text,
    color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning',
  });
}
