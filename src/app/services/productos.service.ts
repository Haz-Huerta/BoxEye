import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Product} from '../models/producto.model';

@Injectable({providedIn: 'root'})
export class ProductsService {
    constructor(private http: HttpClient) {}

    getAll(): Observable<Product[]> {
        return this.http.get('assets/Productos.xml', { responseType: 'text' }).pipe(
      map((xmlText) => this.parseProductsXml(xmlText))
    );
}

private parseProductsXml(xmlText: string): Product[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    // Si el XML está mal formado, normalmente aparece <parsererror>
    if (doc.getElementsByTagName('parsererror').length > 0) {
      return [];
    }

   const nodes = Array.from(doc.getElementsByTagName('producto'));
    return nodes.map((node) => ({
      id: this.getNumber(node, 'id'),
      name: this.getText(node, 'nombre'),
      price: this.getNumber(node, 'precio'),
      imageUrl: this.getText(node, 'imagen'),
      category: this.getText(node, 'categoria'),
      description: this.getText(node, 'descripcion'),
      inStock: this.getBoolean(node, 'inStock'),
    }));
}

 private getText(parent: Element, tag: string): string {
    return parent.getElementsByTagName(tag)[0]?.textContent?.trim() ?? '';
  }

  private getNumber(parent: Element, tag: string): number {
    const value = this.getText(parent, tag);
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private getBoolean(parent: Element, tag: string): boolean {
    const value = this.getText(parent, tag).toLowerCase();
    return value === 'true' || value === '1' || value === 'yes';
  }
}


  /*private readonly products: Product[] = [
    {
id: 1,
name: 'Sanrio Cinnamoroll Cooking House Series Blind Box',
price: 379.99,
imageUrl: './imagenes/Prod1.jpg',
category: 'Blind Box',
description: 'Caja sorpresa de figura Cinnamoroll, serie Cooking House',
inStock: true,
    },
    {
id: 2,
name: 'Sanrio Pochacco School Day Series',
price: 500.00,
imageUrl: './imagenes/Prod2.jpg',
category: 'Blind Box',
description: 'Caja sorpresa de figura Pochacco, serie School Day',
inStock: true,
    },
    {
id: 3,
name: 'Funko Mystery Minis FNAF 10 Aniversario',
price: 459.99,
imageUrl: './imagenes/Prod3.jpg',
category: 'Blind Box',
description: 'Caja sorpresa de figura Five Nights at Freddys, Mystery Mini',
inStock: true,
    },
    {
id: 4,
name: 'Sanrio Pompompurin Childhood Four Seasons Series',
price: 500.00,
imageUrl: './imagenes/Prod4.jpg',
category: 'Blind Box',
description: 'Caja sorpresa de figura Pompompurin, serie Childhood four seasons',
inStock: true,
    },
    {
id: 5,
name: 'Nintendo Cartas Amiibo Animal Crossing Vol.5',
price: 299.99,
imageUrl: './imagenes/Prod5.jpg',
category: 'Cartas',
description: 'Pack con 6 tarjetas amiibo de Animal Crossing de la serie 5',
inStock: true,
    }
];
getAll(): Product[] {
  return this.products;
}
}*/