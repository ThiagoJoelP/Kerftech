/**
 * Calcula totales de un modulo dado sus piezas y herrajes.
 * @param {Array} piezas
 * @param {Array} herrajes - [{ materialId, cantidad }]
 * @param {{ ancho: number, alto: number }} dimensionesPlaca - de la placa seleccionada
 * @returns {{ m2Total, metrosCanto, herrajesAgrupados }}
 */
export function calcularModulo(piezas, herrajes, dimensionesPlaca) {
  // m2 de placa
  const m2Total = piezas.reduce((acc, p) => {
    const cant = Number(p.cantidad) || 0
    const ancho = Number(p.ancho) || 0
    const largo = Number(p.largo) || 0
    return acc + (cant * ancho * largo) / 1_000_000
  }, 0)

  // metros lineales de canto
  const metrosCanto = piezas.reduce((acc, p) => {
    const cant = Number(p.cantidad) || 0
    const ancho = Number(p.ancho) || 0
    const largo = Number(p.largo) || 0
    let lados = 0
    if (p.cantoArriba) lados += largo
    if (p.cantoAbajo) lados += largo
    if (p.cantoIzq) lados += ancho
    if (p.cantoDer) lados += ancho
    return acc + (cant * lados) / 1000
  }, 0)

  // m2 de la placa completa
  const m2Placa = dimensionesPlaca
    ? (Number(dimensionesPlaca.ancho) * Number(dimensionesPlaca.alto)) / 1_000_000
    : 0

  // placas necesarias (con 10% desperdicio)
  const placasNecesarias = m2Placa > 0
    ? Math.ceil((m2Total * 1.1) / m2Placa)
    : 0

  return {
    m2Total: Math.round(m2Total * 1000) / 1000,
    metrosCanto: Math.round(metrosCanto * 100) / 100,
    placasNecesarias,
  }
}

/**
 * Genera un ID unico simple para piezas/herrajes en el estado local.
 */
export function uid() {
  return Math.random().toString(36).slice(2, 9)
}
