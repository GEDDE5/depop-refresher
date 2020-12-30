const converter = require('number-to-words')
const currencyFormatter = require('currency-formatter')

const { version, homepage } = require('../../package.json')

const footerText = `• ${homepage.split('://')[1]} • v${version}`

module.exports = ({ user = {}, products = [], numSuccessfullyRefreshed }) => {
  const { available, sold } = products.reduce(
    (acc, x) =>
      x.sold === true
        ? { ...acc, sold: [...acc.sold, x] }
        : {
            ...acc,
            available: [...acc.available, x],
          },
    { available: [], sold: [] }
  )

  const outsandingEarnings = currencyFormatter.format(
    // Sums $$ of available products
    available.reduce(
      (acc, { price: { price_amount: $ } }) => acc + Number($),
      0
    ),
    // Used to format the ouputted #
    { code: 'CAD' }
  )

  const earnings = currencyFormatter.format(
    // Sums $$ of available products
    sold.reduce((acc, { price: { price_amount: $ } }) => acc + Number($), 0),
    // Used to format the ouputted #
    { code: 'CAD' }
  )

  const title = `SUCCESSFULLY REFRESHED __${converter
    .toWords(numSuccessfullyRefreshed)
    .toUpperCase()}__ PRODUCTS`

  const description = `
  💰💴💸

Products available: **${available.length} (${outsandingEarnings})**
Products sold: **${sold.length} (${earnings})**
Total products: **${products.length}**
`
  const color = 4444928
  const author = {
    name: `@${user.username}`,
    url: `https://www.depop.com/${user.username}`,
    icon_url: user.pictureUrl,
  }
  const footer = {
    text: footerText,
    icon_url: 'https://i.imgur.com/lPzI6km.png',
  }
  const timestamp = new Date()

  return {
    title,
    description,
    color,
    author,
    footer,
    timestamp,
  }
}
