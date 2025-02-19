import { Product, Products, UnitProduct } from "./product.interface";
import { v4 as random } from "uuid";
import fs from "fs";

let products: Products = loadProducts();

function loadProducts(): Products {
    try {
        const data = fs.readFileSync("./products.json", "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading products: ${error}`); // Use console.error for errors
        return {}; // Return an empty object to avoid undefined errors later
    }
}

function saveProducts() {
    try {
        fs.writeFileSync("./products.json", JSON.stringify(products, null, 2), "utf-8"); // Added pretty printing
        console.log("Products saved successfully!");
    } catch (error) {
        console.error("Error saving products:", error); // Use console.error
    }
}

export const findAll = async (): Promise<UnitProduct[]> => Object.values(products);

export const findOne = async (id: string): Promise<UnitProduct | undefined> => products[id];

export const create = async (productInfo: Product): Promise<UnitProduct | null> => {
    let id = random();
    let product = await findOne(id);

    while (product) {
        id = random();
        product = await findOne(id);
    }

    products[id] = {
        id: id,
        ...productInfo,
    };

    saveProducts();
    return products[id];
};

export const update = async (id: string, updateValues: Product): Promise<UnitProduct | null> => {
    const product = await findOne(id);

    if (!product) {
        return null;
    }

    products[id] = {
        id: id,
        ...updateValues,
    };

    saveProducts();
    return products[id];
};

export const remove = async (id: string): Promise<UnitProduct | null> => {
    const product = await findOne(id);

    if (!product) {
        return null;
    }

    delete products[id];

    saveProducts();
    return product; // Return the removed product
};