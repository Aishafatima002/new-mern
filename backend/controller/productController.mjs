import Product from '../models/product/product.mjs';
import uploadToCloudinary from '../config/cloudinary.mjs';


export const addProduct = async (req, res) => {
	try {
		const { name, price, description } = req.body;

		// Validate input
		if (!name || !price || !req.file ) {
			return res.status(400).json({
				success: false,
				message: 'Name, price, and image are required',
			});
		}

		// Verify file buffer exists
		if (!req.file.buffer) {return res.status(400).json({
				success: false,
				message: 'Invalid image file',
			});
		}
			

		// Upload to Cloudinary
		const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

		// Save to MongoDB
		const newProduct = new Product({
			title: name,
			price: parseFloat(price),
			description,
			image: cloudinaryResult.secure_url,
		});

		await newProduct.save();

		res.status(201).json({
			success: true,
			message: 'Product added successfully',
			product: newProduct,
		});
	} catch (error) {
		console.error('Error adding product:', error);
		res.status(500).json({
			success: false,
			message: error.message || 'Failed to add product',
			error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
		});
	}
};



export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find();
		const formattedProducts = products.map((product) => ({
			...product._doc,
		}));

		res.status(200).json({ success: true, products: formattedProducts });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'An internal server error occurred',
		});
		console.error('Error in get all products route', error);
	}
};


