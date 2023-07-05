import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { get } from 'http';
import Konva from 'konva';
import { Line } from 'konva/lib/shapes/Line';

interface DroppedItem {
  name: string;
  konvaObject?: Konva.Line | Konva.Image | Konva.Group;
}
@Component({
  selector: 'event-participation-trends-createfloorplan',
  templateUrl: './createfloorplan.page.html',
  styleUrls: ['./createfloorplan.page.css'],
})

export class CreateFloorPlanPage {
    @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLDivElement>;
    @ViewChild('canvasParent', { static: false }) canvasParent!: ElementRef<HTMLDivElement>;
    @ViewChild('dustbin', { static: false }) dustbinElement!: ElementRef<HTMLImageElement>;
    @ViewChild('stall', {static: false}) stallElement!: ElementRef<HTMLImageElement>;
    isDropdownOpen = false;
    openDustbin = false;
    canvasItems: DroppedItem[] = [];
    canvasContainer!: Konva.Stage;
    canvas!: Konva.Layer;
    isDraggingLine = false;
    lineType: 'vertical' | 'horizontal' = 'vertical';
    activeLine: Konva.Line | null = null;
    activeItem: any = null;
    lines: Konva.Line[] = [];
    // Define the fill color for the closed shapes
    fillColor = 'rgba(255, 0, 0, 0.5)'; // Example color
    transformer = new Konva.Transformer();
    isEditing = true; // to prevent creating walls
    transformers: Konva.Transformer[] = [this.transformer];
    sensors: Konva.Image[] = [];
    gridSize = 10;

