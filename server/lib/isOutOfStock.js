module.exports =  function isOutOfStock(variant) {

    if(!variant){
        return false;
    }

    let isOutStock = false;

    if (
      (variant.fulfillment_service === "manual" ||
        variant.fulfillment_service === "printful" ||
        variant.fulfillment_service === "gooten" ||
        variant.fulfillment_service === "cjdropshipping"||
        variant.fulfillment_service === "shirtigo-cockpit-fulfillment" ||
        variant.fulfillment_service === "amazon_marketplace_web" ||
        variant.fulfillment_service === "printy6-fulfillment"
        ) &&
      variant.inventory_management === null
    ) {
      isOutStock = false;
    } else if (variant.fulfillment_service === "oberlo" && variant.inventory_policy !== 'continue') {
      if (variant.inventory_quantity === 0) {
        isOutStock = true;
      }
    } else {
      if (
        variant.inventory_policy === "deny" &&
        variant.inventory_quantity === 0
      ) {
        isOutStock = true;
      }
    }

    return isOutStock;

}