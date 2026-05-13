/**
 * Calcula el resumen de materiales de un proyecto.
 * Usa los precios snapshot guardados en cada item para preservar precios historicos.
 *
 * @param {Array} items - items del proyecto: { moduloSnap, cantidad, medidasCustom? }
 * @returns {{ lineas, totalMateriales }}
 */
export function calcularPresupuesto(items) {
  // Acumuladores por material
  const acum = {} // materialId -> { nombre, unidad, cantidad, precioUnitario }

  for (const item of items) {
    const { moduloSnap, cantidad: cantModulos } = item
    if (!moduloSnap) continue

    const piezas = moduloSnap.piezas ?? []
    const herrajes = moduloSnap.herrajes ?? []
    const dimPlaca = moduloSnap.dimensionesPlaca ?? null
    const placaId = moduloSnap.tipoPlacaId ?? null
    const placaSnap = moduloSnap.placaSnap ?? null

    // --- Placas ---
    if (placaId && placaSnap) {
      const m2Pieza = piezas.reduce((acc, p) => {
        return acc + (Number(p.cantidad) * Number(p.ancho) * Number(p.largo)) / 1_000_000
      }, 0)
      const m2Placa = dimPlaca
        ? (Number(dimPlaca.ancho) * Number(dimPlaca.alto)) / 1_000_000
        : 0
      const placasNecesarias = m2Placa > 0
        ? Math.ceil((m2Pieza * 1.1) / m2Placa)
        : 0
      const totalPlacas = placasNecesarias * cantModulos

      if (!acum[placaId]) {
        acum[placaId] = {
          nombre: placaSnap.nombre,
          unidad: 'placa',
          cantidad: 0,
          precioUnitario: placaSnap.precio,
        }
      }
      acum[placaId].cantidad += totalPlacas
    }

    // --- Canto ---
    const cantoId = moduloSnap.cantoId ?? null
    const cantoSnap = moduloSnap.cantoSnap ?? null
    if (cantoId && cantoSnap) {
      const metrosPieza = piezas.reduce((acc, p) => {
        const cant = Number(p.cantidad)
        const ancho = Number(p.ancho)
        const largo = Number(p.largo)
        let lados = 0
        if (p.cantoArriba) lados += largo
        if (p.cantoAbajo)  lados += largo
        if (p.cantoIzq)    lados += ancho
        if (p.cantoDer)    lados += ancho
        return acc + (cant * lados) / 1000
      }, 0)
      const totalMetros = metrosPieza * cantModulos

      if (!acum[cantoId]) {
        acum[cantoId] = {
          nombre: cantoSnap.nombre,
          unidad: 'metro',
          cantidad: 0,
          precioUnitario: cantoSnap.precio,
        }
      }
      acum[cantoId].cantidad += totalMetros
    }

    // --- Herrajes ---
    for (const h of herrajes) {
      const hSnap = h.snap ?? null
      if (!hSnap) continue
      const totalUnidades = Number(h.cantidad) * cantModulos

      if (!acum[h.materialId]) {
        acum[h.materialId] = {
          nombre: hSnap.nombre + (hSnap.descripcion ? ` - ${hSnap.descripcion}` : ''),
          unidad: hSnap.unidad,
          cantidad: 0,
          precioUnitario: hSnap.precio,
        }
      }
      acum[h.materialId].cantidad += totalUnidades
    }
  }

  const lineas = Object.entries(acum).map(([id, v]) => ({
    materialId: id,
    nombre: v.nombre,
    unidad: v.unidad,
    cantidad: Math.ceil(v.cantidad * 100) / 100,
    precioUnitario: v.precioUnitario,
    subtotal: Math.round(v.cantidad * v.precioUnitario),
  }))

  const totalMateriales = lineas.reduce((acc, l) => acc + l.subtotal, 0)

  return { lineas, totalMateriales }
}

export function calcularTotalFinal(totalMateriales, porcentajeGanancia, montoManoObra) {
  const ganancia = Math.round(totalMateriales * (Number(porcentajeGanancia) / 100))
  const mano = Math.round(Number(montoManoObra) || 0)
  return {
    totalMateriales,
    ganancia,
    manoObra: mano,
    totalFinal: totalMateriales + ganancia + mano,
  }
}
