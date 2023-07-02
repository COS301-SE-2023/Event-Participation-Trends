import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import Konva from 'konva';

interface DroppedItem {
  name: string;
  konvaObject?: Konva.Node;
}
@Component({
  selector: 'event-participation-trends-createfloorplan',
  templateUrl: './createFloorplanKonva.page.html',
  styleUrls: ['./createfloorplan.page.css'],
})

export class CreateFloorPlanPageKonva {
    @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLDivElement>;
    @ViewChild('canvasParent', { static: false }) canvasParent!: ElementRef<HTMLDivElement>;
    @ViewChild('dustbin', { static: false }) dustbinElement!: ElementRef<HTMLImageElement>;
    isDropdownOpen = false;
    openDustbin = false;
    canvasItems: DroppedItem[] = [];
    canvasContainer!: Konva.Stage;
    canvas!: Konva.Layer;
    isDraggingLine = false;
    lineType: 'vertical' | 'horizontal' = 'vertical';
    activeLine: Konva.Line | null = null;

    toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
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
            this.addKonvaObject(droppedItem, positionX, positionY);
        }
    }

    addKonvaObject(droppedItem: DroppedItem, positionX: number, positionY: number) {
        const element = new Konva.Text({
          x: positionX,
          y: positionY,
          width: 100,
          height: 50,
          fill: 'blue',
          draggable: true,
          name: droppedItem.name,
        });
      
        droppedItem.konvaObject = element;
        this.canvas.add(element);

        // print canvas items
        console.log(this.canvas.hasChildren());
      }

    ngAfterViewInit(): void {
        // wait for elements to render before initializing fabric canvas
        setTimeout(() => {
            const canvasParent = this.canvasParent;

            // get width and height of the parent element
            const width = canvasParent.nativeElement.offsetWidth;
            const height = canvasParent.nativeElement.offsetHeight;

            this.canvasContainer = new Konva.Stage({
                container: '#canvasElement',
                width: width*0.965,
                height: height*0.965,
            });

            this.canvas = new Konva.Layer();

            this.canvasContainer.add(this.canvas);
            this.canvasContainer.draw();

            //set object moving
            this.canvas.on('dragmove', this.onObjectMoving.bind(this));

            // Attach the mouse down event listener to start dragging lines
            this.canvas.on('mousedown', this.onMouseDown.bind(this));

            this.createGridLines();

            this.canvas.on('mouseup', this.onMouseUp.bind(this));

        }, 6);
        // const parentWidth = this.canvasParentElement.nativeElement.offsetWidth;
        // const parentHeight = this.canvasParentElement.nativeElement.offsetHeight;

        // this.canvasContainer = new Konva.Stage({
        //     container: '#canvasElement',
        //     width: parentWidth * 0.95,
        //     height: parentHeight * 0.95,
        // });

        // this.canvas = new Konva.Layer({
        //     width: 800,
        //     height: 600,
        //     stroke: 'black',
        //     strokeWidth: 2,
        // });

        // this.canvasContainer.add(this.canvas);
        // this.canvasContainer.draw();


    }

    // onObjectMoving(event: Konva.KonvaEventObject<DragEvent>): void {
    //     const target = event.target;
    //     const targetName = target.name();

    //     if (targetName === 'gridLine') {
    //         return;
    //     }

    //     const targetX = target.x();
    //     const targetY = target.y();

    //     const snappedX = Math.round(targetX / 50) * 50;
    //     const snappedY = Math.round(targetY / 50) * 50;

    //     target.x(snappedX);
    //     target.y(snappedY);
    // }
    onObjectMoving(event: Konva.KonvaEventObject<DragEvent>): void {
        const movedObject = event.currentTarget as Konva.Node;
        const droppedItem = this.canvasItems.find(
          (item) => item.konvaObject === movedObject
        );
      
        if (droppedItem) {
          const canvasWidth = this.canvasElement.nativeElement.offsetWidth;
          const canvasHeight = this.canvasElement.nativeElement.offsetHeight;
          const objectWidth = movedObject.width() * movedObject.scaleX();
          const objectHeight = movedObject.height() * movedObject.scaleY();
          const positionX = movedObject.x() || 0;
          const positionY = movedObject.y() || 0;
      
          const gridSize = 20;
          const minX = 0;
          const minY = 0;
          const maxX = canvasWidth - objectWidth;
          const maxY = canvasHeight - objectHeight;
      
          const snappedX = Math.round(positionX / gridSize) * gridSize;
          const snappedY = Math.round(positionY / gridSize) * gridSize;
      
          const limitedX = Math.max(minX, Math.min(maxX, snappedX));
          const limitedY = Math.max(minY, Math.min(maxY, snappedY));
      
          movedObject.setAttrs({
            x: limitedX,
            y: limitedY
          });
      
          if (positionX < minX) {
            movedObject.setAttr('x', minX);
          } else if (positionX > maxX) {
            movedObject.setAttr('x', maxX);
          }
      
          if (positionY < minY) {
            movedObject.setAttr('y', minY);
          } else if (positionY > maxY) {
            movedObject.setAttr('y', maxY);
          }
      
          droppedItem.konvaObject?.setAttrs({
            draggable: false
          });
      
          this.canvas.batchDraw();
      
          this.openDustbin = true;
        }
    }          
    
    onDustbinDragOver(event: DragEvent): void {
        event.preventDefault();
        this.openDustbin = true;
        this.canvasContainer.container().style.cursor = 'copy';
      }
      
      onDustbinDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.openDustbin = false;
        this.canvasContainer.container().style.cursor = 'default';
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
          const activeObject = this.canvas.findOne('.active');
          if (activeObject) {
            activeObject.remove();
            const droppedItemIndex = this.canvasItems.findIndex(
                (item) => item.konvaObject === activeObject
            );
            if (droppedItemIndex > -1) {
              this.canvasItems.splice(droppedItemIndex, 1);
            }
          }
        }
      }
      
      onDustbinDrop(event: Konva.KonvaEventObject<DragEvent>): void {
        const selectedObject = this.canvas.findOne('.active');
        if (selectedObject) {
          selectedObject.remove();
          this.canvas.batchDraw();
        }
        // Snap any moving object to the grid
        const gridSize = 10; // Adjust this value according to your needs
        const target = event.target;
        if (target) {
          const position = target.position();
          const left = position.x || 0;
          const top = position.y || 0;
          target.position({
            x: Math.round(left / gridSize) * gridSize,
            y: Math.round(top / gridSize) * gridSize,
          });
        }
      }
      
      onMouseDown(event: Konva.KonvaEventObject<MouseEvent>): void {
        const target = event.target;
        if (target && target instanceof Konva.Line) {
          // Clicked on an existing line, do nothing
          return;
        } else if (target && target instanceof Konva.Text) {
          // Clicked on an existing textbox, do nothing
          return;
        }
      
        const stage = this.canvasContainer;
        const pointer = stage.getPointerPosition();
        const grid = 10;
        const xValue = pointer ? pointer.x : 0;
        const yValue = pointer ? pointer.y : 0;
        const snapPoint = {
            x: Math.round(xValue / grid) * grid,
            y: Math.round(yValue / grid) * grid,
        };
        const line = new Konva.Line({
          points: [snapPoint.x, snapPoint.y, snapPoint.x, snapPoint.y],
          stroke: '#000',
          strokeWidth: 2,
          draggable: true,
        });
        this.activeLine = line;
        this.canvas.add(line);
        this.canvas.draw();
        this.isDraggingLine = true;
      
        // Attach the mouse move event listener
        stage.on('mousemove', this.onMouseMove.bind(this));
      
        // Attach the mouse up event listener to finish dragging lines
        stage.on('mouseup', this.onMouseUp.bind(this));
      }
      
      onMouseMove(): void {
        const stage = this.canvasContainer;
        const pointer = stage.getPointerPosition();
        if (this.activeLine) {
            const grid = 10;
            const xValue = pointer ? pointer.x : 0;
            const yValue = pointer ? pointer.y : 0;
            const snapPoint = {
                x: Math.round(xValue / grid) * grid,
                y: Math.round(yValue / grid) * grid,
            };
            const points = this.activeLine.points();
            points[2] = snapPoint.x;
            points[3] = snapPoint.y;
            this.activeLine.points(points);
            this.canvas.batchDraw();
        }
      }
      
      onMouseUp(): void {
        this.openDustbin = false;
      
        const stage = this.canvasContainer;
        const pointer = stage.getPointerPosition();
        if (this.activeLine) {
            const grid = 10;
            const xValue = pointer ? pointer.x : 0;
            const yValue = pointer ? pointer.y : 0;
            const snapPoint = {
                x: Math.round(xValue / grid) * grid,
                y: Math.round(yValue / grid) * grid,
            };
            const points = this.activeLine.points();
            points[2] = snapPoint.x;
            points[3] = snapPoint.y;
            this.activeLine.points(points);
            this.canvas.batchDraw();
            this.activeLine = null;
        }
        this.isDraggingLine = false;
      
        // Remove the mouse move event listener
        stage.off('mousemove', this.onMouseMove.bind(this));
      
        // Remove the mouse up event listener
        stage.off('mouseup', this.onMouseUp.bind(this));
      }
      
      createGridLines() {
        const grid = 10;
        const stage = this.canvasContainer;
        const width = stage.width();
        const height = stage.height();
        const gridGroup = new Konva.Group({
          draggable: false,
        });
        for (let i = 0; i < width / grid; i++) {
          const distance = i * grid;
          const horizontalLine = new Konva.Line({
            points: [distance, 0, distance, height],
            stroke: '#ccc',
            strokeWidth: 1,
            draggable: false,
          });
          const verticalLine = new Konva.Line({
            points: [0, distance, width, distance],
            stroke: '#ccc',
            strokeWidth: 1,
            draggable: false,
          });
          gridGroup.add(horizontalLine);
          gridGroup.add(verticalLine);
        }
        this.canvas.add(gridGroup);
        gridGroup.moveToBottom();
        this.canvas.batchDraw();
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