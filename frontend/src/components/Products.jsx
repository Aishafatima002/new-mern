import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddProductModal from './AddProductModal';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Products = () => {
	const [products, setProducts] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isAdding, setIsAdding] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Fetch products
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(`${apiUrl}/products`);
			setProducts(Array.isArray(response?.data) ? response.data : response?.data?.products || []);
			} catch (error) {
				console.error('Error fetching products:', error);
			} finally {
				setLoading(false);
			}
		};
		fetchProducts();
	}, []);



	return (
		<div className='container mx-auto p-4'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Products</h1>
				<button
					onClick={() => {
						setSelectedProduct(null);
						setIsModalOpen(true);
					}}
					className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>
					Add Product
				</button>
			</div>

			{loading ? (
				<p>Loading products...</p>
			) : (
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
					{products.map((product) => (
						<div key={product._id} className='bg-white shadow rounded-lg p-4'>
							<img
								src={product.image || '/placeholder-image.jpg'} // Using image.url from Cloudinary
								alt={product.title}
								className='w-full h-48 object-cover rounded-lg mb-4'
							/>
							<h2 className='text-lg font-semibold'>{product.title}</h2>
							<p>${product.price}</p>
							<div className='flex space-x-2 mt-4'>
								<button
									onClick={() => {
										setSelectedProduct(product);
										setIsModalOpen(true);
									}}
									className='bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600'
									disabled={isAdding}>
									Update
								</button>
								<button
									onClick={() => {
										setSelectedProduct(product);
										setIsDeleteModalOpen(true);
									}}
									className='bg-black text-white px-4 py-2 rounded hover:bg-red-700'
									disabled={isDeleting}>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			<AddProductModal
				isOpen={ isModalOpen }
				
				onClose={() => setIsModalOpen(false)}
				product={selectedProduct}
				setProducts={setProducts}
				setIsAdding={setIsAdding}
			/>

			{/* Delete Confirmation Modal */}
			{isDeleteModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white p-6 rounded-lg'>
						<h3 className='text-lg font-bold mb-4'>Confirm Delete</h3>
						<p>Are you sure you want to delete {selectedProduct?.name}?</p>
						<div className='flex justify-end space-x-4 mt-6'>
							<button onClick={() => setIsDeleteModalOpen(false)} className='px-4 py-2 border rounded'>
								Cancel
							</button>
							<button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded' disabled={isDeleting}>
								{isDeleting ? 'Deleting...' : 'Delete'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Products;