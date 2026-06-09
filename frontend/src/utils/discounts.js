export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export const calculateCartDiscounts = (cart) => {
  let totalAmount = 0
  let productDiscountTotal = 0
  const processedItems = []

  for (const item of cart) {
    const subtotal = item.price * item.quantity
    let productDiscount = 0
    if (item.quantity >= 3) productDiscount = subtotal * 0.1
    const discountedSubtotal = subtotal - productDiscount

    totalAmount += subtotal
    productDiscountTotal += productDiscount
    processedItems.push({ ...item, subtotal, productDiscount, discountedSubtotal })
  }

  const afterProductDiscount = totalAmount - productDiscountTotal

  // Rule 2: 5% off if cart > ₹5000
  let cartDiscount = 0
  if (totalAmount > 5000) cartDiscount = afterProductDiscount * 0.05

  // Bonus Rule B: Cheapest item 50% off
  let bulkDiscount = 0
  let cheapestItem = null
  if (processedItems.length > 0) {
    cheapestItem = processedItems.reduce((min, i) => (i.price < min.price ? i : min))
    bulkDiscount = cheapestItem.price * 0.5
  }

  const finalAmount = Math.max(0, afterProductDiscount - cartDiscount - bulkDiscount)

  return {
    processedItems,
    totalAmount,
    productDiscountTotal,
    cartDiscount,
    bulkDiscount,
    finalAmount,
    cheapestItemName: cheapestItem?.name,
    savings: totalAmount - finalAmount,
  }
}
