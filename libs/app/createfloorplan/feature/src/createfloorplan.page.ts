import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
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

      this.createGridLines();
    }, 6);
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

  // onObjectMoving(event: fabric.IEvent): void {
  //   const movedObject = event.target as fabric.Object;
  //   const droppedItem = this.canvasItems.find(item => item.fabricObject === movedObject);
  //   if (droppedItem) {
  //     droppedItem.fabricObject?.setCoords();
  //   }
  // }
  onObjectMoving(event: fabric.IEvent): void {
    const movedObject = event.target as fabric.Object;
    const droppedItem = this.canvasItems.find(item => item.fabricObject === movedObject);
    
    if (droppedItem) {
      const canvasWidth = this.canvasElement.nativeElement.offsetWidth;
      const canvasHeight = this.canvasElement.nativeElement.offsetHeight;
      const objectWidth = movedObject.getScaledWidth();
      const objectHeight = movedObject.getScaledHeight();
      const positionX = movedObject.left || 0;
      const positionY = movedObject.top || 0;
      
      // Calculate the boundaries
      const minX = 0;
      const minY = 0;
      const maxX = canvasWidth - objectWidth;
      const maxY = canvasHeight - objectHeight;
      
      // Check if the object is beyond the boundaries
      if (positionX < minX) {
        movedObject.set('left', minX);
      } else if (positionX > maxX) {
        movedObject.set('left', maxX);
      }
      
      if (positionY < minY) {
        movedObject.set('top', minY);
      } else if (positionY > maxY) {
        movedObject.set('top', maxY);
      }
      
      // Update the object's coordinates
      droppedItem.fabricObject?.setCoords();
      this.canvas.renderAll();
    }
  }

  //create gridlines for the canvas
  createGridLines() {
    const grid = 10;
    const canvas = this.canvas;
    const width = canvas.width ? canvas.width : 0;
    const height = canvas.height ? canvas.height : 0;
    const gridGroup = new fabric.Group([], {
      left: 0,
      top: 0,
      selectable: false,
      hoverCursor: 'default',
      evented: false,
    });
    for (let i = 0; i < (width / grid); i++) {
      const distance = i * grid;
      const horizontalLine = new fabric.Line([distance, 0, distance, height], {
        stroke: '#ccc',
        selectable: false,
        evented: false,
        strokeWidth: 1,
      });
      const verticalLine = new fabric.Line([0, distance, width, distance], {
        stroke: '#ccc',
        selectable: false,
        evented: false,
        strokeWidth: 1,
      });
      gridGroup.addWithUpdate(horizontalLine);
      gridGroup.addWithUpdate(verticalLine);
    }
    canvas.add(gridGroup);
    canvas.sendToBack(gridGroup);
  }
  

  shouldStackVertically = false;

  @HostListener('window:resize')
  onWindowResize() {
    this.checkScreenWidth();
  }

  ngOnInit() {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.shouldStackVertically = window.innerWidth < 1421;
  }

  
}
