import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { get } from 'http';
import Konva from 'konva';
import { Line } from 'konva/lib/shapes/Line';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import {Html5QrcodeScanner} from "html5-qrcode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IlinkSensorRequest } from '@event-participation-trends/api/sensorlinking';
import { Select, Store } from '@ngxs/store';
import { CreateFloorPlanState, CreateFloorPlanStateModel, ISensorState } from '@event-participation-trends/app/createfloorplan/data-access';
import { Observable } from 'rxjs';
import { AddSensor, RemoveSensor, UpdateActiveSensor, UpdateSensorLinkedStatus } from '@event-participation-trends/app/createfloorplan/util';

interface DroppedItem {
  name: string;
  konvaObject?: Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path;
}
@Component({
  selector: 'event-participation-trends-createfloorplan',
  templateUrl: './createfloorplan.page.html',
  styleUrls: ['./createfloorplan.page.css'],
})

export class CreateFloorPlanPage implements OnInit{
  @Select(CreateFloorPlanState.getSensors) sensors$!: Observable<ISensorState[] | undefined>; 
  @Select(CreateFloorPlanState.getActiveSensor) activeSensor$!: Observable<ISensorState | null>;
    @ViewChild('canvasElement', { static: false }) canvasElement!: ElementRef<HTMLDivElement>;
    @ViewChild('canvasParent', { static: false }) canvasParent!: ElementRef<HTMLDivElement>;
    @ViewChild('dustbin', { static: false }) dustbinElement!: ElementRef<HTMLImageElement>;
    @ViewChild('stall', {static: false}) stallElement!: ElementRef<HTMLImageElement>;
    macAddrFromQR = '';
    isDropdownOpen = false;
    openDustbin = false;
    canvasItems: DroppedItem[] = [];
    canvasContainer!: Konva.Stage;
    canvas!: Konva.Layer;
    isDraggingLine = false;
    lineType: 'vertical' | 'horizontal' = 'vertical';
    // activeLine: Konva.Line | null = null;
    activeItem: any = null;
    // lines: Konva.Line[] = [];
    transformer = new Konva.Transformer();
    preventCreatingWalls = true; // to prevent creating walls
    transformers: Konva.Transformer[] = [this.transformer];
    sensors: ISensorState[] | undefined = [];
    gridSize = 10;
    paths: Konva.Path[] = [];
    activePath: Konva.Path | null = null;
    onDustbin = false;
    ctrlDown = false;
    mouseDown = false;
    gridBoundaries = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      bottom: 0,
      right: 0,
    };
    stageState = {
      stageScale: 1,
      stageX: 0,
      stageY: 0,
    }
    macAddressBlocks: string[] = [];
    macAddressBlockElements : NodeListOf<HTMLIonInputElement> | undefined;
    canLinkSensorWithMacAddress = false;
    macAddressForm!: FormGroup;
    inputHasFocus = false;
    initialHeight = 0;

    constructor(
      private readonly appApiService: AppApiService,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder, 
      private readonly store: Store
    ) {}

    convertX(x: number): number {
      return (x - this.canvasContainer.x()) / this.canvasContainer.scaleX();
    }

    convertY(y: number): number {
      return (y - this.canvasContainer.y()) / this.canvasContainer.scaleY();
    }

    toggleEditing(): void {
      this.preventCreatingWalls = !this.preventCreatingWalls;
      this.activeItem = null;
      this.store.dispatch(new UpdateActiveSensor(''));

      //remove all selected items
      this.transformers.forEach(transformer => {
        transformer.nodes([]);
      });

      // modify all elements such that they cannot be dragged when creating walls
      this.canvasItems.forEach(item => {
        if (!item.konvaObject) return;

        item.konvaObject?.setAttr('draggable', this.preventCreatingWalls);
        item.konvaObject?.setAttr('opacity', this.preventCreatingWalls ? 1 : 0.5);
        
        if (this.preventCreatingWalls){
          this.setMouseEvents(item.konvaObject);
        } else {
          this.removeMouseEvents(item.konvaObject);

          // set mouse enter and mouse leave events
          item.konvaObject?.on('mouseenter', () => {
            document.body.style.cursor = 'not-allowed';
          });
          item.konvaObject?.on('mouseleave', () => {
            document.body.style.cursor = 'default';
          });
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
        this.canvasContainer.setPointersPositions(event);
        const name = event.dataTransfer?.getData('text/plain');
        if (name) {
            const positionX = this.canvasContainer.getPointerPosition()?.x || 0;
            const positionY = this.canvasContainer.getPointerPosition()?.y || 0;
            const droppedItem: DroppedItem = { name };
            this.canvasItems.push(droppedItem);
            this.addKonvaObject(droppedItem, (positionX - this.canvasContainer.x()) / this.canvasContainer.scaleX() , (positionY - this.canvasContainer.y()) / this.canvasContainer.scaleY());
        }
    }

    addKonvaObject(droppedItem: DroppedItem, positionX: number, positionY: number) {
      if (droppedItem.name.includes('png') || droppedItem.name.includes('jpg') || droppedItem.name.includes('jpeg')) {
        Konva.Image.fromURL(droppedItem.name, (image) => {
          this.setupElement(image, positionX, positionY);
          
          if (droppedItem.name.includes('stall')) {
            image.setAttr('name', 'stall');
            image.setAttr('x', 0);
            image.setAttr('y', 0);
            const group = new Konva.Group({
              id: 'stall',
              name: 'stall',
              x: positionX,
              y: positionY,
              width: 50,
              height: 50,
              draggable: true,
              cursor: 'move',
              fill: 'white',
            });
            
            const text = new Konva.Text({
              id: 'stallName',
              name: 'stallName',
              x: 0,
              y: 0,
              text: 'Stall',
              fontSize: 11,
              fontFamily: 'Calibri',
              fill: 'black',
              width: 50,
              height: 50,
              align: 'center',
              verticalAlign: 'middle',
              padding: 3,
              cursor: 'move',
            });

            group.add(image);
            group.add(text);
            this.setMouseEvents(group);
            this.canvas.add(group);
            this.canvas.draw();
            droppedItem.konvaObject = group;
          } 
          else {
            image.setAttr('name', 'sensor');
            // image.setAttr('customId', this.getUniqueId());
            // this.sensors.push({object: image, isLinked:false});
            this.canvas.add(image);
            this.canvas.draw();
            droppedItem.konvaObject = image;
            this.store.dispatch(new AddSensor(image));
            this.sensors$.subscribe(sensors => {
              this.sensors = sensors;
            });
          }
        });
      }
    }
    
    setupElement(element: Konva.Line | Konva.Image | Konva.Group | Konva.Path, positionX: number, positionY: number): void {
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
        opacity: 1,
      });
    
      this.setMouseEvents(element);
    }

    setMouseEvents(element: Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path): void {
      element.on('dragmove', () => {
        this.activeItem = element;
        this.setTransformer(this.activeItem, undefined);

        if (this.activeItem instanceof Konva.Image) {
          this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
        }
      });
      element.on('dragmove', this.onObjectMoving.bind(this));
      element.on('click', () => {
        this.activeItem = element;
        this.setTransformer(this.activeItem, undefined);

        if (this.activeItem instanceof Konva.Image) {
          this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
        }
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

    removeMouseEvents(element: Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path): void {
      element.off('dragmove');
      element.off('dragmove');
      element.off('click');
      element.off('dragend');
      element.off('mouseenter');
      element.off('mouseleave');
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
              width: width*0.9783,
              height: window.innerHeight-100,      //height*0.92,       
            });

            this.initialHeight = this.canvasContainer.height();

            this.canvas = new Konva.Layer();

            this.canvasContainer.add(this.canvas);
            this.canvasContainer.draw();

            //set object moving
            this.canvas.on('dragmove', this.handleDragMove.bind(this));

            // Attach the mouse down event listener to start dragging lines
            this.canvasContainer.on('mousedown', this.onMouseDown.bind(this));

            this.createGridLines();

            this.canvasContainer.on('mouseup', this.onMouseUp.bind(this));

            // create selection box to select different components on the canvas
            this.createSelectionBox();

            this.canvasContainer.on('click', () => {
              const position = this.canvasContainer.getRelativePointerPosition();

              const component = this.canvas.getIntersection(position);

              if (!component || !(component instanceof Konva.Line) && !(component instanceof Konva.Image) && !(component instanceof Konva.Group)) {
                this.transformer.detach();
              }

              if (component && component instanceof Konva.Text) {
                const selectedText = component;
                const group = selectedText.getAncestors()[0] as Konva.Group;
                
                if (group) {
                  this.activeItem = group;
                  this.setTransformer(group, undefined);
                }
              }
            });
            
            //set ion-input elements where aria-label="MAC Address Block"
            this.macAddressBlockElements = document.querySelectorAll('[aria-label="MAC Address Block"]');
            
            this.macAddressBlockElements.forEach((element: HTMLIonInputElement) => {
              this.macAddressBlocks.push(element.value ? element.value.toString() : '');
            });

            window.addEventListener('keydown', (event: KeyboardEvent) => {
              //now check if no input field has focus and the Delete key is pressed
              if (!this.inputHasFocus && (event.code === "Delete" || event.ctrlKey)) {
                this.handleKeyDown(event);
              }
            });
            window.addEventListener('keyup', (event: KeyboardEvent) => this.handleKeyUp(event));

            const scaleBy = 1.1;

            this.canvasContainer.on('wheel', (e) => {
              e.evt.preventDefault();
              this.handleScaleAndDrag(e, scaleBy);              
            });

            this.canvasContainer.scaleX(scaleBy);
            this.canvasContainer.scaleY(scaleBy);
            const wheelEvent = new WheelEvent('wheel', { deltaY: -1 });
            this.canvasContainer.dispatchEvent(wheelEvent);
            this.handleScaleAndDrag(wheelEvent, 1.1);
        }, 6);
    }

    handleScaleAndDrag(e: any, scaleBy:number) {
      const stage = e.target;
      if (!stage) return;
      const oldScale = stage.scaleX();

      let pointer = null;
      if (stage instanceof Konva.Stage) {
        pointer = stage.getPointerPosition();
      }
      else {
        pointer = stage.getStage().getPointerPosition();
      }

      if (!pointer) {
        return;
      }

      const mousePointTo = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale
      };

      let direction = e.evt.deltaY < 0 ? 1 : -1;

      if (e.evt.ctrlKey) {
        direction = -direction;
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.gridSize = 10;

      if (newScale <= 1 || newScale >= 5) return;

      const x =
        -(mousePointTo.x - pointer.x / newScale) * newScale;
      const y =
        -(mousePointTo.y - pointer.y / newScale) * newScale;

      const pos = this.boundFunc({ x, y }, newScale);

      this.canvasContainer.scale({ x: newScale, y: newScale });
      this.canvasContainer.position(pos);
    }

    boundFunc(pos: any, scale: any) {
      const stageWidth = this.canvasContainer.width();
      const stageHeight = this.canvasContainer.height();
  
      const x = Math.min(0, Math.max(pos.x, stageWidth * (1 - scale)));
      const y = Math.min(0, Math.max(pos.y, stageHeight * (1 - scale)));
  
      return {
        x,
        y
      };
    }

    handleDragMove(e: any) {
      if (this.ctrlDown) {
        this.canvasContainer.position({
          x: e.target.x(),
          y: e.target.y()
        });
      }
    }

    handleKeyDown(event: KeyboardEvent): void {
      this.ctrlDown = false;
      event.preventDefault();

      if (this.activeItem) {
        if (event.code === "Delete") {
          this.removeObject(this.activeItem);
          this.canvas.batchDraw();
        }
      }
      else if (this.activePath) {
        if (event.code === "Delete") {
          this.removeObject(this.activePath);
          this.canvas.batchDraw();
        }
      }
      else if (event.ctrlKey) {
        this.ctrlDown = true;
        document.body.style.cursor = 'grab';
        if (this.mouseDown) {
          document.body.style.cursor = 'grabbing';
        }

        this.canvasContainer.draggable(true);   
        
        this.canvasContainer.dragBoundFunc((pos) => {          
          return this.boundFunc(pos, this.canvasContainer.scaleX());
        });
      }
    }

    handleKeyUp(event: KeyboardEvent): void {
      this.ctrlDown = false;
      this.canvasContainer.draggable(false);
      document.body.style.cursor = 'default';
      event.preventDefault();
    }

    setTransformer(mouseEvent?: Konva.Image | Konva.Group | Konva.Text, line?: Konva.Line | Konva.Path): void {
      if(!this.preventCreatingWalls) return;

      this.transformer.detach();
      this.canvas.add(this.transformer);
      let target = null;
      if (mouseEvent) {
        target = mouseEvent;
      }
      else if (line) {
        target = line;
      }

      const node = target as Konva.Node;
      this.transformer.nodes([node]);
    }

    createSelectionBox(): void {
      if (this.ctrlDown) {
        return;
      }

      const tr = new Konva.Transformer();
      this.transformers.push(tr);
      this.canvas.add(tr);

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
        if (this.ctrlDown) {
          return;
        }
        
        if (!this.preventCreatingWalls) {
          this.activeItem = null;

          this.store.dispatch(new UpdateActiveSensor(''));
  
          return;
        }

        // do nothing if we mousedown on any shape
        if (e.target !== this.canvasContainer) {
          if (e.target instanceof Konva.Image) {
            const html5QrcodeScanner = new Html5QrcodeScanner(
              "reader",
              { fps: 10, qrbox: {width: 250, height: 250} },
              /* verbose= */ false);
            html5QrcodeScanner.render((decoded, res)=>{
              this.macAddrFromQR = decoded;
              this.updateLinkedSensors();
            } , undefined);
          }
          return;
        }

        e.evt.preventDefault();
        const points = this.canvasContainer.getPointerPosition();
        x1 = points ? (points.x - this.canvasContainer.x()) / this.canvasContainer.scaleX() : 0;
        y1 = points ? (points.y - this.canvasContainer.y()) / this.canvasContainer.scaleY() : 0;
        x2 = points ? (points.x - this.canvasContainer.x()) / this.canvasContainer.scaleX() : 0;
        y2 = points ? (points.y - this.canvasContainer.y()) / this.canvasContainer.scaleY() : 0;

        selectionBox.visible(true);
        selectionBox.width(0);
        selectionBox.height(0);
      });

      this.canvasContainer.on('mousemove', (e) => {
        if (!this.preventCreatingWalls) {
          return;
        }
        
        // do nothing if we didn't start selection
        if (!selectionBox.visible()) {
          return;
        }
        e.evt.preventDefault();

        const points = this.canvasContainer.getPointerPosition();
        x2 = points ? (points.x - this.canvasContainer.x()) / this.canvasContainer.scaleX() : 0;
        y2 = points ? (points.y - this.canvasContainer.y()) / this.canvasContainer.scaleY() : 0;

        selectionBox.setAttrs({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          width: Math.abs(x2 - x1),
          height: Math.abs(y2 - y1),
        });
      });

      this.canvasContainer.on('mouseup', (e) => {
        if (!this.preventCreatingWalls) {
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
        const shapes = this.canvasContainer.find('.rect, .wall, .sensor, .stall, .stallName');
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

          if (this.activeItem instanceof Konva.Image) {
            this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
          }
        }
      });

      // clicks should select/deselect shapes
      this.canvasContainer.on('click', (e) => {
        if (!this.preventCreatingWalls) {
          return;
        }
        
        // if click on empty area - remove all selections
        if (e.target === this.canvasContainer) {
          this.transformers.forEach((tr) => {
            tr.nodes([]);
          });
          this.activeItem = null;

          this.store.dispatch(new UpdateActiveSensor(''));
          return;
        }

        if (tr.nodes().length > 1){
          this.activeItem = null;

          this.store.dispatch(new UpdateActiveSensor(''));
        }

        // if we are selecting with rect, do nothing
        if (selectionBox.visible()) {
          return;
        }

        // do nothing if clicked NOT on our lines or images or text
        if (!e.target.hasName('rect') && !e.target.hasName('wall') && !e.target.hasName('sensor') && !e.target.hasName('stall') && !e.target.hasName('stallName')) {
          this.activeItem = null;

          this.store.dispatch(new UpdateActiveSensor(''));
          
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

            this.store.dispatch(new UpdateActiveSensor(''));
            
          } else if (tr.nodes().length === 1) {
            this.activeItem = tr.nodes()[0];

            if (this.activeItem instanceof Konva.Image) {
              this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
            }
          }

        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);

          if (tr.nodes().length > 1){
            this.activeItem = null;

            this.store.dispatch(new UpdateActiveSensor(''));
            
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

            if (this.activeItem instanceof Konva.Image) {
              this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
            }
        }

        const movedObject = event.currentTarget;
        const droppedItem = this.canvasItems.find(
            (item) => item.konvaObject === movedObject
        );

        // set bounderies for the object such that the object cannot be move beyond the borders of the canvas
        
            
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

            // test if the cursor is on the dustbin
            const dustbinElement = this.dustbinElement.nativeElement;
            const boundingRect = dustbinElement.getBoundingClientRect();
            const mouseX = event.evt.clientX;
            const mouseY = event.evt.clientY;

            if (
                mouseX >= boundingRect.left &&
                mouseX <= boundingRect.right &&
                mouseY >= boundingRect.top &&
                mouseY <= boundingRect.bottom
            ) {
                this.onDustbin = true;
            }
            else {
                this.onDustbin = false;
            }
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
        this.onDustbin = false;
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
                selectedObject = this.activePath;
            }
            
            if (selectedObject) {
              this.removeObject(selectedObject);
            }

        }
      }

      removeObject(selectedObject: Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path) {
        if (this.transformer) {
          this.canvas.find('Transformer').forEach((node) => node.remove());

          // add transformers to existing objects
          this.canvasItems.forEach((item) => {
            const transformer = new Konva.Transformer();
            this.canvas.add(transformer);
          });

        }
      
        document.body.style.cursor = 'default';
        this.removeMouseEvents(selectedObject);
        selectedObject.remove();
        this.openDustbin = false;
        this.onDustbin = false;
        this.activeItem = null;

        this.store.dispatch(new UpdateActiveSensor(''));

        // remove item from canvasItems array
        const index = this.canvasItems.findIndex((item) => item.konvaObject === selectedObject);
        if (index > -1) {
            this.canvasItems.splice(index, 1);

            // remove item from sensors array if it is a sensor
            this.sensors$.subscribe((sensors) => {
              sensors?.forEach((sensor) => {
                  if (sensor.object === selectedObject) {
                      this.store.dispatch(new RemoveSensor(sensor.object.getAttr('customId')));

                      // reassign sensors to this.sensors
                      this.sensors$.subscribe((sensors) => {
                          this.sensors = sensors;
                      });
                  }
              });                
            });
        }
        this.canvas.batchDraw();
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
        this.mouseDown = true;
        if (this.ctrlDown) {
          return;
        }

        const target = event.target;
        if (target && target instanceof Konva.Line
          || target instanceof Konva.Path
          || target instanceof Konva.Image
          || target instanceof Konva.Group) {
            // Clicking on a line or path or image or group will not do anything
            return;
        } else if (this.preventCreatingWalls) {
          return;
        }
        else this.transformer.detach();
        
        const pointer = this.canvasContainer.getPointerPosition();
        const grid = this.gridSize;
        const xValue = pointer ? this.convertX(pointer.x) : 0;
        const yValue = pointer ? this.convertY(pointer.y) : 0;
        const snapPoint = {
            x: Math.round(xValue / grid) * grid,
            y: Math.round(yValue / grid) * grid,
        };
        
        const path = new Konva.Path({
            x: snapPoint.x,
            y: snapPoint.y,
            data: 'M0,0 L0,0',
            stroke: 'black',
            strokeWidth: 5,
            lineCap: 'round',
            lineJoin: 'round',
            draggable: true,
            name: 'wall'
        });

        this.activePath = path;
        path.on('dragmove', this.onObjectMoving.bind(this));
        this.canvas.add(path);
        this.canvas.batchDraw();

        this.paths.push(path);
        this.isDraggingLine = true;

        // Attach the mouse move event listener
        this.canvasContainer.on('mousemove', this.onMouseMove.bind(this));

        // Attach the mouse up event listener
        this.canvasContainer.on('mouseup', this.onMouseUp.bind(this));
      }
      
      onMouseMove(): void {
        if (this.ctrlDown) {
          return;
        }

        const pointer = this.canvasContainer.getPointerPosition();
        if (this.activePath) {
            const grid = this.gridSize;
            const xValue = pointer ? this.convertX(pointer.x) : 0;
            const yValue = pointer ? this.convertY(pointer.y) : 0;
            const snapPoint = {
                x: Math.round(xValue / grid) * grid,
                y: Math.round(yValue / grid) * grid,
            };
            const data = this.activePath.data();
            const startPointX = data.split(' ')[0].split(',')[0].replace('M', '');
            const startPointY = data.split(' ')[0].split(',')[1];
            const endPointX = snapPoint.x - this.activePath.x();
            const endPointY = snapPoint.y - this.activePath.y();
            const newData = `M${startPointX},${startPointY} L${endPointX},${endPointY}`;
            this.activePath.data(newData);
            this.canvas.batchDraw();
        }
      }
      
      onMouseUp(): void {
        this.openDustbin = false;
        this.mouseDown = false;

        const pointer = this.canvasContainer.getPointerPosition();
        if (this.activePath) {
          const grid = this.gridSize;
          const xValue = pointer ? this.convertX(pointer.x) : 0;
          const yValue = pointer ? this.convertY(pointer.y) : 0;
          const snapPoint = {
              x: Math.round(xValue / grid) * grid,
              y: Math.round(yValue / grid) * grid,
          };
          const data = this.activePath.data();
          const startPointX = data.split(' ')[0].split(',')[0].replace('M', '');
          const startPointY = data.split(' ')[0].split(',')[1];
          const endPointX = snapPoint.x - this.activePath.x();
          const endPointY = snapPoint.y - this.activePath.y();
          const newData = `M${startPointX},${startPointY} L${endPointX},${endPointY}`;
          this.activePath.data(newData);
          this.canvas.batchDraw();

          // test if the line is more than a certain length
          const length = Math.sqrt(Math.pow(endPointX, 2) + Math.pow(endPointY, 2));
          if (length < 1) {
              this.activePath.remove();
              this.transformer.detach();
              this.canvas.batchDraw();
              this.isDraggingLine = false;
              this.canvasContainer.off('mousemove');
              this.canvasContainer.off('mouseup');
              return;
          }

          //add line to canvasItems array
          this.canvasItems.push({
            name: 'path',
            konvaObject: this.activePath,
          });

          // set the width a.k.a length of the wall
          const width = Math.abs(snapPoint.x - this.activePath.x());
          this.activePath.setAttr('width', width); // this acts as the length of the wall (vertically or horizontally)

          // set the height of the wall
          const height = Math.abs(snapPoint.y - this.activePath.y());
          this.activePath.setAttr('height', height); 

          // this.setMouseEvents(this.activeLine);
          this.activePath.setAttr('draggable', false);
          this.activePath.setAttr('opacity', 0.5);
          this.removeMouseEvents(this.activePath);

          this.setTransformer(undefined,this.activePath);

          this.activePath = null;             
        }

        this.isDraggingLine = false;
      
        // Remove the mouse move event listener
        this.canvasContainer.off('mousemove', this.onMouseMove.bind(this));
      
        // Remove the mouse up event listener
        this.canvasContainer.off('mouseup', this.onMouseUp.bind(this));        
      }
      
      createGridLines() {
        const grid = 10;
        const stage = this.canvasContainer;
        const width = stage.width();
        const height = stage.height();
        const gridGroup = new Konva.Group({
          x: stage.x(),
          y: stage.y(),
          width: width,
          height: height,
          bottom: stage.y() + height,
          right: stage.x() + width,
          draggable: false,
        });
        for (let i = 0; i < width / grid; i++) {
          const distance = i * grid;
          const horizontalLine = new Konva.Line({
            points: [distance, 0, distance, width],
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
        // get grid boundaries
        this.gridBoundaries = {
          x: gridGroup.x(),
          y: gridGroup.y(),
          width: gridGroup.width(),
          height: gridGroup.height(),
          bottom: gridGroup.y() + gridGroup.height(),
          right: gridGroup.x() + gridGroup.width(),
        };

        this.canvas.add(gridGroup);
        gridGroup.moveToBottom();
        this.canvas.batchDraw();
      }  
      
      shouldStackVertically = false;

      @HostListener('window:resize')
      onWindowResize() {
        this.checkScreenWidth();
      }

      // set the grid lines when the window is resized
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
      this.checkScreenWidth();
      // remove gridlines and then add them again
      this.removeGridLines();
      const width = this.canvasParent.nativeElement.offsetWidth;

      this.canvasContainer.setAttrs({
        width: width*0.9783,
        height: this.initialHeight,
      });
      this.createGridLines();
    }

    removeGridLines(): void {
      const elementsToRemove: any[] = [];

      this.canvas?.children?.forEach((child: any) => {
        child.children?.forEach((grandChild: any) => {
          if (grandChild.attrs.customClass === 'grid-line') {
            elementsToRemove.push(grandChild);
          }
        });
      });

      elementsToRemove.forEach((element: any) => {
        element.remove();
      });
    }
    
      ngOnInit() : void {
        this.checkScreenWidth();

        this.macAddressForm = this.formBuilder.group({
          macAddressBlock1: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
          macAddressBlock2: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
          macAddressBlock3: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
          macAddressBlock4: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
          macAddressBlock5: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
          macAddressBlock6: ['', [Validators.required, Validators.pattern('^[0-9a-fA-F]{2}$')]],
        });
      }
    
      checkScreenWidth() {
        this.shouldStackVertically = window.innerWidth < 1421;
      }

      saveFloorLayout(): void {
        // remove grid lines from the JSON data
        const json = this.canvas.toObject();

        // remove the grid lines, transformers and groups from the JSON data
        json.children = json.children.filter((child: any) => {
          return child.attrs.name === 'wall' || child.attrs.name === 'stall' || child.attrs.name === 'sensor';
        });

        //stringify the JSON data
        const jsonString = JSON.stringify(json);

        // subscribe to params and get the event id
        let eventId = '';
        
        this.route.queryParams.subscribe(params => {
          eventId = params['id'];
        });

        // save the JSON data to the database
        this.appApiService.updateFloorLayout(eventId, jsonString).subscribe((res: any) => {
          console.log(res);
        });
      }

      // getUniqueId(): string {
      //   this.appApiService.getNewEventSensorId().subscribe((res: any) => {
      //     return res;
      //   });

      //   return '';
      // }

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

    isSensor() : boolean {
      if (this.activeItem && this.activeItem instanceof Konva.Image) {
        return true;
      }
      this.isCardFlipped = false;

      //clear macAddressBlocks
      this.macAddressForm.reset();

      this.canLinkSensorWithMacAddress = false;

      return false;
    }

    // get SensorIds(): string[] {
    //   // filter out active selected sensor
    //   const sensors = this.sensors.filter((sensor: any) => {
    //     return sensor.attrs.customId !== this.activeItem?.attrs.customId;
    //   });

    //   // get the ids of the sensors
    //   const sensorIds = sensors.map((sensor: any) => {
    //     return sensor.attrs.customId;
    //   });

    //   return sensorIds;
    // }

    isCardFlipped = false;

    toggleCardFlip() {
      this.isCardFlipped = !this.isCardFlipped;

      //clear macAddressBlocks
      this.macAddressForm.reset();

      this.canLinkSensorWithMacAddress = false;
    }

    getSelectedSensorId() {
      return this.activeItem?.attrs.customId;
    }

    updateLinkedSensors() {
      const request: IlinkSensorRequest = {
        id: this.activeItem.getAttr('customId')
      };

      const macAddress = this.macAddrFromQR || this.macAddressBlocks.join(':');

      // check if sensor isn't already linked 
      this.appApiService.isLinked(this.activeItem?.getAttr('customId')).subscribe((res: any) => {
        if(!res['isLinked']) {
          this.appApiService.linkSensor(request, macAddress).then((res: any) => {
            if (res['success']) {
              // set the 'isLinked' attribute to true
              this.store.dispatch(new UpdateSensorLinkedStatus(request.id, true));

              //update active sensor
              this.store.dispatch(new UpdateActiveSensor(request.id));
            }
          });
        }
      });
    }

    handleMacAddressInput(event: any, blockIndex: number) {
      // Format and store the value in your desired format
      // Example: Assuming you have an array called macAddressBlocks to store the individual blocks
      this.macAddressBlocks[blockIndex] = event.target.value.toString().toUpperCase();
      // Add any additional validation or formatting logic here
      // Example: Restrict input to valid hexadecimal characters only
      const validHexCharacters = /^[0-9A-Fa-f]*$/;
      if (!validHexCharacters.test(event.target)) {
        // Handle invalid input, show an error message, etc.
      }

      // Move focus to the next input when 2 characters are entered, 4 characters, etc.
      if (event.target.value.length === 2 && validHexCharacters.test(event.target.value)) {
        // map thorugh the macAddressBlocksElements and find the next input
        const nextInput = this.macAddressBlockElements?.item(blockIndex + 1);

        if (nextInput && nextInput?.value?.toString().length !== 2) {
          nextInput.focus();

          // check if input now has focus
          if (nextInput !== document.activeElement) {
            // if not, set the focus to the next input
            nextInput.setFocus();
          }
        }
      }

      //check to see if all the blocks are filled nd satisfies the regex
      if (this.macAddressBlocks.every((block) => block.valueOf().length === 2 && validHexCharacters.test(block))) {
        // join the blocks together
        const macAddress = this.macAddressBlocks.join(':');
        // set the macAddress value in the form
        this.macAddressForm.get('macAddress')?.setValue(macAddress);

        this.canLinkSensorWithMacAddress = true;
      } else {
        this.canLinkSensorWithMacAddress = false;
      }
    }  

    setInputFocus(value: boolean) {
      this.inputHasFocus = value;
    }

    // isLinked() {
    //   this.appApiService.isLinked(this.activeItem?.getAttr('customId')).subscribe((res: any) => {
    //     if(!res['success']) {
    //       this.store.dispatch(new UpdateSensorLinkedStatus(this.activeItem?.getAttr('customId'), false));
    //     }
    //   });

    // }

    get macAddressBlock1() {
      return this.macAddressForm.get('macAddressBlock1');
    }

    get macAddressBlock2() {
      return this.macAddressForm.get('macAddressBlock2');
    }

    get macAddressBlock3() {
      return this.macAddressForm.get('macAddressBlock3');
    }

    get macAddressBlock4() {
      return this.macAddressForm.get('macAddressBlock4');
    }

    get macAddressBlock5() {
      return this.macAddressForm.get('macAddressBlock5');
    }

    get macAddressBlock6() {
      return this.macAddressForm.get('macAddressBlock6');
    }

      chooseDustbinImage(): string {
        if (this.openDustbin && !this.onDustbin) {
          return 'assets/trash-open.svg';
        }
        else if (!this.openDustbin && !this.onDustbin) {
          return 'assets/trash-svgrepo-com.svg';
        }
        else if (this.openDustbin && this.onDustbin) {
          return 'assets/trash-delete.svg';
        }
        else return '';
    }
}