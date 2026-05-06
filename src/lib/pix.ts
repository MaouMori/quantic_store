const sanitize = (value: string, maxLength: number) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 $%*+\-./:]/g, '')
    .slice(0, maxLength)

const field = (id: string, value: string) => `${id}${value.length.toString().padStart(2, '0')}${value}`

const crc16 = (payload: string) => {
  let crc = 0xffff
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export const createPixPayload = ({
  key,
  name,
  city,
  amount,
  txid,
}: {
  key: string
  name: string
  city: string
  amount: number
  txid: string
}) => {
  const merchantAccount = field('00', 'br.gov.bcb.pix') + field('01', key.trim())
  const txidPayload = field('05', sanitize(txid, 25) || 'QUANTIC')
  const payloadWithoutCrc = [
    field('00', '01'),
    field('26', merchantAccount),
    field('52', '0000'),
    field('53', '986'),
    field('54', amount.toFixed(2)),
    field('58', 'BR'),
    field('59', sanitize(name || 'QUANTIC STORE', 25)),
    field('60', sanitize(city || 'SAO PAULO', 15)),
    field('62', txidPayload),
    '6304',
  ].join('')

  return `${payloadWithoutCrc}${crc16(payloadWithoutCrc)}`
}
