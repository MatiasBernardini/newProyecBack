import fs from "fs"

class ProductManager {
    #path = ""
    newId = 0 

    constructor (path) {
        this.#path = path;
    }

    async getProducts() {
        try {
          const products = await fs.promises.readFile(this.#path, "utf-8");
          return JSON.parse(products);
        } catch (e) {
          return [];
        }
    }

    async addProduct ( title, description, price, code, stock ){
        let productos = await this.getProducts();

        let repeatedCode = await productos.find ((p)=>{
           return p.code === code;
        });
        
        if (repeatedCode){
            throw new Error ("Este Producto, ya ha sido seleccionado")
        }

        if (!title || !description || !price || !code || !stock){
            throw new Error ("Falta completar");
        }


        const dataProduct = {
            id : this.newId,
            title,
            description,
            price,
            code,
            stock
        }

        const products = await this.getProducts ();

        const updateProduct = [...products, dataProduct];

        await fs.promises.writeFile (this.#path, JSON.stringify(updateProduct));

        this.newId++;
    }

    async getProductById (newId){
        let productos = this.getProducts ();

        const idFilter = await productos.find ((p)=>{
            return p.id === newId;
         });
         if (idFilter){
            return idFilter
        } else {  
            return "ID no encontrado"
        }
    } 

    async updateProduct (id, data){
        let products = await this.getProducts()
        let productoModificado = products.find(i => i.id === id)

        if (Object.keys(data).includes('id')){
            throw new Error('ID UNICO')
        }
        
        productoModificado = {...productoModificado, ...data};

        let newArray = products.filter( prods => prods.id !== id);

        newArray = [...newArray, productoModificado];

        await fs.promises.writeFile(this.#path, JSON.stringify(newArray));

        console.log('Modificación exitosa')
    }


    async deleteProduct(id){
        let products = await this.getProducts();

        let eliminarProducto = products.filter(p => p.id !== id);

        await fs.promises.writeFile(this.#path,JSON.stringify(eliminarProducto));

        console.log("Producto eliminado de JSON")
    }
}


async function main() {
    const productDates = new ProductManager("./Product.json");
  
    await productDates.addProduct ("Vaso", "Vaso de vidrio ", 300, 180, 45)
    await productDates.addProduct ("Vaso plastico", "Vaso de plastico ", 150, 181, 64)
    await productDates.addProduct ("Tenedor", "Tenedor de metal ", 400, 182, 31)
    await productDates.addProduct ("Cuchara", "Cuchara de metal ", 410, 183, 32)
    await productDates.addProduct ("Cuchillo", "Cuchillo de metal ", 460, 184, 38)
    await productDates.addProduct ("Plato plastico", "Plato de plastico ", 120, 185, 99)
    await productDates.addProduct ("Plato", "Plato de vidrio ", 350, 186, 62)
    await productDates.addProduct ("Taza", "Taza de Porcelana", 370, 187, 27)
    await productDates.addProduct ("Mate", "Mate resistente", 520, 188, 90)
    await productDates.addProduct ("Termo", "Termo de acero", 720, 189, 42)

  }
  
main();

export default (ProductManager); 