const getCategoryData = async () => {
	try {
		const categoryId = localStorage.getItem("catID");
		const result = await getJSONData(`${PRODUCTS_URL}${categoryId}${EXT_TYPE}`);
		if (result.status === "ok") {
			return result.data;
		}
	} catch (error) {
		console.log(error);
	}
};
const displayCategoryName = (categoryName) => {
	const categoryNameContainer = document.querySelector("#display-category");
	categoryNameContainer.textContent = categoryName;
};
const displayProducts = async (productsList) => {
	const productsContainer = document.querySelector("#products-container");
	let products = "";
	await productsList.forEach((product) => {
		products += `
			<div class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${product.name}</h4>
                            <small class="text-muted">${product.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${product.description}</p>
                    </div>
                </div>
            </div>
		`;
	});
	productsContainer.insertAdjacentHTML("beforeend", products);
};

document.addEventListener("DOMContentLoaded", () => {
	const categoryData = getCategoryData();

	categoryData.then((category) => {
		displayCategoryName(category.catName);
		displayProducts(category.products);
	});
});
