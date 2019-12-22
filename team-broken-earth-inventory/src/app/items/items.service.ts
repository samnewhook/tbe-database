import { Item } from './item.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ItemsService {
    private items: Item[] = [];
    private itemsUpdated = new Subject<Item[]>()

    getItems() {
        // This passes by value and not by reference [...arr]
        return [...this.items];
    }

    getItemUpdateListener() {
        return this.itemsUpdated.asObservable();
    }

    addItem(title: string, content: string) {
        const item: Item = {title: title, content: content};
        this.items.push(item);
        this.itemsUpdated.next([...this.items])
    }
}