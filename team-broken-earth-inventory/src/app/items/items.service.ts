import { Item } from './item.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/items";

@Injectable({providedIn: 'root'})
export class ItemsService {
    private items: Item[] = [];
    private itemsUpdated = new Subject<{
        items: Item[],
        itemCount: number
    }>()

    constructor(private http: HttpClient, private router: Router) {}

    getItems(itemsPerPage: number, currentPage: number) {
        const queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;
        this.http.get<{
            message: string, 
            items: any, 
            maxItems: number
        }>(BACKEND_URL + queryParams)
            .pipe(map((itemData) => {
                return { items: itemData.items.map(item => {
                    return {
                        title: item.title,
                        content: item.content,
                        id: item._id,
                        imagePath: item.imagePath,
                        creator: item.creator
                    };
                }),
                maxItems: itemData.maxItems
            }}))
            .subscribe(transformedItemsData => {
                this.items = transformedItemsData.items;
                this.itemsUpdated.next({
                    items: [...this.items], 
                    itemCount: transformedItemsData.maxItems
                });
            });
    }

    getItemUpdateListener() {
        return this.itemsUpdated.asObservable();
    }

    getItem(id: string) {
        // Clone the item list and only return the item clone with a matching id.
        // return {...this.items.find(i => i.id === id)};
        return this.http.get<{
            _id: string, 
            title: string, 
            content: string, 
            imagePath: string,
            creator: string
        }>(BACKEND_URL + "/" + id);
    }

    addItem(title: string, content: string, image: File) {
        const itemData = new FormData();
        itemData.append("title", title);
        itemData.append("content", content);
        itemData.append("image", image, title);
        this.http.post<{message: string, item: Item}>(BACKEND_URL, itemData)
        .subscribe((responseData) => {
            this.router.navigate(["/"]);
        });
    }

    updateItem(id: string, title: string, content: string, image: File | string) {
        let itemData: Item | FormData;
        if (typeof(image) === 'object') {
            itemData = new FormData();
            itemData.append("id", id);
            itemData.append("title", title);
            itemData.append("content", content);
            itemData.append("image", image, title);
        } else {
            itemData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null
            }
        }
        this.http.put(BACKEND_URL + "/" + id, itemData)
        .subscribe(response => {
            this.router.navigate(["/"]);
        });
    }

    deleteItem(itemId: string) {
        return this.http.delete(BACKEND_URL + "/" + itemId);
    }
}