import { Item } from './item.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class ItemsService {
    private items: Item[] = [];
    private itemsUpdated = new Subject<Item[]>()

    constructor(private http: HttpClient, private router: Router) {}

    getItems() {
        this.http.get<{message: string, items: any}>('http://localhost:3000/items')
            .pipe(map((itemData) => {
                return itemData.items.map(item => {
                    return {
                        title: item.title,
                        content: item.content,
                        id: item._id
                    };
                });
            }))
            .subscribe(transformedItems => {
                this.items = transformedItems;
                this.itemsUpdated.next([...this.items]);
            });
    }

    getItemUpdateListener() {
        return this.itemsUpdated.asObservable();
    }

    getItem(id: string) {
        // Clone the item list and only return the item clone with a matching id.
        // return {...this.items.find(i => i.id === id)};
        return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/items/" + id);
    }

    addItem(title: string, content: string) {
        const item: Item = {
            id: null,
            title: title, 
            content: content
        };
        this.http.post<{message: string, itemId: string}>('http://localhost:3000/items', item)
        .subscribe((responseData) => {
            const itemId = responseData.itemId;
            item.id = itemId;
            this.items.push(item);
            this.itemsUpdated.next([...this.items])
            this.router.navigate(["/"]);
        });
    }

    updateItem(id: string, title: string, content: string) {
        const item: Item = { id: id, title: title, content: content };
        this.http.put("http://localhost:3000/items/" + id, item)
        .subscribe(response => {
            const updatedItems = [...this.items];
            const oldItemIndex = updatedItems.findIndex(p => p.id === item.id);
            updatedItems[oldItemIndex] = item;
            this.items = updatedItems;
            this.itemsUpdated.next([...this.items]);
            this.router.navigate(["/"]);
        });
    }

    deleteItem(itemId: string) {
        this.http.delete("http://localhost:3000/items/" + itemId)
        .subscribe(() => {
            const updatedItems = this.items.filter(item => item.id !== itemId);
            this.items = updatedItems;
            this.itemsUpdated.next([...this.items]);
        });
    }
}