import express, { Request, Response } from "express";
import { Product, UnitProduct } from "./product.interface";
import * as database from "./product.database";
import { StatusCodes } from "http-status-codes";

export const productRouter = express.Router();

productRouter.get("/product/:id", async (req: Request, res: Response) => {
    try {
        const product = await database.findOne(req.params.id);

        if (!product) {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Product does not exist" });
        }

        res.status(StatusCodes.OK).json(product);

    } catch (error) {
        console.error("Error fetching product by ID:", error); // Log the error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" }); // Generic error message
    }
});

productRouter.post("/product", async (req: Request, res: Response) => {
    try {
        const { name, price, quantity, image } = req.body;

        if (!name || !price || !quantity || !image) { // Check if any required field is missing
            res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide all the required parameters (name, price, quantity, image)." });
        }

        const newProduct = await database.create(req.body); // Pass the whole body

        res.status(StatusCodes.CREATED).json(newProduct);

    } catch (error) {
        console.error("Error creating product:", error); // Log the error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" }); // Generic error message
    }
});

productRouter.put("/product/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const newProduct = req.body;

        const findProduct = await database.findOne(id);

        if (!findProduct) {
            res.status(StatusCodes.NOT_FOUND).json({ error: "Product does not exist." });
        }

        const updateProduct = await database.update(id, newProduct);

        res.status(StatusCodes.OK).json(updateProduct); // Return the updated product

    } catch (error) {
        console.error("Error updating product:", error); // Log the error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" }); // Generic error message
    }
});

productRouter.delete("/product/:id", async (req: Request, res: Response) => {
    try {
        const product = await database.findOne(req.params.id); // Corrected typo: findOne

        if (!product) {
            res.status(StatusCodes.NOT_FOUND).json({ error: `No product with ID ${req.params.id}` }); // Template literal for ID
        }

        await database.remove(req.params.id);

        res.status(StatusCodes.OK).json({ msg: "Product deleted successfully" }); // More descriptive message

    } catch (error) {
        console.error("Error deleting product:", error); // Log the error
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" }); // Generic error message
    }
});



