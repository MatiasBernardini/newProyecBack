const fs = require ('fs')

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

    async addProduct ( title, description, price, thumbnail, code, stock ){
        let productos = await this.getProducts();

        let repeatedCode = await productos.find ((p)=>{
           return p.code === code;
        });
        
        if (repeatedCode){
            throw new Error ("Este Producto, ya ha sido seleccionado")
        }

        if (!title || !description || !price || !thumbnail || !code || !stock){
            throw new Error ("Falta completar");
        }


        const dataProduct = {
            id : this.newId,
            title,
            description,
            price,
            thumbnail,
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

    async deleteProduct(id){
        let products = await this.getProducts();

        let eliminarProducto = products.filter(p => p.id !== id);

        await fs.promises.writeFile(this.#path,JSON.stringify(eliminarProducto));

        console.log("Producto eliminado de JSON")
    }
}


async function main() {
    const productDates = new ProductManager("./Product.json");
  
    let products = await productDates.getProducts();
  
    console.log(products);
  
    await productDates.addProduct ("Vaso", "Vaso de vidrio elegante y resistente", 200, "Imagen", 180, 25)
  
    products = await productDates.getProducts();
    console.log(products);


    // await productDates.deleteProduct (0)
    // products = await productDates.getProducts();
    // console.log(products);
  }
  
main();