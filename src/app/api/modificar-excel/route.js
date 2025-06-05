import XlsxPopulate from 'xlsx-populate';
import path from 'path';

export async function POST(req) {
  try {
    const data = await req.json();
    const filePath = path.join(process.cwd(), 'public', 'planilla visualizador.xlsx');

    // Cargo el archivo base
    const workbook = await XlsxPopulate.fromFileAsync(filePath);

    // Obtengo la hoja DETALLE
    const sheet = workbook.sheet('DETALLE');

    // Actualizo celdas con los valores (igual que antes)
    sheet.cell('A2').value(data?.typeOfIntervention).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B2').value(data?.number).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B3').value(data?.area).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B5').value(data?.eventDate).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D5').value(data?.callTime).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B6').value(data?.direction).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B7').value(data?.modalitie).style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B8').value(data?.interveningJustice?.justice || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C8').value(data?.interveningJustice?.fiscal || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D8').value(data?.interveningJustice?.secretariat || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B9').value(data?.jurisdiction || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B14').value(data?.operator || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B15').value(data?.intervener || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B12').value(data?.colaborationFirm?.colabFirmHierarchy || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C12').value(data?.colaborationFirm?.colabFirmLp || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D12').value(data?.colaborationFirm?.colabFirmNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('E12').value(data?.colaborationFirm?.colabFirmLastNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B13').value(data?.colaborationWatch?.colabWatchHierarchy || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('C13').value(data?.colaborationWatch?.colabWatchLp || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D13').value(data?.colaborationWatch?.colabWatchNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('E13').value(data?.colaborationWatch?.colabWatchLastNames || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('B10').value(data?.cover || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    sheet.cell('D10').value(data?.summaryNum || '').style({ fontFamily: 'Calibri', bold: true, border: true });
    console.log(data)
    // Fórmulas
    sheet.cell('C9').formula('IF(ISNUMBER(FIND("COMISARIA VECINAL", B9)), SUBSTITUTE(MID(B9, FIND("VECINAL", B9) + 8, 10), " ANEXO", ""), "")');
    sheet.cell('D9').formula('IF(C9<>"", MID(C9, 1, LEN(C9)-1), "")');
    sheet.cell('B27')
      .formula(
        '="Fuente: "&A2&" "&B2&CHAR(10)&' +
        '"Hecho: "&B7&CHAR(10)&' +
        '"Magistrado: "&B8&CHAR(10)&' +
        '"Dependencia: "&B9&CHAR(10)&' +
        '"Fecha del hecho: "&B5&"            Horario: "&D5&CHAR(10)&' +
        '"Dirección: "&B6&CHAR(10)&' +
        '"Vehiculo Damnificado:  Marca: xxxxxx Modelo: xxxxxx Color: xxxxxx Chapa Patente: xxxxxxx .-"&CHAR(10)&' +
        '"DNI Damnificado(sin puntos):"&CHAR(10)&' +
        '"Nombre y Apellido Damnificado/s: "'
      )
      .style({ wrapText: true });





    // Reseña sin formato extra
    sheet.cell('B28').value(data?.review || '');

    // Generar buffer del archivo modificado
    const buffer = await workbook.outputAsync();

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=PLANILLA_DE_VISUALIZACION.xlsx',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('❌ Error al generar Excel:', error);
    return new Response(JSON.stringify({ error: 'Error al generar Excel' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
