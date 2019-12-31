import { Item } from './item.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ItemsService {
    private items: Item[] = [];
    private itemsUpdated = new Subject<Item[]>()

    constructor(private http: HttpClient) {}

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