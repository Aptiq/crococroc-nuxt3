export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const format = getQuery(event).format || 'pdf'

  const analysis = await prisma.analysis.findUnique({
    where: { id },
    include: { material: true }
  })

  switch (format) {
    case 'pdf':
      return generatePDFReport(analysis)
    case 'excel':
      return generateExcelReport(analysis)
    case 'json':
      return analysis
    default:
      throw new Error('Format non supporté')
  }
}) 