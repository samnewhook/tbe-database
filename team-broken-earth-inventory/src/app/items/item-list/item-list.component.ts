import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Item } from '../item.model'
import {ItemsService} from '../items.service'
import { PageEvent } from '@angular/material';

@Component({
    selector: 'app-item-list',
    templateUrl: './item-list.component.html',
    styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy{
    items: Item[] = [];
    private itemsSub: Subscription
    totalItems = 0;
    itemsPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1, 2, 5, 10]
    isLoading = false;

    constructor(public itemsService: ItemsService) {

    }
    
    ngOnInit() {
        this.itemsService.getItems(this.itemsPerPage, this.currentPage);
        this.isLoading = true;
        this.itemsSub = this.itemsService.getItemUpdateListener().subscribe((itemData: {items: Item[], itemCount: number}) => {
            this.isLoading = false;
            this.totalItems = itemData.itemCount;
            this.items = itemData.items;
        });
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.itemsPerPage = pageData.pageSize;
        this.itemsService.getItems(this.itemsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.itemsSub.unsubscribe();
    }

    onDelete(itemId: string) {
        this.isLoading = true;
        this.itemsService.deleteItem(itemId).subscribe(() => {
            this.itemsService.getItems(this.itemsPerPage, this.currentPage);
        });
    }
}