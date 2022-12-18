const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minPrice = undefined;
let maxPrice = undefined;

const sortProducts = (criteria, array) => {
	let result = [];
	if (criteria === ORDER_ASC_BY_PRICE) {
		result = array.sort(function (a, b) {
			if (a.cost < b.cost) {
				return -1;
			}
			if (a.cost > b.cost) {
				return 1;
			}
			return 0;
		});
	} else if (criteria === ORDER_DESC_BY_PRICE) {
		result = array.sort(function (a, b) {
			if (a.cost > b.cost) {
				return -1;
			}
			if (a.cost < b.cost) {
				return 1;
			}
			return 0;
		});
	} else if (criteria === ORDER_BY_SOLD_COUNT) {
		result = array.sort(function (a, b) {
			let aCount = parseInt(a.soldCount);
			let bCount = parseInt(b.soldCount);

			if (aCount > bCount) {
				return -1;
			}
			if (aCount < bCount) {
				return 1;
			}
			return 0;
		});
	}

	return result;
};
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
const showProductsList = () => {
	const productsContainer = document.querySelector("#products-container");
	let products = "";
	currentProductsArray.forEach((product) => {
		if (
			(minPrice == undefined || minPrice != undefined && parseInt(product.cost) >= minPrice) &&
			(maxPrice == undefined || maxPrice != undefined && parseInt(product.cost) <= maxPrice)
		) {
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
		}
	});
	productsContainer.innerHTML = products;
};
const sortAndShowProducts = (sortCriteria, productsArray) => {
	currentSortCriteria = sortCriteria;

	if (productsArray != undefined) {
		currentProductsArray = productsArray;
	}

	currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

	//Muestro los productos ordenadas
	showProductsList();
};
const searchProducts = (searchTerm) => {
    const productsContainer = document.querySelector("#products-container");
	let products = "";
	currentProductsArray.forEach((product) => {
		if (
			(minPrice == undefined || minPrice != undefined && parseInt(product.cost) >= minPrice) &&
			(maxPrice == undefined || maxPrice != undefined && parseInt(product.cost) <= maxPrice)
		) {
            if (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description.toLowerCase().includes(searchTerm.toLowerCase())) {
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
            }
		}
	});
	productsContainer.innerHTML = products;
};

document.addEventListener("DOMContentLoaded", () => {
	const categoryData = getCategoryData();

	categoryData.then((category) => {
		displayCategoryName(category.catName);
		currentProductsArray = category.products;
		showProductsList();
	});

	document.getElementById("sortAsc").addEventListener("click", function () {
		sortAndShowProducts(ORDER_ASC_BY_PRICE);
	});

	document.getElementById("sortDesc").addEventListener("click", function () {
		sortAndShowProducts(ORDER_DESC_BY_PRICE);
	});

	document.getElementById("sortByCount").addEventListener("click", function () {
		sortAndShowProducts(ORDER_BY_SOLD_COUNT);
	});

	document.getElementById("clearRangeFilter").addEventListener("click", function () {
			document.getElementById("rangeFilterCountMin").value = "";
			document.getElementById("rangeFilterCountMax").value = "";

			minPrice = undefined;
			maxPrice = undefined;

			showProductsList();
		});

	document
		.getElementById("rangeFilterCount")
		.addEventListener("click", function () {
			//Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
			//de productos por categoría.
			minPrice = document.getElementById("rangeFilterCountMin").value;
			maxPrice = document.getElementById("rangeFilterCountMax").value;

			if (minPrice != undefined && minPrice != "" && parseInt(minPrice) >= 0) {
				minPrice = parseInt(minPrice);
			} else {
				minPrice = undefined;
			}

			if (maxPrice != undefined && maxPrice != "" && parseInt(maxPrice) >= 0) {
				maxPrice = parseInt(maxPrice);
			} else {
				maxPrice = undefined;
			}

			showProductsList();
		});

	document.querySelector("#searchField").addEventListener("input", () => {
		searchProducts(document.querySelector("#searchField").value);
	});
});
