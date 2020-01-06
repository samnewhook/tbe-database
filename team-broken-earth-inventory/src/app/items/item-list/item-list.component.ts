import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs'

import { Item } from '../item.model'
import {ItemsService} from '../items.service'
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

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
    authStatusSub: Subscription;
    public userIsAuthenticated = false;
    userId: string;

    constructor(public itemsService: ItemsService, private authService: AuthService) {

    }
    
    ngOnInit() {
        this.isLoading = true;
        this.itemsService.getItems(this.itemsPerPage, this.currentPage);
        this.userId = this.authService.getUserId();
        this.itemsSub = this.itemsService.getItemUpdateListener().subscribe((itemData: {items: Item[], itemCount: number}) => {
            this.isLoading = false;
            this.totalItems = itemData.itemCount;
            this.items = itemData.items;
        });
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;
            this.userId = this.authService.getUserId();
        })
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.itemsPerPage = pageData.pageSize;
        this.itemsService.getItems(this.itemsPerPage, this.currentPage);
    }

    ngOnDestroy() {
        this.itemsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

    onDelete(itemId: string) {
        this.isLoading = true;
        this.itemsService.deleteItem(itemId).subscribe(() => {
            this.itemsService.getItems(this.itemsPerPage, this.currentPage);
        });
    }
}