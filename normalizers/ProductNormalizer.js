exports.normalize = (product) => {
	return {
		id: product.id,
		name: product.name,
		description: product.description,
		price: product.price,
		category: product.category,
		imageUrl: product.imageUrl,
		qty: product.quantity,
		shipperId: product.shipperId,
		isNew: product.isNew,
		isWeekProduct: product.isWeekProduct
	};
};
