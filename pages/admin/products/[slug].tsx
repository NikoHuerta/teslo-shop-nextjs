import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Input, ListItem, Paper, Radio, RadioGroup, TextField, InputLabel } from '@mui/material';

import { AdminLayout } from '../../../components/layouts'
import { IGender, IProduct, ISize, IType } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { tesloAPI } from '../../../api';
import { Product } from '../../../models';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {
    _id?        : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : ISize[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : IType;
    gender      : IGender;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState( false );
    const { enqueueSnackbar } = useSnackbar();

    const { register, handleSubmit, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            // console.log({ value, name, type });
            if(name === 'title'){
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .replaceAll('"', '')
                    .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        });
      return () => subscription.unsubscribe();
    }, [watch, setValue]);
    

    const onChangeSize = ( size: string ) => {
        const currentSizes = getValues('sizes');
        if( currentSizes.includes(size as ISize) ) {
            return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true });
        }

        return setValue('sizes', [ ...currentSizes, size as ISize ], { shouldValidate: true });
    }
    
    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');

        const currentTags = getValues('tags');
        if( currentTags.includes( newTag ) ) {
            return;
        }

        currentTags.push(newTag);
        // setValue('tags', currentTags, { shouldValidate: true });
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );
        setValue('tags', updatedTags, { shouldValidate: true });
    }

    const onFilesSelected = async ( { currentTarget }: FormEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        
        if( !(currentTarget as HTMLInputElement).files || (currentTarget as HTMLInputElement).files!.length === 0 ) {
            return;
        }
        
        const files = (currentTarget as HTMLInputElement).files;
        // console.log(files);
        try { 

            for( const file of files! ) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await tesloAPI.post<{ ok: boolean; message: string }>('/admin/uploads', formData);
                // console.log( data.message );
                setValue('images', [ ...getValues('images'), data.message ], { shouldValidate: true });
            }
        
        } catch ( error: any ) {
            console.log({ error });
        }
        // if( files ) {
        //     const images = Array.from(files).map( file => file.name );
        //     setValue('images', images, { shouldValidate: true });
        // }
    }

    const onDeleteImage = ( image: string ) => {
        setValue('images',
            getValues('images').filter( img => img !== image ),
            { shouldValidate: true }
        );
    }

    const onSubmitForm = async ( form: FormData ) => {
        // console.log({ form });
        
        if( form.images.length < 2 ) 
            return alert('Please upload at least 2 images.');

        setIsSaving( true );

        try {

            //si no hay id, es un nuevo producto
            //si hay id, es un update producto 
            const { data } = await tesloAPI({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form
            });
            // console.log({ data });

            if( !form._id ) {
                setIsSaving( false );
                router.replace(`/admin/products/${ form.slug }`);
            }

            setIsSaving( false );
            enqueueSnackbar('Product saved.', { 
                variant: 'success',
                autoHideDuration: 2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
             });

        } catch ( error ) {
            console.log({ error });
        }


    }

    return (
        <AdminLayout 
            title={'Product'} 
            subTitle={`Edit: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmitForm ) }>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                        >
                        Save
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Title"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'This field is required',
                                minLength: { value: 2, message: 'Minimum 2 characters' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Description"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'This field is required'
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Stock"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'This field is required',
                                min: { value: 0, message: 'Minimum value 0' }
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Price"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: 'This field is required',
                                min: { value: 0, message: 'Minimum value 0' }
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Type</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }
                                onChange={ ({target}) => setValue( 'type', target.value as IType, { shouldValidate: true } ) }
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ ({target}) => setValue( 'gender', target.value as IGender, { shouldValidate: true } ) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel 
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Sizes</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel 
                                        key={size} 
                                        control={<Checkbox checked={ getValues('sizes').includes( size as ISize) } />} 
                                        label={ size } 
                                        onChange={ () => onChangeSize( size ) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'This field is required',
                                validate: ( val ) => val.trim().includes(' ') ? 'No spaces allowed' : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Tags"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Press [spacebar] to add a new tag"
                            value={ newTagValue }
                            onChange={ ({ target }) => setNewTagValue( target.value ) }
                            onKeyUp={ ({ code }) => code === 'Space' ? onNewTag() : undefined }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <Chip
                                        key={ tag }
                                        label={ tag }
                                        onDelete={ () => onDeleteTag( tag )}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Images</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                                onClick={ () => fileInputRef.current!.click() }
                            >
                                Upload Image
                            </Button>

                            <Input 
                                inputRef={ fileInputRef }
                                inputProps={{
                                    accept: "image/png, image/gif, image/jpeg, image/jpg",
                                    multiple: true,
                                }}
                                type="file"
                                sx={{ display: 'none' }}
                                onChange={ onFilesSelected }
                            />
                            {/* <input 
                                type="file"
                                multiple
                                accept='image/png, image/gif, image/jpeg, image/jpg'
                            /> */}

                            <Chip 
                                label="At least 2 images are required"
                                color='error'
                                variant='outlined'
                                sx={{ mb: 1 }}
                            />

                            <Grid container spacing={2}>
                                {
                                    getValues('images').map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ img }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button 
                                                        fullWidth 
                                                        color="error"
                                                        onClick={ () => onDeleteImage( img ) }
                                                    >
                                                        Delete
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;
    let product: IProduct | null;
    
    if ( slug === 'new' ){
        //crear un producto
        const tempProduct = JSON.parse( JSON.stringify( new Product() ) );
        delete tempProduct._id;
        tempProduct.images = ['https://res.cloudinary.com/nhf/image/upload/v1653683600/teslo-shop/qswf5aelegcrlo6or3hb.png'];
        product = tempProduct;

    } else {
        product = await dbProducts.getProductsBySlug(slug.toString());
    }

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }
    

    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage;