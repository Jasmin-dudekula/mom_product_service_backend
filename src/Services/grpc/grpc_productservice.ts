import {ProductInventory} from 'mom-protos'
import grpc, {type sendUnaryData, type ServerUnaryCall} from '@grpc/grpc-js'
import ProductMedicine from '../../models/Product.js'

async function productDetails(call:ServerUnaryCall<ProductInventory.productRequest, ProductInventory.productResponse>, callback:sendUnaryData<ProductInventory.productResponse>){
    const {productId} = call.request
    console.log(productId)
    const productDetails = await ProductMedicine.findOne({_id:productId})
    if(productDetails){
        console.log(productDetails)
        callback(null, {
            type: productDetails?.type || "",
            name: productDetails?.name || "",
            brandName: productDetails?.brandName || '',
            batchNumber: productDetails?.batchNumber || '',
            supplierName: productDetails?.supplierName || '',
            category: productDetails?.category.toString() || '',
            subCategory: productDetails?.subCategory.toString() || '',
            storageInstructions: productDetails?.storageInstructions || '',
            quantityPerUnit: productDetails?.quantityPerUnit || '',
            gst: productDetails?.gst || '',
            hsnCode: productDetails?.hsnCode || '',
            discount: productDetails?.discount || '',
            updatedOn: undefined,
            manufactureDate: undefined,
            sellingPrice: 0,
            imageUrl: productDetails?.imageUrl || '',
            details: {},
            qrCodeUrl: productDetails?.qrCodeUrl || '',
            scientificName: productDetails?.scientificName || '',
            strength: productDetails?.strength || '',
            dosage: productDetails?.dosage || '',
            dosageTiming: productDetails?.dosageTiming || '',
            genderUse: productDetails?.genderUse || '',
            controlSubstance: productDetails?.controlSubstance || '',
            prescriptionNeeded: productDetails?.prescriptionNeeded || '',
            coldChainFlag: productDetails?.coldChainFlag || ''
        })
    }
}

function getproducts() {
    var server = new grpc.Server()
    server.addService(ProductInventory.productDataService, {
        productDetails
    })
    return server
}
export default getproducts