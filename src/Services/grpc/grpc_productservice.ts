import { ProductInventory } from 'mom-protos'
import grpc, { type sendUnaryData, type ServerUnaryCall } from '@grpc/grpc-js'
import ProductMedicine from '../../models/Product.js'

async function productDetails(
    call: ServerUnaryCall<ProductInventory.productRequest, ProductInventory.productResponse>, callback: sendUnaryData<ProductInventory.productResponse>) {
    try {
        const { productId } = call.request
        console.log('Fetching product details for ID:', productId)
        const product = await ProductMedicine.findOne({ _id: productId })
            .populate("category", "name")
            .populate("subCategory", "name")
            .lean()
        console.log(product)
        if (!product) {
            console.warn('No product found for ID:', productId)
            return callback(null, {
                name: '',
                type: '',
                brandName: '',
                // batchNumber: '',
                supplierName: '',
                category: '',
                subCategory: '',
                storageInstructions: '',
                quantityPerUnit: '',
                gst: '',
                hsnCode: '',
                // discount: '',
                // updatedOn: undefined,
                manufactureDate: undefined,
                sellingPrice: 0,
                imageUrl: '',
                details: {},
                qrCodeUrl: '',
                scientificName: '',
                strength: '',
                dosage: '',
                dosageTiming: '',
                genderUse: '',
                idealDosage: '',
                controlSubstance: '',
                prescriptionNeeded: '',
                coldChainFlag: '',
                batchNumber: '',
                discount: '',
                updatedOn: undefined
            })
        }

        console.log('Found product:', product.name)

        callback(null, {
            type: product?.type || '',
            name: product?.name || '',
            brandName: product?.brandName || '',
            // batchNumber: product?.batchNumber || '',
            supplierName: product?.supplierName || '',
            category: product?.category?.name || '',
            subCategory: product?.subCategory?.name || '',
            storageInstructions: product?.storageInstructions || '',
            quantityPerUnit: product?.quantityPerUnit || '',
            gst: product?.gst || '',
            hsnCode: product?.hsnCode || '',
            // discount: product?.discount || '',
            // updatedOn: undefined,
            manufactureDate: undefined,
            sellingPrice: 0,
            imageUrl: product?.imageUrl || '',
            details: {},
            qrCodeUrl: product?.qrCodeUrl || '',
            scientificName: product?.scientificName || '',
            strength: product?.strength || '',
            dosage: product?.dosage || '',
            dosageTiming: product?.dosageTiming || '',
            genderUse: product?.genderUse || '',
            idealDosage: product?.idealDosage || '',
            controlSubstance: product?.controlSubstance || '',
            prescriptionNeeded: product?.prescriptionNeeded || '',
            coldChainFlag: product?.coldChainFlag || '',
            batchNumber: '',
            updatedOn: undefined,
            discount: ''
        })
    } catch (error) {
        callback(null, {
            name: '',
            type: '',
            brandName: '',
            // batchNumber: '',
            supplierName: '',
            category: '',
            subCategory: '',
            storageInstructions: '',
            quantityPerUnit: '',
            gst: '',
            hsnCode: '',
            // discount: '',
            // updatedOn: undefined,
            manufactureDate: undefined,
            sellingPrice: 0,
            imageUrl: '',
            details: {},
            qrCodeUrl: '',
            scientificName: '',
            strength: '',
            dosage: '',
            dosageTiming: '',
            genderUse: '',
            idealDosage: '',
            controlSubstance: '',
            prescriptionNeeded: '',
            coldChainFlag: '',
            batchNumber: '',
            discount: '',
            updatedOn: undefined
        })
    }
}

function getproducts() {
    const server = new grpc.Server()
    server.addService(ProductInventory.productDataService, { productDetails })
    return server
}

export default getproducts