    toggleEditing(): void {
      this.isEditing = !this.isEditing;
      this.activeItem = null;

      //remove all selected items
      this.transformers.forEach(transformer => {
        transformer.nodes([]);
      });

      // modify all elements such that they cannot be dragged when creating walls
      this.canvasItems.forEach(item => {
        if (!item.konvaObject) return;

        item.konvaObject?.setAttr('draggable', this.isEditing);
        item.konvaObject?.setAttr('opacity', this.isEditing ? 1 : 0.5);
        
        if (this.isEditing){
          this.setMouseEvents(item.konvaObject);
        } else {
          this.removeMouseEvents(item.konvaObject);
        }
      });
    }

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
      if (droppedItem.name.includes('png') || droppedItem.name.includes('jpg') || droppedItem.name.includes('jpeg')) {
        Konva.Image.fromURL(droppedItem.name, (image) => {
          this.setupElement(image, positionX, positionY);

          if (droppedItem.name.includes('stall')) {
            const group = new Konva.Group({
              id: 'stall',
              x: positionX,
              y: positionY,
              width: 50,
              height: 50,
              draggable: true,
              cursor: 'move',
              fill: 'white',
            });

            // const rect = new Konva.Rect({
            //   id: 'stallRect',
            //   x: positionX,
            //   y: positionY,
            //   width: 50,
            //   height: 50,
            //   fillPatternImage: this.stallElement.nativeElement,
            //   fillPatternRepeat: 'no-repeat',
            // });

            const text = new Konva.Text({
              id: 'stallName',
              x: positionX,
              y: positionY,
              text: 'Stall',
              fontSize: 11,
              fontFamily: 'Calibri',
              fill: 'black',
              width: 50,
              height: 50,
              align: 'center',
              verticalAlign: 'middle',
              padding: 3,
            });

            group.add(image);
            group.add(text);
            this.setMouseEvents(group);
            this.canvas.add(group);
            this.canvas.draw();
            droppedItem.konvaObject = group;
          } 
          else {
            this.sensors.push(image);
            this.canvas.add(image);
            this.canvas.draw();
            droppedItem.konvaObject = image;
          }
        });
      }
    }
    
    setupElement(element: Konva.Line | Konva.Image | Konva.Group, positionX: number, positionY: number): void {
      element.setAttrs({
        x: positionX,
        y: positionY,
        width: 50,
        height: 50,
        cursor: 'move',
        draggable: true,
        cornerRadius: 2,
        padding: 20,
        fill: 'white',
        name: 'sensor',
        customId: this.getUniqueId(),
        opacity: 1,
      });
    
      this.setMouseEvents(element);
    }

    setMouseEvents(element: Konva.Line | Konva.Image | Konva.Group): void {
      if (element instanceof Konva.Line) {
        element.on('dragmove', () => {
          this.setTransformer(undefined, element);
        });
        element.on('dragend', () => {
          this.openDustbin = false;
        });
        element.on('dragmove', this.onObjectMoving.bind(this));
        element.on('click', () => {
          this.setTransformer(undefined, element);
        });
        element.on('mouseenter', () => {
          document.body.style.cursor = 'move';
        });
        element.on('mouseleave', () => {
          document.body.style.cursor = 'default';
        });
      }
      else if (element instanceof Konva.Image) {
        element.on('dragmove', () => {
          this.activeItem = element;
          this.setTransformer(this.activeItem, undefined);
        });
        element.on('dragmove', this.onObjectMoving.bind(this));
        element.on('click', () => {
          this.activeItem = element;
          this.setTransformer(this.activeItem, undefined);
        });
        element.on('dragend', () => {
          this.openDustbin = false;
        });
        element.on('mouseenter', () => {
          document.body.style.cursor = 'move';
        });
        element.on('mouseleave', () => {
          document.body.style.cursor = 'default';
        });
      }
      else if (element instanceof Konva.Group) {
        element.on('dragmove', () => {
          this.setTransformer(element, undefined);
        });
        element.on('dragend', () => {
          this.openDustbin = false;
        });
        element.on('dragmove', this.onObjectMoving.bind(this));
        element.on('click', () => {
          this.setTransformer(element, undefined);
        });
        element.on('mouseenter', () => {
          document.body.style.cursor = 'move';
        });
        element.on('mouseleave', () => {
          document.body.style.cursor = 'default';
        });
      }
    }

    removeMouseEvents(element: Konva.Line | Konva.Image | Konva.Group): void {
      if (element instanceof Konva.Line) {
        element.off('dragmove');
        element.off('dragend');
        element.off('dragmove');
        element.off('click');
        element.off('mouseenter');
        element.off('mouseleave');
      }
      else {
        element.off('dragmove');
        element.off('dragmove');
        element.off('click');
        element.off('dragend');
        element.off('mouseenter');
        element.off('mouseleave');
      }
    }
        

    ngAfterViewInit(): void {
        // wait for elements to render before initializing fabric canvas
        setTimeout(() => {
            const canvasParent = this.canvasParent;

            // get width and height of the parent element
            const position = this.canvasElement.nativeElement.getBoundingClientRect();
            const positionX = position.x;
            const positionY = position.y;
            const width = canvasParent.nativeElement.offsetWidth;
            const height = canvasParent.nativeElement.offsetHeight;

            this.canvasContainer = new Konva.Stage({
                container: '#canvasElement',
                width: width*0.965,
                height: height*0.965                
            });

            this.canvas = new Konva.Layer();

            this.canvasContainer.add(this.canvas);
            this.canvasContainer.draw();

            //set object moving
            // this.canvas.on('dragmove', this.onObjectMoving.bind(this));

            // Attach the mouse down event listener to start dragging lines
            this.canvasContainer.on('mousedown', this.onMouseDown.bind(this));

            this.createGridLines();

            this.canvasContainer.on('mouseup', this.onMouseUp.bind(this));

            // create selection box to select different components on the canvas
            this.createSelectionBox();

            this.canvasContainer.on('click', () => {
              const position = this.canvasContainer.getRelativePointerPosition();

              const component = this.canvas.getIntersection(position);

              if (!component || !(component instanceof Konva.Line) && !(component instanceof Konva.Image)) {
                this.transformer.detach();
              }
            });
        }, 6);
    }

    setTransformer(mouseEvent?: Konva.Image | Konva.Group, line?: Konva.Line): void {
      this.transformer.detach();
      this.canvas.add(this.transformer);
      let target = null;
      if (mouseEvent) {
        target = mouseEvent;
      }
      else if (line) {
        target = line;
      }

      if (target && target instanceof Konva.Line) {
        if (line) {
          // this.transformer.nodes([line]);
          return;
        }
      } else if (target && target instanceof Konva.Image) {
        // Clicked on an existing textbox, do nothing  
        // this.transformer.nodes([this.activeItem]);
        return;
      }
      else if (target && target instanceof Konva.Group) {
        this.transformer.nodes([target]);
        return;
      }
    }

    createSelectionBox(): void {
      // const  rect1 = new Konva.Rect({
      //   x: 60,
      //   y: 60,
      //   width: 100,
      //   height: 90,
      //   fill: 'red',
      //   name: 'rect',
      //   draggable: true,
      // });
      // this.canvas.add(rect1);

      // const  rect2 = new Konva.Rect({
      //   x: 250,
      //   y: 100,
      //   width: 150,
      //   height: 90,
      //   fill: 'green',
      //   name: 'rect',
      //   draggable: true,
      // });
      // this.canvas.add(rect2);

      const tr = new Konva.Transformer();
      this.transformers.push(tr);
      this.canvas.add(tr);

      // tr.nodes([rect1, rect2]);

      const selectionBox = new Konva.Rect({
        fill: 'rgba(0,0,255,0.2)',
        visible: false,
      });

      this.canvas.add(selectionBox);

      let x1: number;
      let y1: number;
      let x2: number;
      let y2: number;

      this.canvasContainer.on('mousedown', (e) => {
        if (!this.isEditing) {
          this.activeItem = null;
          return;
        }

        // do nothing if we mousedown on any shape
        if (e.target !== this.canvasContainer) {
          return;
        }

        e.evt.preventDefault();
        const points = this.canvasContainer.getPointerPosition();
        x1 = points ? points.x : 0;
        y1 = points ? points.y : 0;
        x2 = points ? points.x : 0;
        y2 = points ? points.y : 0;

        selectionBox.visible(true);
        selectionBox.width(0);
        selectionBox.height(0);
      });

      this.canvasContainer.on('mousemove', (e) => {
        if (!this.isEditing) {
          return;
        }
        
        // do nothing if we didn't start selection
        if (!selectionBox.visible()) {
          return;
        }
        e.evt.preventDefault();

        const points = this.canvasContainer.getPointerPosition();
        x2 = points ? points.x : 0;
        y2 = points ? points.y : 0;

        selectionBox.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
      });

      this.canvasContainer.on('mouseup', (e) => {
        if (!this.isEditing) {
          return;
        }
        
        // do nothing if we didn't start selection
        if (!selectionBox.visible()) {
          return;
        }
        e.evt.preventDefault();
        
        // update visibility in timeout, so we can check it in click event
        setTimeout(() => {
          selectionBox.visible(false);
        });

        //find any this related to lines and images and text
        const shapes = this.canvasContainer.find('.rect, .wall, .sensor');
        const box = selectionBox.getClientRect();
        const selected = shapes.filter((shape) => {
          return Konva.Util.haveIntersection(box, shape.getClientRect());
        });
        
        //remove all previous selections
        this.transformers.forEach((tr) => {
          tr.nodes([]);
        });

        //add new selections
        if (selected.length) {
          this.transformers.forEach((tr) => {
            tr.nodes(selected);
          });
        }

        if (tr.nodes().length === 1) {
          this.activeItem = tr.nodes()[0];
        }
      });

      // clicks should select/deselect shapes
      this.canvasContainer.on('click', (e) => {
        if (!this.isEditing) {
          return;
        }
        
        // if click on empty area - remove all selections
        if (e.target === this.canvasContainer) {
          this.transformers.forEach((tr) => {
            tr.nodes([]);
          });
          this.activeItem = null;
          return;
        }

        if (tr.nodes().length > 1){
          this.activeItem = null;
        }

        // if we are selecting with rect, do nothing
        if (selectionBox.visible()) {
          return;
        }

        // do nothing if clicked NOT on our lines or images or text
        if (!e.target.hasName('rect') && !e.target.hasName('wall') && !e.target.hasName('sensor')) {
          this.activeItem = null;
          return;
        }

        // check to see if we pressed ctrl or shift
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);

          if (tr.nodes().length > 1){
            this.activeItem = null;
          } else if (tr.nodes().length === 1) {
            this.activeItem = tr.nodes()[0];
          }

        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);

          if (tr.nodes().length > 1){
            this.activeItem = null;
          }
        }
      });
    }

    onObjectMoving(event: Konva.KonvaEventObject<DragEvent>): void {
        // check if prev active item and new active item are same
        // if so do nothing
        if (this.activeItem != event.target) {
            //remove class from prev active item
            if (this.activeItem) {
                this.activeItem.setAttr('customClass', '');
                this.transformer.detach();
            }
            //set new active item
            this.activeItem = event.target;
            this.activeItem.setAttr('customClass', 'active');
        }

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
        
            const gridSize = this.gridSize;
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
        
            // droppedItem.konvaObject?.setAttrs({
            //     draggable: false
            // });
        
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
            //find specific object with customClass attribute set to 'active'
            // const selectedObject = this.canvas.findOne((obj: any) => obj.getAttr('customClass') === 'active');
            let selectedObject: any = null;

            if (this.activeItem) {
                selectedObject = this.activeItem;
            }
            else {
                selectedObject = this.activeLine;
            }
            
            if (selectedObject) {
                this.transformer.detach();
                document.body.style.cursor = 'default';
                selectedObject.remove();
                this.openDustbin = false;
                // remove item from canvasItems array
                const index = this.canvasItems.findIndex((item) => item.konvaObject === selectedObject);
                if (index > -1) {
                    this.canvasItems.splice(index, 1);

                    // remove item from sensors array if it is a sensor
                    const sensorIndex = this.sensors.findIndex((item) => item === selectedObject);
                    if (sensorIndex > -1) {
                        this.sensors.splice(sensorIndex, 1);
                        console.log('sensor removed');
                    }
                }
                this.canvas.batchDraw();
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
        const gridSize = this.gridSize; // Adjust this value according to your needs
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
            this.transformer.detach();
            return;
        } else if (target && target instanceof Konva.Image) {
            // Clicked on an existing textbox, do nothing
            return;
        } else if (this.isEditing) {
          return;
        }
        else this.transformer.detach();
        
        const pointer = this.canvasContainer.getPointerPosition();
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
          strokeWidth: 5,
          draggable: true,
          name: 'wall',
          opacity: 1,
        });

        this.activeLine = line;
        // Attach the drag move event listener to finish dragging lines
        line.on('dragmove', this.onObjectMoving.bind(this));
        this.canvas.add(line);
        this.canvas.draw();
        this.lines.push(line);
        this.isDraggingLine = true;
      
        // Attach the mouse move event listener
        this.canvasContainer.on('mousemove', this.onMouseMove.bind(this));
      
        // Attach the mouse up event listener to finish dragging lines
        this.canvasContainer.on('mouseup', this.onMouseUp.bind(this))

      }
      
      onMouseMove(): void {
        const pointer = this.canvasContainer.getPointerPosition();
        if (this.activeLine) {
            const grid = this.gridSize;
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

        const pointer = this.canvasContainer.getPointerPosition();
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

            // test if the line is more than a certain length
            const length = Math.sqrt(Math.pow(points[2] - points[0], 2) + Math.pow(points[3] - points[1], 2));
            if (length < 1) {               
                this.activeLine.remove();
                this.transformer.detach();
                this.canvas.batchDraw();
                this.isDraggingLine = false;
                this.canvasContainer.off('mousemove');
                this.canvasContainer.off('mouseup');
                return;
            }

            //add line to canvasItems array
            this.canvasItems.push({
                name: 'line',
                konvaObject: this.activeLine,
            });
            this.setMouseEvents(this.activeLine);

            this.setTransformer(undefined,this.activeLine);

            // check if the line being dragged can join with another line if the end points are close enough
            let joined = false;
            const lines = this.canvas.find('Line');
            const activeLinePoints = this.activeLine.points();
            const activeLineStartPoint = {
                x: activeLinePoints[0],
                y: activeLinePoints[1],
            };

            const activeLineEndPoint = {
                x: activeLinePoints[2],
                y: activeLinePoints[3],
            };

            lines.forEach((line: any) => {
                if (line !== this.activeLine && line.getAttr('customClass') !== 'grid-line') {
                    const points = line.points();
                    const startPoint = {
                        x: points[0],
                        y: points[1],
                    };
                    const endPoint = {
                        x: points[2],
                        y: points[3],
                    };

                    const distanceBetweenStartPoints = Math.sqrt(
                        Math.pow(activeLineStartPoint.x - startPoint.x, 2) +
                        Math.pow(activeLineStartPoint.y - startPoint.y, 2)
                    );

                    const distanceBetweenEndPoints = Math.sqrt(
                        Math.pow(activeLineEndPoint.x - endPoint.x, 2) +
                        Math.pow(activeLineEndPoint.y - endPoint.y, 2)
                    );

                    const distanceBetweenStartAndEndPoints = Math.sqrt(
                        Math.pow(activeLineStartPoint.x - endPoint.x, 2) +
                        Math.pow(activeLineStartPoint.y - endPoint.y, 2)
                    );

                    const distanceBetweenEndAndStartPoints = Math.sqrt(
                        Math.pow(activeLineEndPoint.x - startPoint.x, 2) +
                        Math.pow(activeLineEndPoint.y - startPoint.y, 2)
                    );

                    if (distanceBetweenStartPoints < 10) {
                        // Snap to the start point of the line
                        this.activeLine?.points([startPoint.x, startPoint.y, activeLineEndPoint.x, activeLineEndPoint.y]);
                        this.canvas.batchDraw();
                        joined = true;
                    } else if (distanceBetweenEndPoints < 10) {
                        // Snap to the end point of the line
                        this.activeLine?.points([activeLineStartPoint.x, activeLineStartPoint.y, endPoint.x, endPoint.y]);
                        this.canvas.batchDraw();
                        joined = true;
                    } else if (distanceBetweenStartAndEndPoints < 10) {
                        // Snap to the end point of the line
                        this.activeLine?.points([endPoint.x, endPoint.y, activeLineEndPoint.x, activeLineEndPoint.y]);
                        this.canvas.batchDraw();
                        joined = true;
                    } else if (distanceBetweenEndAndStartPoints < 10) {
                        // Snap to the end point of the line
                        this.activeLine?.points([activeLineStartPoint.x, activeLineStartPoint.y, startPoint.x, startPoint.y]);
                        this.canvas.batchDraw();
                        joined = true;
                    }
                }
            });

            this.activeLine = null;                      
        }

        this.isDraggingLine = false;
      
        // Remove the mouse move event listener
        this.canvas.off('mousemove', this.onMouseMove.bind(this));
      
        // Remove the mouse up event listener
        this.canvas.off('mouseup', this.onMouseUp.bind(this));

        this.isClosedShape();
        
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
            customClass: 'grid-line',
          });
          const verticalLine = new Konva.Line({
            points: [0, distance, width, distance],
            stroke: '#ccc',
            strokeWidth: 1,
            draggable: false,
            customClass: 'grid-line',
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

      isClosedShape(): boolean {
        let closedPathPoints: {
            startX: number,
            startY: number,
            endX: number,
            endY: number,
        }[] = [];
        // Check if the shape is closed
        const lines = this.lines;
        const points: {
            startX: number,
            startY: number,
            endX: number,
            endY: number,
        }[] = [];
        lines.forEach((line: any) => {
            points.push({
                startX: line.points()[0],
                startY: line.points()[1],
                endX: line.points()[2],
                endY: line.points()[3],
            });
        });

        for (let i = 0; i < points.length - 3; i++) {
            for (let j = i+1; j < points.length - 2; j++) {
                for (let k = j+1; k < points.length - 1; k++) {
                    for (let l = k+1; l < points.length; l++) {
                        // see if the first line's endpoint is the same as the next point's start point and so on
                        if (points[i].endX === points[j].startX && points[i].endY === points[j].startY &&
                            points[j].endX === points[k].startX && points[j].endY === points[k].startY &&
                            points[k].endX === points[l].startX && points[k].endY === points[l].startY &&
                            points[l].endX === points[i].startX && points[l].endY === points[i].startY) {
                                closedPathPoints = [points[i], points[j], points[k], points[l]];
                        }
                        
                    }
                }
            }
        }

        if (closedPathPoints.length > 0) {
            // Create the SVG path commands based on the points in the closedPathPoints array
            const pathData = `M${closedPathPoints[0].startX} ${closedPathPoints[0].startY} L${closedPathPoints[1].startX} ${closedPathPoints[1].startY} L${closedPathPoints[2].startX} ${closedPathPoints[2].startY} L${closedPathPoints[3].startX} ${closedPathPoints[3].startY} Z`;
          
            // Create a Konva.Path object
            const path = new Konva.Path({
              x: 0,
              y: 0,
              data: pathData,
              fill: '#00D2FF',
              stroke: 'black',
              strokeWidth: 2,
            });
          
            // Add the path to the layer or stage for rendering
            this.canvas.add(path);

            return true;
          }

        return false;
      }

      testJSON(): void {
        // remove grid lines from the JSON data
        const json = this.canvas.toObject();

        // remove the grid lines, transformers and groups from the JSON data
        json.children = json.children.filter((child: any) => {
          return child.attrs.name === 'wall' || child.attrs.name === 'stall' || child.attrs.name === 'sensor';
        });

        console.log(json);
      }

      getUniqueId(): string {
        // find latest id from sensor customId attribute first character
        const sensors = this.sensors;
        let latestId = 0;
        sensors.forEach((sensor: any) => {
            const id = parseInt(sensor.attrs.customId[1]);
            if (id > latestId) {
                latestId = id;
            }
        });

        // generate random string for the id
        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        return `s${(latestId + 1).toString() + randomString}`;
      }

      updateWidth(event: any) {
        this.activeItem?.width(parseInt(event.target.value));
        this.activeItem?.scaleX(1);
      }
    
      updateHeight(event: any) {
        this.activeItem?.height(parseInt(event.target.value));
        this.activeItem?.scaleY(1);
      }

      updateRotation(event: any) {
        this.activeItem?.rotation(parseInt(event.target.value));
      }

      getActiveItemWidth(): number {
        return Math.round(this.activeItem?.width() * this.activeItem?.scaleX());
      }

      getActiveItemHeight(): number {
        return Math.round(this.activeItem?.height() * this.activeItem?.scaleY());
      }

      getActiveItemRotation(): number {
        return Math.round(this.activeItem?.rotation());
      }
}