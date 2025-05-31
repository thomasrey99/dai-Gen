import { addToast } from '@heroui/react';
import 'sweetalert2/dist/sweetalert2.min.css';

export default async function ModalAlert(type = 'success', text = '') {
  return await addToast({
    title: type === 'success' ? 'Listo!' : type === 'error' ? 'Hubo un error' : 'Alerta',
    description: text,
    color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning',
  });
}
