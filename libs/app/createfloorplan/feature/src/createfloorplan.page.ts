import { Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';

interface DroppedItem {
  name: string;
  fabricObject?: fabric.Object;
}
@Component({
  selector: 'event-participation-trends-createfloorplan',
  templateUrl: './createfloorplan.page.html',
  styleUrls: ['./createfloorplan.page.css'],
})


export class CreateFloorPlanPage {  
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  canvasItems: DroppedItem[] = [];
  canvas!: fabric.Canvas;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasParent', { static: false }) canvasParent!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    // wait for elements to render before initializing fabric canvas
    setTimeout(() => {
      const canvasElement = this.canvasElement?.nativeElement;
      const canvasContainer = this.canvasParent;

      // get width and height of the parent element
      const width = canvasContainer.nativeElement.offsetWidth;
      const height = canvasContainer.nativeElement.offsetHeight;
      
      this.canvas = new fabric.Canvas(canvasElement);
      this.canvas.setDimensions({ width: width*0.98, height: height*0.965 });
      this.canvas.on('object:moving', this.onObjectMoving.bind(this));
    }, 5);
  }

  noItemsAdded(): boolean {
    return this.canvasItems.length === 0;
  }

  itemsAdded(): boolean {
    return this.canvasItems.length > 0;
  }

  onDragStart(event: DragEvent): void {
    const name = (event.target as HTMLElement).innerText;
    event.dataTransfer?.setData('text/plain', name);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const name = event.dataTransfer?.getData('text/plain');
    if (name) {
      const positionX = event.clientX - this.canvasElement.nativeElement.offsetLeft;
      const positionY = event.clientY - this.canvasElement.nativeElement.offsetTop;
      const droppedItem: DroppedItem = { name };
      this.canvasItems.push(droppedItem);
      this.addFabricObject(droppedItem, positionX, positionY);
    }
  }

  addFabricObject(droppedItem: DroppedItem, positionX: number, positionY: number): void {
    const element = new fabric.Text(droppedItem.name, {
      left: positionX,
      top: positionY,
      width: 100,
      height: 50,
      fill: 'blue',
      // draggable: true
    });

    droppedItem.fabricObject = element;
    this.canvas.add(element);
  }

  onObjectMoving(event: fabric.IEvent): void {
    const movedObject = event.target as fabric.Object;
    const droppedItem = this.canvasItems.find(item => item.fabricObject === movedObject);
    if (droppedItem) {
      droppedItem.fabricObject?.setCoords();
    }
  }
}
