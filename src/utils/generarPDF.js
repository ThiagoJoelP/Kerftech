import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const COLOR_PRIMARY = [224, 123, 0]
const COLOR_DARK = [26, 29, 35]
const COLOR_MUTED = [107, 114, 128]
const COLOR_BORDER = [229, 231, 235]
const COLOR_BG = [249, 250, 251]
const COLOR_WHITE = [255, 255, 255]

const fmt = (n) => `$${Math.round(n).toLocaleString('es-AR')}

function addHeader(doc, config, pdfConfig) {
  const pageW = doc.internal.pageSize.getWidth()
  const margen = 18

  // Barra superior oscura
  doc.setFillColor(...COLOR_DARK)
  doc.rect(0, 0, pageW, 22, 'F')

  // Punto naranja decorativo
  doc.setFillColor(...COLOR_PRIMARY)
  doc.circle(margen, 11, 2.5, 'F')

  // Nombre del negocio
  const nombreNegocio = config?.nombreNegocio || 'Kerftech'
  doc.setTextColor(...COLOR_WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(nombreNegocio, margen + 6, 13)

  // Datos de contacto del lado derecho
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  let xRight = pageW - margen
  const contactLines = []

  if (pdfConfig?.mostrarTelefono && config?.telefono) contactLines.push(config.telefono)
  if (pdfConfig?.mostrarEmail && config?.email) contactLines.push(config.email)

  contactLines.forEach((line, i) => {
    doc.text(line, xRight, 9 + i * 7, { align: 'right' })
  })
}

function addFooter(doc, config) {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margen = 18

  doc.setDrawColor(...COLOR_BORDER)
  doc.setLineWidth(0.3)
  doc.line(margen, pageH - 18, pageW - margen, pageH - 18)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_MUTED)

  const nota = config?.notaPresupuesto || ''
  if (nota) {
    doc.text(nota, margen, pageH - 12, { maxWidth: pageW - margen * 2 })
  }

  doc.text(
    `Pag. ${doc.internal.getCurrentPageInfo().pageNumber}`,
    pageW - margen,
    pageH - 12,
    { align: 'right' }
  )
}

export function generarPDF(proyecto, config, pdfConfig, lineas, totales) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margen = 18
  let y = 30

  addHeader(doc, config, pdfConfig)

  // ── TITULO PRESUPUESTO ──────────────────────────────
  y = 32
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(...COLOR_DARK)
  doc.text('PRESUPUESTO', margen, y)

  // Numero de proyecto (ID corto)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...COLOR_MUTED)
  const fecha = new Date().toLocaleDateString('es-AR')
  doc.text(`Fecha: ${fecha}`, pageW - margen, y, { align: 'right' })

  y += 10
  doc.setDrawColor(...COLOR_PRIMARY)
  doc.setLineWidth(0.8)
  doc.line(margen, y, pageW - margen, y)
  y += 8

  // ── DATOS DEL PROYECTO Y CLIENTE ────────────────────
  const colW = (pageW - margen * 2) / 2

  // Columna izq: proyecto
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('PROYECTO', margen, y)
  y += 5
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...COLOR_DARK)
  doc.text(proyecto.nombre, margen, y)
  y += 5

  if (proyecto.notas) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(...COLOR_MUTED)
    const lines = doc.splitTextToSize(proyecto.notas, colW - 4)
    doc.text(lines, margen, y)
    y += lines.length * 4
  }

  // Columna der: cliente
  if (pdfConfig?.mostrarCliente && proyecto.cliente) {
    let yCliente = y - (proyecto.notas ? (doc.splitTextToSize(proyecto.notas, colW - 4).length * 4 + 5) : 5)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(...COLOR_MUTED)
    doc.text('CLIENTE', margen + colW, yCliente)
    yCliente += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...COLOR_DARK)
    doc.text(proyecto.cliente, margen + colW, yCliente)
  }

  y += 6

  // ── MODULOS ─────────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('MODULOS INCLUIDOS', margen, y)
  y += 4

  const modulosRows = (proyecto.items || []).map((item) => [
    item.moduloSnap?.nombre || '-',
    item.moduloSnap?.categoria || '-',
    item.moduloSnap?.tipo || '-',
    item.cantidad,
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: margen, right: margen },
    head: [['Modulo', 'Categoria', 'Tipo', 'Cant.']],
    body: modulosRows,
    styles: { fontSize: 8.5, cellPadding: 3, textColor: COLOR_DARK },
    headStyles: {
      fillColor: COLOR_DARK,
      textColor: COLOR_WHITE,
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: COLOR_BG },
    columnStyles: { 3: { halign: 'center', cellWidth: 20 } },
  })

  y = doc.lastAutoTable.finalY + 10

  // ── MATERIALES ───────────────────────────────────────
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('DETALLE DE MATERIALES', margen, y)
  y += 4

  const materialesRows = lineas.map((l) => [
    l.nombre,
    `${l.cantidad} ${l.unidad}${l.cantidad !== 1 ? 's' : ''}`,
    fmt(l.precioUnitario),
    fmt(l.subtotal),
  ])

  autoTable(doc, {
    startY: y,
    margin: { left: margen, right: margen },
    head: [['Material', 'Cantidad', 'Precio unitario', 'Subtotal']],
    body: materialesRows,
    styles: { fontSize: 8.5, cellPadding: 3, textColor: COLOR_DARK },
    headStyles: {
      fillColor: COLOR_DARK,
      textColor: COLOR_WHITE,
      fontStyle: 'bold',
      fontSize: 7.5,
    },
    alternateRowStyles: { fillColor: COLOR_BG },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'right', fontStyle: 'bold' },
    },
  })

  y = doc.lastAutoTable.finalY + 8

  // ── TOTALES ──────────────────────────────────────────
  const totalBoxW = 80
  const totalBoxX = pageW - margen - totalBoxW

  // Si no entra en la pagina, nueva pagina
  if (y + 40 > doc.internal.pageSize.getHeight() - 25) {
    doc.addPage()
    addHeader(doc, config, pdfConfig)
    y = 32
  }

  // Fila total materiales
  doc.setFillColor(...COLOR_BG)
  doc.roundedRect(totalBoxX, y, totalBoxW, 9, 1, 1, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...COLOR_MUTED)
  doc.text('Total materiales', totalBoxX + 4, y + 6)
  doc.setTextColor(...COLOR_DARK)
  doc.text(fmt(totales.totalMateriales), pageW - margen - 2, y + 6, { align: 'right' })
  y += 11

  if (totales.ganancia > 0) {
    doc.setFillColor(...COLOR_BG)
    doc.roundedRect(totalBoxX, y, totalBoxW, 9, 1, 1, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLOR_MUTED)
    doc.text('Ganancia', totalBoxX + 4, y + 6)
    doc.setTextColor(...COLOR_DARK)
    doc.text(fmt(totales.ganancia), pageW - margen - 2, y + 6, { align: 'right' })
    y += 11
  }

  if (totales.manoObra > 0) {
    doc.setFillColor(...COLOR_BG)
    doc.roundedRect(totalBoxX, y, totalBoxW, 9, 1, 1, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...COLOR_MUTED)
    doc.text('Mano de obra', totalBoxX + 4, y + 6)
    doc.setTextColor(...COLOR_DARK)
    doc.text(fmt(totales.manoObra), pageW - margen - 2, y + 6, { align: 'right' })
    y += 11
  }

  // Total final destacado
  doc.setFillColor(...COLOR_PRIMARY)
  doc.roundedRect(totalBoxX, y, totalBoxW, 11, 1.5, 1.5, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(...COLOR_WHITE)
  doc.text('TOTAL FINAL', totalBoxX + 4, y + 7.5)
  doc.setFontSize(10)
  doc.text(fmt(totales.totalFinal), pageW - margen - 2, y + 7.5, { align: 'right' })

  // Footer en cada pagina
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    addFooter(doc, config)
  }

  // Descargar
  const nombreArchivo = `Presupuesto_${proyecto.nombre.replace(/\s+/g, '_')}_${fecha.replace(/\//g, '-')}.pdf`
  doc.save(nombreArchivo)
}
