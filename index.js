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
  
    let products = await productDates.getProducts();
  
    console.log(products);
  
    await productDates.addProduct ("Vaso", "Vaso de vidrio elegante y resistente", 200, "Imagen", 180, 25)
    await productDates.addProduct ("Vaso plastico", "Vaso de plastico elegante y resistente", 300, "Imag", 182, 15)

    products = await productDates.getProducts();

    console.log(products);


    // await productDates.updateProduct (1, {title:"modif", price:200})
    // products = await productDates.getProducts();
    // console.log(products);

    // await productDates.deleteProduct (0)
    // products = await productDates.getProducts();
    // console.log(products);
  }
  
main();