import mongoose, { Schema, Model, model } from 'mongoose';
import { IProduct } from '../interfaces';


const productSchema = new Schema({
    description:{
        type: String,
        required: true,
        default: ''
    },
    images: [{
        type: String,
        required: false
    }],
    inStock: {
        type: Number,
        required: true,
        default: 0
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    sizes: [{
        type: String,
        enum: {
            values: ['XS','S','M','L','XL','XXL','XXXL','UNIQUE'],
            message: '{VALUE} is not a valid size'
        }
    }],
    slug:{
        type: String,
        required: true,
        unique: true
    },
    tags:[{
        type: String,
        required: false
    }],
    title:{
        type: String,
        required: true,
        default: ''
    },
    type:{
        type: String,
        enum:{
            values: ['shirts','pants','hoodies','hats'],
            message: '{VALUE} is not a valid type'
        },
        default: 'shirts'
    },
    gender:{
        type: String,
        enum:{
            values: ['men','women','kid','unisex'],
            message: '{VALUE} is not a valid gender'
        },
        default: 'unisex'
    },
}, {
    timestamps: true
});

//TODO: Crear indice de Mongo
productSchema.index({ title: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

export default Product;