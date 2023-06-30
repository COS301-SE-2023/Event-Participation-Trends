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
  openDustbin = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  canvasItems: DroppedItem[] = [];
  canvas!: fabric.Canvas;
  @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasParent', { static: false }) canvasParent!: ElementRef<HTMLDivElement>;
  @ViewChild('dustbin', { static: false }) dustbinElement!: ElementRef<HTMLImageElement>;

  isDraggingLine = false;
  lineType: 'vertical' | 'horizontal' = 'vertical';
  activeLine: fabric.Line | null = null;

  ngAfterViewInit(): void {
    // wait for elements to render before initializing fabric canvas
    setTimeout(() => {
      const canvasElement = this.canvasElement?.nativeElement;
      const canvasContainer = this.canvasParent;

      // get width and height of the parent element
      const width = canvasContainer.nativeElement.offsetWidth;
      const height = canvasContainer.nativeElement.offsetHeight;

      this.canvas = new fabric.Canvas(canvasElement);
      this.canvas.setDimensions({
        width: width * 0.98,
        height: height * 0.965,
      });
      this.canvas.on('object:moving', this.onObjectMoving.bind(this));
      // Attach the mouse down event listener to start dragging lines
      this.canvas.on('mouse:down', this.onMouseDown.bind(this));

      this.createGridLines();
      this.canvas.on('mouse:up', this.onMouseUp.bind(this));
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
    event.stopPropagation();
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
    const droppedItem = this.canvasItems.find(
      (item) => item.fabricObject === movedObject
    );

    if (droppedItem) {
      const canvasWidth = this.canvasElement.nativeElement.offsetWidth;
      const canvasHeight = this.canvasElement.nativeElement.offsetHeight;
      const objectWidth = movedObject.getScaledWidth();
      const objectHeight = movedObject.getScaledHeight();
      const positionX = movedObject.left || 0;
      const positionY = movedObject.top || 0;
  
      // Define the grid size
      const gridSize = 20; // Adjust this value according to your needs
  
      // Calculate the boundaries
      const minX = 0;
      const minY = 0;
      const maxX = canvasWidth - objectWidth;
      const maxY = canvasHeight - objectHeight;
  
      // Snap the object to the nearest gridline
      const snappedX = Math.round(positionX / gridSize) * gridSize;
      const snappedY = Math.round(positionY / gridSize) * gridSize;
  
      // Limit the object within the boundaries
      const limitedX = Math.max(minX, Math.min(maxX, snappedX));
      const limitedY = Math.max(minY, Math.min(maxY, snappedY));
  
      // Update the object's position
      movedObject.set({
        left: limitedX,
        top: limitedY
      });
  

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

      this.openDustbin = true;
    }
  }

  // onMouseUp(event: fabric.IEvent): void {
  //   this.openDustbin = false;
  // }

  onDustbinDragOver(event: DragEvent): void {
    event.preventDefault();
    this.openDustbin = true;
    this.canvas.defaultCursor = 'copy';
  }

  onDustbinDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.openDustbin = false;
    this.canvas.defaultCursor = 'default';
  }

  onDustbinMouseUp(event: MouseEvent) {
    const dustbinElement = this.dustbinElement.nativeElement;
    const boundingRect = dustbinElement.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (
      mouseX >= boundingRect.left &&
      mouseX <= boundingRect.right &&
      mouseY >= boundingRect.top &&
      mouseY <= boundingRect.bottom
    ) {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject) {
        this.canvas.remove(activeObject);
        const droppedItemIndex = this.canvasItems.findIndex(
          (item) => item.fabricObject === activeObject
        );
        if (droppedItemIndex > -1) {
          this.canvasItems.splice(droppedItemIndex, 1);
        }
      }
    }
  }

  onDustbinDrop(event: fabric.IEvent): void {
    const selectedObject = this.canvas.getActiveObject();
    if (selectedObject) {
      this.canvas.remove(selectedObject);
      this.canvas.renderAll();
    }
    // Snap any moving object to the grid
    const gridSize = 10; // Adjust this value according to your needs
    const target = event.target;
    if (target) {
      const left = target.left || 0;
      const top = target.top || 0;
      target.set({
        left: Math.round(left / gridSize) * gridSize,
        top: Math.round(top / gridSize) * gridSize
      });
    }

  }  
  
  //when the mouse is clicked on the canvas, add a marker to the nearest gridline crossing
  // and when the user starts dragging the mouse, create a line that matches the distance from the marker to the mouse
  onMouseDown(event: fabric.IEvent): void {
    const target = event.target;
    if (target && target instanceof fabric.Line) {
      // Clicked on an existing line, do nothing
      return;
    }
    else if (target && target instanceof fabric.Text) {
      // Clicked on an existing textbox, do nothing
      return;
    }

    const canvas = this.canvas;
    const pointer = canvas.getPointer(event.e);
    const grid = 10;
    const snapPoint = {
      x: Math.round(pointer.x / grid) * grid,
      y: Math.round(pointer.y / grid) * grid,
    };
    const line = new fabric.Line([snapPoint.x, snapPoint.y, snapPoint.x, snapPoint.y], {
      stroke: '#000',
      strokeWidth: 2,
      selectable: true,
      evented: true,
    });
    this.activeLine = line;
    canvas.add(line);
    this.isDraggingLine = true;

    // Attach the mouse move event listener
    canvas.on('mouse:move', this.onMouseMove.bind(this));

    // Attach the mouse up event listener to finish dragging lines
    canvas.on('mouse:up', this.onMouseUp.bind(this));    
  }

  // When the mouse is moving the line at the end of the mouse should snap to the nearest gridline crossing
  onMouseMove(event: fabric.IEvent): void {
    const canvas = this.canvas;
    const pointer = canvas.getPointer(event.e);
    if (this.activeLine) {
      const grid = 10;
      const snapPoint = {
        x: Math.round(pointer.x / grid) * grid,
        y: Math.round(pointer.y / grid) * grid,
      };
      this.activeLine.set({ x2: snapPoint.x, y2: snapPoint.y });
      this.activeLine.setCoords();
      canvas.renderAll();
    }
  }

  onMouseUp(event: fabric.IEvent): void {
    this.openDustbin = false;

    const canvas = this.canvas;
    const pointer = canvas.getPointer(event.e);
    if (this.activeLine) {
      const grid = 10;
      const snapPoint = {
        x: Math.round(pointer.x / grid) * grid,
        y: Math.round(pointer.y / grid) * grid,
      };
      this.activeLine.set({ x2: snapPoint.x, y2: snapPoint.y });
      this.activeLine.setCoords();
      canvas.renderAll();
      this.activeLine = null;
    }
    this.isDraggingLine = false;

    // Remove the mouse move event listener
    canvas.off('mouse:move', this.onMouseMove.bind(this));

    // Remove the mouse up event listener
    canvas.off('mouse:up', this.onMouseUp.bind(this));
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
