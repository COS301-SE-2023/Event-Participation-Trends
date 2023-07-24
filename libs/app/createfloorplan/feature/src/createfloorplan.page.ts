import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { get } from 'http';
import Konva from 'konva';
import { Line } from 'konva/lib/shapes/Line';
import { AppApiService } from '@event-participation-trends/app/api';
import { ActivatedRoute } from '@angular/router';
import {Html5QrcodeScanner, Html5QrcodeScannerState} from "html5-qrcode";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IlinkSensorRequest } from '@event-participation-trends/api/sensorlinking';
import { Select, Store } from '@ngxs/store';
import { CreateFloorPlanState, CreateFloorPlanStateModel, ISensorState } from '@event-participation-trends/app/createfloorplan/data-access';
import { Observable } from 'rxjs';
import { AddSensor, RemoveSensor, UpdateActiveSensor, UpdateSensorLinkedStatus } from '@event-participation-trends/app/createfloorplan/util';
import { IonInput } from '@ionic/angular';
import { NumberSymbol } from '@angular/common';

type KonvaTypes = Konva.Line | Konva.Image | Konva.Group | Konva.Text | Konva.Path | Konva.Circle | Konva.Label;

interface DroppedItem {
  name: string;
  konvaObject?: KonvaTypes;
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
    @ViewChild('textBox', {static: false}) textElement!: ElementRef<HTMLImageElement>;
    @ViewChild('textInput', {static: false}) textInputField!: IonInput;
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
    scaleSnap = this.gridSize;
    scaleBy = 2;
    initialSnap = this.scaleSnap;
    displayedSnap = this.scaleSnap;
    initialGridSize = this.gridSize;
    currentScale = 1;
    gridLines !: Konva.Group;
    currentPathStrokeWidth = 0;
    currentGridStrokeWidth = 0;
    currentSensorCircleStrokeWidth = 0;
    snaps: number[] = [];
    wheelCounter = 0;
    contentLoaded = false;
    componentSize = this.gridSize;
    zoomInDisabled = false;
    zoomOutDisabled = false;
    gridSizeLabel = 0;
    snapLabel = 0;
    selectedWall = false;
    textBoxCount = 0;
    selectedTextBox = false;
    minWallLength = 0.5;
    textLength = 0;
    maxTextLength = 15;
    maxStallNameLength = 10;
    tooltips: Konva.Label[] = [];
    activePathStartPoint = {x: 0, y:0};
    activePathEndPoint = {x: 0, y:0};
    currentLabelFontSize = 0;
    currentLabelShadowBlur = 0;
    currentLabelShadowOffsetX = 0;
    currentLabelShadowOffsetY = 0;
    currentLabelPointerWidth = 0;
    currentLabelPointerHeight = 0;
    tooltipAllowedVisible = false;
    maxReached = false;
    selectedSensor = false;
    selectionGroup !: Konva.Group;
    prevSelectionGroup !: Konva.Group;
    selected : Konva.Shape[] = [];
    stallCount = 1;
    
    // change this value according to which true scale to represent (i.e. 1 block displays as 10m but when storing in database we want 2x2 blocks)
    TRUE_SCALE_FACTOR = 2; //currently represents a 2x2 block
    ratio = this.TRUE_SCALE_FACTOR / this.gridSize;

    constructor(
      private readonly appApiService: AppApiService,
      private readonly route: ActivatedRoute,
      private readonly formBuilder: FormBuilder, 
      private readonly store: Store
    ) {
      for (let i = 1; i < 5; i++) {
        const snap = this.initialGridSize / i;
        this.snaps.push(snap);
      }
    }

    adjustValue(value: number) {
      return Math.round((value * this.ratio) * 100) / 100;
    }

    revertValue(value: number) {
      return Math.round((value / this.ratio) * 100) / 100;
    }

    convertX(x: number): number {
      return (x - this.canvasContainer.x()) / this.canvasContainer.scaleX();
    }

    convertY(y: number): number {
      return (y - this.canvasContainer.y()) / this.canvasContainer.scaleY();
    }

    toggleEditing(): void {
      this.preventCreatingWalls = !this.preventCreatingWalls;
      this.activeItem = null;
      this.textLength = 0;
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
      if (droppedItem.name.includes('png') || droppedItem.name.includes('jpg') || droppedItem.name.includes('jpeg') || droppedItem.name.includes('svg') || 1 == 1) {
        console.log('image');
        Konva.Image.fromURL("https://static.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png/revision/latest?cb=20150206140125", (image) => {
          this.setupElement(image, positionX, positionY);
          
          if (droppedItem.name.includes('stall')) {
            image.setAttr('name', 'stallImage');
            image.setAttr('x', 0);
            image.setAttr('y', 0);
            const group = new Konva.Group({
              id: 'stall-' + this.stallCount,
              name: 'stall',
              x: positionX,
              y: positionY,
              width: this.componentSize,
              height: this.componentSize,
              draggable: true,
              cursor: 'move',
              fill: 'white',
              angle: 0,
            });
            
            const text = new Konva.Text({
              id: 'stallName',
              name: 'stallName',
              x: 0,
              y: 0,
              text: 'Stall-' + this.stallCount,
              fontSize: 1.5,
              fontFamily: 'Calibri',
              fill: 'black',
              width: this.componentSize,
              height: this.componentSize,
              align: 'center',
              verticalAlign: 'middle',
              padding: 3,
              cursor: 'move',
            });
            text.on('click', (e) => {
              this.setTransformer(group);
              // this.canvas.draw();
              // e.cancelBubble = true;
              console.log('clicked');
            });

            group.add(image);
            group.add(text);
            const tooltip = this.addTooltip(text, positionX, positionY);
            this.tooltips.push(tooltip);
            this.setMouseEvents(group);
            this.canvas.add(group);
            this.canvas.draw();
            droppedItem.konvaObject = group;
            this.stallCount++;
          } 
          else if (droppedItem.name.includes('sensor')) {
            image.setAttr('name', 'sensor');

            const sensor = this.canvas.findOne('.sensor');

            // create circle to represent sensor
            const sensorCount = this.sensors ? this.sensors.length+1 : 1;
            const circle = new Konva.Circle({
              id: 'sensor-' + sensorCount,
              name: 'sensor',
              x: positionX,
              y: positionY,
              radius: 2,
              fill: 'red',
              stroke: 'black',
              strokeWidth: this.currentSensorCircleStrokeWidth === 0 && !sensor ? 1 : sensor.getAttr('strokeWidth'),
              draggable: true,
              cursor: 'move',
            });
            circle.setAttr('customId', this.getSelectedSensorId(circle));
            const tooltip = this.addTooltip(circle, positionX, positionY);
            this.tooltips.push(tooltip);
            this.setMouseEvents(circle);
            this.canvas.add(circle);
            this.canvas.draw();
            droppedItem.konvaObject = circle;
            this.store.dispatch(new AddSensor(circle));
            this.sensors$.subscribe(sensors => {
              this.sensors = sensors;
            });
          }
          else if (droppedItem.name.includes('text-selection')) {
            const name = 'textbox-' + this.textBoxCount++;

            // create a text object with default text which then allows the user to edit the text if they double click on it
            const text = new Konva.Text({
              id: name,
              name: 'textBox',
              x: positionX,
              y: positionY,
              text: 'Text',
              fontSize: 10,
              fontFamily: 'Calibri',
              fill: 'black',
              align: 'center',
              verticalAlign: 'middle',
              draggable: true,
              cursor: 'move',
              angle: 0,
            });
            text.setAttrs({
              width: text.text().length * text.fontSize() / 2,
              height: text.fontSize(),
            });

            this.setMouseEvents(text);
            this.canvas.add(text);
            this.canvas.draw();
            droppedItem.konvaObject = text;
          }
        });
      }
    }
    
    setupElement(element: KonvaTypes, positionX: number, positionY: number): void {
      element.setAttrs({
        x: positionX,
        y: positionY,
        width: this.componentSize,
        height: this.componentSize,
        cursor: 'move',
        draggable: true,
        cornerRadius: 2,
        padding: 20,
        fill: 'white',
        opacity: 1,
      });
    
      this.setMouseEvents(element);
    }

    setMouseEvents(element: KonvaTypes): void {
      element.on('dragmove', () => {
        this.activeItem = element;
        this.setTransformer(this.activeItem, undefined);

        this.setTooltipVisibility(element, false);

        if (this.activeItem instanceof Konva.Circle) {
          this.selectedSensor = true;
          this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
        }
        else {
          this.selectedSensor = false;
        }
      });
      element.on('dragmove', this.onObjectMoving.bind(this));
      element.on('click', () => {
        this.activeItem = element;
        this.selectedWall = this.activeItem instanceof Konva.Path ? true : false;        
        this.selectedTextBox = (this.activeItem instanceof Konva.Text || 
                                (this.activeItem instanceof Konva.Group && this.activeItem?.hasName('stall'))) ? true : false;
        this.setTransformer(this.activeItem, undefined);

        if (this.activeItem instanceof Konva.Group) {
          this.transformer.nodes([this.activeItem]);
          this.canvas.draw();
        }
        
        
        if (this.activeItem instanceof Konva.Text && this.activeItem.getAttr('name') === 'textBox') {
          this.selectedTextBox = true;
        }

        if (this.activeItem instanceof Konva.Circle) {
          this.selectedSensor = true;
          this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
        }
        else {
          this.selectedSensor = false;
        }
      });
      element.on('dragend', () => {
        this.openDustbin = false;
      });
      element.on('mouseenter', () => {
        document.body.style.cursor = 'move';
        if (this.tooltipAllowedVisible) this.setTooltipVisibility(element, true);

        setTimeout(() => {
          this.setTooltipVisibility(element, false);
        }, 2000);
      });
      element.on('mouseleave', () => {
        document.body.style.cursor = 'default';
        this.setTooltipVisibility(element, false);
      });

      if (element instanceof Konva.Text && (element.getAttr('name') === 'textBox' || element.getAttr('name') === 'stallName')) {
        element.on('dblclick', () => {
          this.activeItem = element;
          this.selectedTextBox = true;
          setTimeout(() => {
            this.textInputField.setFocus();
            // highlight the text in the input field
            this.textInputField.getInputElement().then((input: HTMLInputElement) => {
              input.select();
            });
          }, 10);
        });
        element.on('textChange', () => {
          const maxWidth = 8; // Update with your desired maximum width
          const lineHeight = element.getAttr('lineHeight');
          const text = element.getAttr('text');
          const fontSize = element.getAttr('fontSize');
          const fontFamily = element.getAttr('fontFamily');
          const fontStyle = element.getAttr('fontStyle');
      
          const tempText = new Konva.Text({
            text: text,
            fontSize: fontSize,
            fontFamily: fontFamily,
            fontStyle: fontStyle,
          });
      
          const words = text.split(' ');
          let wrappedText = '';
          let currentLine = '';
      
          words.forEach((word: string) => {
            const testLine = currentLine.length === 0 ? word : currentLine + ' ' + word;
            tempText.setAttr('text', testLine);
            const textWidth = tempText.width();
      
            if (textWidth > maxWidth) {
              wrappedText += (currentLine.length === 0 ? '' : currentLine + '\n');
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          });
      
          wrappedText += currentLine;
      
          element.setAttr('text', wrappedText);
          // element.setAttr('height', lineHeight * wrappedText.split('\n').length);
          element.getLayer()?.batchDraw();
        });
      }
    }

    removeMouseEvents(element: KonvaTypes): void {
      element.off('dragmove');
      element.off('dragmove');
      element.off('click');
      element.off('dragend');
      element.off('mouseenter');
      element.off('mouseleave');
    }

    setTooltipVisibility(element: KonvaTypes, visible: boolean): void {
      if (element instanceof Konva.Circle) {
        const tooltip = this.tooltips.find(tooltip => tooltip.getAttr('id').includes(element.getAttr('id')));
        tooltip?.setAttr('visible', visible);
      }
      else if (element instanceof Konva.Group) {
        // find text child of group
        const text = element.getChildren().find(child => child instanceof Konva.Text);
        const tooltip = this.tooltips.find(tooltip => tooltip.getAttr('id').includes(text?.getAttr('text')));
        tooltip?.setAttr('visible', visible);
      }
    }

    setAllTootipsVisibility(visible: boolean): void {
      this.tooltips.forEach(tooltip => {
        tooltip.setAttr('visible', visible);
      });
    }
      

    addTooltip(element: KonvaTypes, positionX: number, positionY: number): Konva.Label{
      const tooltipID = element.getAttr('text') ? element.getAttr('text') : element.getAttr('id');
      const tooltip = new Konva.Label({
        id: 'tooltip-' + tooltipID,
        x: element instanceof Konva.Circle ? positionX : positionX + 5,
        y: element instanceof Konva.Circle ? positionY - 3 : positionY,
        opacity: 0.75,
        visible: false,
        listening: false,
      });
      tooltip.add(
        new Konva.Tag({
          fill: 'black',
          pointerDirection: 'down',
          pointerWidth: this.currentLabelPointerWidth ===0  ? 4 : this.currentLabelPointerWidth,
          pointerHeight: this.currentLabelPointerHeight === 0 ? 4 : this.currentLabelPointerHeight,
          lineJoin: 'round',
          shadowColor: 'black',
          shadowBlur: this.currentLabelShadowBlur === 0 ? 10 : this.currentLabelShadowBlur,
          shadowOffsetX: this.currentLabelShadowOffsetX === 0 ? 10 : this.currentLabelShadowOffsetX,
          shadowOffsetY: this.currentLabelShadowOffsetY === 0 ? 10 : this.currentLabelShadowOffsetY,
          shadowOpacity: 0.5,
        })
      );
      tooltip.add(
        new Konva.Text({
          text: tooltipID,
          fontFamily: 'Calibri',
          fontSize: this.currentLabelFontSize === 0 ? 10 : this.currentLabelFontSize,
          padding: 2,
          fill: 'white',
        })
      );
      this.canvas.add(tooltip);
      return tooltip;
    }

    updateTooltipID(element: KonvaTypes): void {
      let tooltipID = '';
      let text = null;
      let index = 0;

      if (!element) return;

      if (element instanceof Konva.Group) {
        tooltipID = element.getChildren().find(child => child instanceof Konva.Text)?.getAttr('text');
        text = element.getChildren().find(child => child instanceof Konva.Text) as Konva.Text;
      }
      else {
        tooltipID = element.getAttr('text') ? element.getAttr('text') : element.getAttr('id');
      }

      const isText = element instanceof Konva.Text;
      text = isText ? element : text;

      for (let i = 0; i < this.tooltips.length; i++) {
        if (this.tooltips[i].getAttr('id').includes(tooltipID)) {
          index = i;
          break;
        }
      }

      const newTooltip = 
        text ? 
        this.addTooltip(text, text.getParent().getAttr('x'), text.getParent().getAttr('y')) :
        this.addTooltip(element, element.getAttr('x'), element.getAttr('y'));
      this.tooltips[index] = newTooltip;
    }

    ngAfterViewInit(): void {
        // wait for elements to render before initializing fabric canvas
        setTimeout(() => {
            this.displayedSnap = this.initialSnap;
            this.zoomOutDisabled = true;
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

            this.route.queryParams.subscribe(params => {
              const eventId = params['id'];
              
              this.appApiService.getEventFloorLayout(eventId).subscribe((response) => {
                this.canvas = new Konva.Layer();

                console.log(response.floorlayout);

                const json = `
                {"attrs":{},"className":"Layer","children":[{"attrs":{"x":130.9078928896872,"y":122.4397531304478,"width":50,"height":50,"cursor":"move","draggable":true,"cornerRadius":2,"padding":20,"fill":"white","name":"sensor","customId":"7d3c"},"className":"Image"},{"attrs":{"x":200,"y":190,"data":"M0,0 L20,270","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","name":"wall","width":20,"height":270,"opacity":0.5},"className":"Path"},{"attrs":{"x":540,"y":150,"data":"M0,0 L-170,300","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","name":"wall","width":170,"height":300,"opacity":0.5},"className":"Path"},{"attrs":{"x":410,"y":160,"data":"M0,0 L-170,-10","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","name":"wall","width":170,"height":10,"opacity":0.5},"className":"Path"},{"attrs":{"x":600,"y":400,"data":"M0,0 L0,0","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","draggable":true,"name":"wall"},"className":"Path"},{"attrs":{"x":600,"y":400,"data":"M0,0 L-120,-210","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","name":"wall","width":120,"height":210,"opacity":0.5},"className":"Path"},{"attrs":{"x":158.6296921875532,"y":477.72727272727275,"data":"M0,0 L-110,-460","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","draggable":true,"name":"wall","width":110,"height":460},"className":"Path"},{"attrs":{"x":430,"y":160,"data":"M0,0 L-140,370","stroke":"black","strokeWidth":1.25,"lineCap":"round","lineJoin":"round","draggable":true,"name":"wall","width":140,"height":370},"className":"Path"},{"attrs":{"id":"sensor-1","name":"sensor","x":310,"y":90,"radius":2,"fill":"red","stroke":"black","strokeWidth":0.25,"draggable":true,"cursor":"move"},"className":"Circle"},{"attrs":{"id":"stall","name":"stall","x":370,"y":90,"width":10,"height":10,"draggable":true,"cursor":"move","fill":"white"},"className":"Group","children":[{"attrs":{"width":10,"height":10,"cursor":"move","draggable":true,"cornerRadius":2,"padding":20,"fill":"white","name":"stall"},"className":"Image"},{"attrs":{"id":"stallName","name":"stallName","text":"Gendac","fontSize":2,"fontFamily":"Calibri","fill":"black","width":10,"align":"center","verticalAlign":"middle","padding":3,"cursor":"move"},"className":"Text"}]}]}
                `;

                const parsed = JSON.parse(json);

                // this.canvas = Konva.Node.create(json, 'canvasParent');

                // this.canvas.children!.forEach(child => {

                //   let type : KonvaTypes;

                //   switch (child.getClassName()) {
                //     case 'Image':
                //       type = new Konva.Image(child.getAttrs());
                //       break;
                //     case 'Path':
                //       type = new Konva.Path(child.getAttrs());
                //       break;
                //     case 'Circle':
                //       type = new Konva.Circle(child.getAttrs());
                //       break;
                //     case 'Group':
                //       type = new Konva.Group(child.getAttrs());
                //       break;
                //     case 'Text':
                //       type = new Konva.Text(child.getAttrs());
                //       break;
                //     default:
                //       type = new Konva.Line(child.getAttrs());
                //       break;
                //   }

                //   this.setMouseEvents(type);

                //   this.canvasItems.push({name: child.getAttr('name'), konvaObject: type});
                // });

                
                this.canvasContainer.add(this.canvas);
                this.canvasContainer.draw();
                // this.canvasParent.nativeElement.dispatchEvent(new MouseEvent('mousemove', {clientX: 0, clientY: 0}));

            //set object moving
            this.canvas.on('dragmove', this.handleDragMove.bind(this));
            
            // Attach the mouse down event listener to start dragging lines
            this.canvasContainer.on('mousedown', this.onMouseDown.bind(this));
            
            this.createGridLines();
            
            this.canvasContainer.on('mouseup', this.onMouseUp.bind(this));
            
            // create selection box to select different components on the canvas
            this.createSelectionBox();

            this.canvasContainer.on('click', (e) => {
              const position = this.canvasContainer.getRelativePointerPosition();
              
              const component = this.canvas.getIntersection(position);
              
              if (!component || !(component instanceof Konva.Line) && !(component instanceof Konva.Image) && !(component instanceof Konva.Group) && !(component instanceof Konva.Path)) {
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
              if (e.target.hasName('stallName')) {
                const parent = e.target.getParent();
                this.activeItem = parent;
                this.setTransformer(parent, undefined);
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
            
            this.scaleBy = 2;
            
            this.canvasContainer.on('wheel', (e) => {
              e.evt.preventDefault();
              this.handleScaleAndDrag(this.scaleBy, e);              
            });
            
            this.canvasContainer.scaleX(this.scaleBy);
            this.canvasContainer.scaleY(this.scaleBy);
            // const wheelEvent = new WheelEvent('wheel', { deltaY: -1 });
            // this.canvasContainer.dispatchEvent(wheelEvent);
            // this.handleScaleAndDrag(this.scaleBy, wheelEvent);
            this.contentLoaded = true;
            this.snapLabel = this.TRUE_SCALE_FACTOR;
            this.gridSizeLabel = this.TRUE_SCALE_FACTOR;

            // add all the elements from the database

            parsed.children.forEach((child: { attrs: { x: any; y: any; name: any; }; }) => {
              if (!child.attrs.x || !child.attrs.y) return;

              const positionX = child.attrs.x;
              const positionY = child.attrs.y;
              const droppedItem: DroppedItem = { name: child.attrs.name };

              this.canvasItems.push(droppedItem);
              this.addKonvaObject(droppedItem, positionX, positionY);
            });

            console.log(this.canvasItems);

            });
          });
          }, 6);
    }
    
    handleScaleAndDrag(scaleBy:number, e?: any, direction?: 'in' | 'out'): void {
      let stage = null;
      if (e) {
        stage = e.target;
      }
      else {
        stage = this.canvasContainer;
      }
      if (!stage) return;
      const oldScale = stage.scaleX();

      let pointer = null;
      if (stage instanceof Konva.Stage) {
        pointer = stage.getPointerPosition();
      }
      else if (e){
        pointer = stage.getStage().getPointerPosition();
      }

      if (!pointer) {
        return;
      }

      const mousePointTo = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale
      };

      let wheelDirection = 0;
      if (!direction) {
        wheelDirection = e.evt.deltaY < 0 ? 1 : -1;
      }

      if (e?.evt.ctrlKey) {
        wheelDirection = -wheelDirection;
      }

      const newScale = (direction === 'in' || (!direction && wheelDirection > 0)) ? oldScale * scaleBy : oldScale / scaleBy;
      this.gridSize = this.initialGridSize * newScale;
      this.currentScale = newScale;

      if (newScale <= 1 || newScale >= 17) return;

      if (direction === 'in' || (!direction && wheelDirection > 0)) {
        if (this.contentLoaded) {
          this.wheelCounter++;
          this.scaleSnap = this.snaps[this.wheelCounter];
          this.displayedSnap = Math.round(this.scaleSnap * 100) / 100;
        }
        else {
          this.scaleSnap = this.initialSnap;
          this.displayedSnap = Math.round(this.scaleSnap * 100) / 100;
        }
        this.snapLabel = this.adjustValue(this.displayedSnap);

        this.updateStrokeWidths(0.5);
        if (newScale < 8) {
          this.maxReached = oldScale >= 8 ? true : false; 
          this.tooltipAllowedVisible = true;
          this.updateLabelSize(0.5, this.maxReached);
        }
        else {
          this.tooltipAllowedVisible = false;
          this.setAllTootipsVisibility(false);
        }
        this.setZoomInDisabled(this.displayedSnap);
        this.setZoomOutDisabled(this.displayedSnap);
      }
      else {
        if (this.contentLoaded) {
          this.wheelCounter--;
          this.scaleSnap = this.snaps[this.wheelCounter];
          this.displayedSnap = Math.round(this.scaleSnap * 100) / 100;
        }
        else {
          this.scaleSnap = this.initialSnap;
          this.displayedSnap = Math.round(this.scaleSnap * 100) / 100;
        }
        this.snapLabel = this.adjustValue(this.displayedSnap);

        
        this.updateStrokeWidths(2);
        if (newScale < 8) {
          this.maxReached = oldScale >= 8 ? true : false; 
          this.tooltipAllowedVisible = true;
          this.updateLabelSize(2, this.maxReached);
        }
        else {
          this.tooltipAllowedVisible = false;
          this.setAllTootipsVisibility(false);
        }
        this.setZoomInDisabled(this.displayedSnap);
        this.setZoomOutDisabled(this.displayedSnap);
      }

      const x =
        -(mousePointTo.x - pointer.x / newScale) * newScale;
      const y =
        -(mousePointTo.y - pointer.y / newScale) * newScale;

      const pos = this.boundFunc({ x, y }, newScale);

      this.canvasContainer.scale({ x: newScale, y: newScale });
      this.canvasContainer.position(pos);
    }

    updateStrokeWidths(scale: number) {
      if (this.gridLines && this.gridLines.children) {
        this.gridLines.children?.forEach((child: any) => {
          const prevWidth = child.getAttr('strokeWidth');
          child.strokeWidth(prevWidth * scale);
          this.currentGridStrokeWidth = prevWidth * scale;
        });

        if (this.canvas && this.canvas.children) {
          this.canvas.children?.forEach((child: any) => {
            if (child instanceof Konva.Path) {
              const prevWidth = this.currentPathStrokeWidth === 0 ? child.getAttr('strokeWidth') : this.currentPathStrokeWidth;
              child.strokeWidth(prevWidth * scale);
              this.currentPathStrokeWidth = prevWidth * scale;
            }
            if (child instanceof Konva.Circle) {
              const prevWidth = child.getAttr('strokeWidth');
              child.strokeWidth(prevWidth * scale);
              this.currentSensorCircleStrokeWidth = prevWidth * scale;
            }
          });
        }
      }
    }

    updateLabelSize(scale: number, maxWasReached: boolean) {
      this.tooltips.forEach((tooltip: any) => {
        tooltip.children?.forEach((child: any) => {
          if (child instanceof Konva.Text) {
            const prevSize = child.getAttr('fontSize')
            if (maxWasReached) {
              child.fontSize(prevSize);
            }
            else {
              child.fontSize(prevSize * scale);
            }
            this.currentLabelFontSize = prevSize * scale;
          }
          else if (child instanceof Konva.Tag) {
            const prevPointerWidth = child.getAttr('pointerWidth');
            const prevPointerHeight = child.getAttr('pointerHeight');
            const prevShadowBlur = child.getAttr('shadowBlur');
            const prevShadowOffsetX = child.getAttr('shadowOffsetX');
            const prevShadowOffsetY = child.getAttr('shadowOffsetY');
            
            if (maxWasReached) {
              child.pointerWidth(prevPointerWidth);
              child.pointerHeight(prevPointerHeight);
              child.shadowBlur(prevShadowBlur);
              child.shadowOffsetX(prevShadowOffsetX);
              child.shadowOffsetY(prevShadowOffsetY);
            }
            else {
              child.pointerWidth(prevPointerWidth * scale);
              child.pointerHeight(prevPointerHeight * scale);
              child.shadowBlur(prevShadowBlur * scale);
              child.shadowOffsetX(prevShadowOffsetX * scale);
              child.shadowOffsetY(prevShadowOffsetY * scale);
            }

            this.currentLabelPointerWidth = prevPointerWidth * scale;
            this.currentLabelPointerHeight = prevPointerHeight * scale;
            this.currentLabelShadowBlur = prevShadowBlur * scale;
            this.currentLabelShadowOffsetX = prevShadowOffsetX * scale;
            this.currentLabelShadowOffsetY = prevShadowOffsetY * scale;
          }
        });
      });
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

    setTransformer(mouseEvent?: Konva.Image | Konva.Group | Konva.Text | Konva.Circle, line?: Konva.Line | Konva.Path): void {
      if(!this.preventCreatingWalls) return;

      this.transformer.detach();
      // this.transformers = [];

      if (this.selectedTextBox) {
        this.transformer = new Konva.Transformer({
          enabledAnchors: [],
          rotateEnabled: true,
        });
      }
      else if (this.selectedWall) {
        this.transformer = new Konva.Transformer({
          enabledAnchors: ['middle-left', 'middle-right'],
          rotateEnabled: true,
        });
        this.activeItem.on('dragmove click dblclick', () => {
          const newWidth = this.revertValue(this.getActiveItemWidth());
          const newPathData = `M0,0 L${newWidth},0`;
          this.activeItem?.setAttr('data', newPathData);
          this.activeItem?.setAttr('rotation', this.activeItem?.getAttr('angle'));
          this.transformer.rotation(this.activeItem?.getAttr('angle'));
          this.transformer.update();
        });
        this.transformer.on('transform', () => {
          const pointer = this.canvasContainer.getPointerPosition();
          const object = this.updateData(this.activeItem, pointer);
          const data = object['newData'];
          const startPointX = object['startPointX'];
          const startPointY = object['startPointY'];
          const endPointX = object['endPointX'];
          const endPointY = object['endPointY'];
          this.activeItem?.setAttr('data', data);
          const newWidth = this.calculateWidth(this.activeItem);
          const newAngle = this.calculatePathAngle(this.activeItem);
          this.activeItem?.setAttr('width', newWidth);
        });
      }
      else if (this.activeItem instanceof Konva.Circle) {
        this.transformer = new Konva.Transformer({
          enabledAnchors: [],
          rotateEnabled: false,
          borderStroke: 'blue',
          borderStrokeWidth: 1,
        });
      }
      else if (this.activeItem instanceof Konva.Group) {
        this.transformer = new Konva.Transformer({
          nodes: [this.activeItem],
          rotateEnabled: true,
          enabledAnchors: [],
          keepRatio: false,
          boundBoxFunc: (oldBox, newBox) => {
            return newBox;
          }
        });
        this.transformer.on('transform', () => {
          const newAngle = this.transformer.getAbsoluteRotation();
          this.activeItem?.setAttr('rotation', newAngle);
          console.log(this.activeItem?.getAttr('angle'));
        });
      }

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

      this.transformer = new Konva.Transformer({
        enabledAnchors: [],
        resizeEnabled: false,
      });
      this.transformers.push(this.transformer);
      this.canvas.add(this.transformer);

      const selectionBox = new Konva.Rect({
        fill: 'rgba(0,0,255,0.2)',
        visible: false,
      });

      const rect = new Konva.Rect({
        fill: 'rgba(0,0,0,0)',
        visible: false,
        draggable: false,
        cursor: 'move',
      })

      this.canvas.add(selectionBox);
      this.canvas.add(rect);

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
          this.textLength = 0;
          this.selectedTextBox = false;

          this.store.dispatch(new UpdateActiveSensor(''));
  
          return;
        }

        // do nothing if we mousedown on any shape
        if (e.target !== this.canvasContainer) {
          if (e.target instanceof Konva.Circle) {
            const html5QrcodeScanner = new Html5QrcodeScanner(
              "reader",
              { fps: 15 },
              /* verbose= */ false);
            html5QrcodeScanner.render((decoded, res)=>{
              this.macAddrFromQR = decoded;
              this.updateLinkedSensors();
              if(html5QrcodeScanner.getState() == Html5QrcodeScannerState.SCANNING)
                html5QrcodeScanner.pause();
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
        rect.visible(true);
        rect.width(0);
        rect.height(0);
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
        const shapes = this.canvasContainer.find('.rect, .wall, .sensor, .stall, .stallName, .textBox');
        const box = selectionBox.getClientRect();
        this.selected = shapes.filter((shape) => {
          return Konva.Util.haveIntersection(box, shape.getClientRect());
        }) as Konva.Shape[];
        
        //remove all previous selections
        this.transformers.forEach((tr) => {
          tr.nodes([]);
        });

        //add new selections
        if (this.selected.length) {
          // this.transformers.forEach((tr) => {
          //   tr.nodes(selected);
          // });
          // find the min and max x and y values among the selected shapes
          this.madeSelection(rect, this.selected, this.transformer);
        }

        if (this.transformer.nodes().length === 1) {
          this.activeItem = this.transformer.nodes()[0];

          if (this.activeItem instanceof Konva.Circle) {
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
            this.transformer.nodes([]);
          });
          this.activeItem = null;
          this.transformer.nodes([]);
          this.transformer.nodes([]);
          this.textLength = 0;
          this.selectedTextBox = false;

          this.store.dispatch(new UpdateActiveSensor(''));

          if (this.selectionGroup) {
            this.updatePositions();
            this.selected.forEach((shape) => {
              if (shape.hasName('textBox') ||  shape.hasName('stall') || shape.hasName('sensor') || shape.hasName('wall')) {
                shape.moveTo(this.canvas);
                shape.draggable(true);
              }
            });
            this.selectionGroup.destroy();
          }
          return;
        }

        if (this.transformer.nodes().length > 1){
          this.activeItem = null;
          this.textLength = 0;
          this.selectedTextBox = false;

          this.store.dispatch(new UpdateActiveSensor(''));
        }

        // if we are selecting with rect, do nothing
        if (selectionBox.visible()) {
          return;
        }

        // do nothing if clicked NOT on our lines or images or text
        if (
          !e.target.hasName('rect') && 
          // !e.target.hasName('wall') && 
          !e.target.hasName('sensor') && 
          !e.target.hasName('stall') && 
          // !e.target.hasName('stallName') && 
          !e.target.hasName('textBox') && e.target === this.canvasContainer) {
          this.activeItem = null;
          this.textLength = 0;
          this.selectedTextBox = false;
          this.transformer.detach();
          this.transformer.nodes([]);
          // this.tr.detach();
          this.transformer.nodes([]);
          // this.transformers = [];

          this.store.dispatch(new UpdateActiveSensor(''));
          
          if (e.target.hasName('stallName')) {
            // find parent
            const parent = e.target.getParent();
            this.activeItem = parent;
            this.transformer.nodes([parent]);
            this.transformer.nodes([parent]);
            this.transformers = [this.transformer];
            this.canvas.draw();
          }
          else if (e.target.hasName('wall')) {
            this.activeItem = e.target;
            // this.setTransformer(undefined, this.activeItem);
            this.canvas.draw();
          }
          return;
        }

        if (e.target instanceof Konva.Line) {
          this.activeItem = null;
          this.textLength = 0;
          this.selectedTextBox = false;
          this.transformer.detach();
          this.transformer.nodes([]);
          // tr.detach();
          this.transformer.nodes([]);
          // this.transformers = [];
          return;
        }

        // check to see if we pressed ctrl or shift
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = this.transformer.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          this.transformer.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = this.transformer.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          this.transformer.nodes(nodes);

          if (this.transformer.nodes().length > 1){
            this.activeItem = null;
            this.textLength = 0;
            this.selectedTextBox = false;

            this.store.dispatch(new UpdateActiveSensor(''));
            
          } else if (this.transformer.nodes().length === 1) {
            this.activeItem = this.transformer.nodes()[0];

            if (this.activeItem instanceof Konva.Circle) {
              this.store.dispatch(new UpdateActiveSensor(this.activeItem.getAttr('customId')));
            }
          }

        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = this.transformer.nodes().concat([e.target]);
          this.transformer.nodes(nodes);

          if (this.transformer.nodes().length > 1){
            this.activeItem = null;
            this.textLength = 0;
            this.selectedTextBox = false;

            this.store.dispatch(new UpdateActiveSensor(''));
            
          }
        }
      });
    }

    updatePositions() {
      if (this.prevSelectionGroup) {
        this.selected.forEach((shape) => {
          if (shape.hasName('textBox') ||  shape.hasName('stall') || shape.hasName('sensor') || shape.hasName('wall')) {
            shape.x(shape.x() + this.prevSelectionGroup.x());
            shape.y(shape.y() + this.prevSelectionGroup.y());
            this.updateTooltipID(shape as KonvaTypes);
          }
        });
        this.canvas.draw();
      }
      return;
    }

    madeSelection(rect: Konva.Rect, selected: Konva.Shape[], tr: Konva.Transformer) {
      this.updatePositions();
      let minX = selected[0].x();
      let maxX = selected[0].x() + selected[0].width();
      let minY = selected[0].y();
      let maxY = selected[0].y() + selected[0].height();
      selected.forEach((shape) => {
        if (shape.hasName('textBox') ||  shape.hasName('stall') || shape.hasName('sensor') || shape.hasName('wall')) {
          minX = Math.min(minX, shape.x());
          maxX = Math.max(maxX, shape.x() + shape.width());
          minY = Math.min(minY, shape.y());
          maxY = Math.max(maxY, shape.y() + shape.height());
        }
      });

      this.selectionGroup = new Konva.Group({
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
        draggable: true,
        name: 'selectionGroup',
        cursor: 'move',
      });

      this.prevSelectionGroup = this.selectionGroup;
      
      // set the position and size of the box
      rect.position({ x: 0, y: 0 });
      rect.width(maxX - minX);
      rect.height(maxY - minY);
      rect.visible(true);

      this.selectionGroup.on('mouseenter', () => {
        document.body.style.cursor = 'move';
      });
      this.selectionGroup.on('mouseleave', () => {
        document.body.style.cursor = 'default';
      });
      this.selectionGroup.on('dragmove', () => {
        tr.nodes([this.selectionGroup]);
      });
      rect.on('click', () => {
        tr.nodes([this.selectionGroup]);
      });

      selected.forEach((shape) => {
        if (shape.hasName('textBox') ||  shape.hasName('stall') || shape.hasName('sensor') || shape.hasName('wall')) {
          shape.moveTo(this.selectionGroup);
          shape.draggable(false);
          shape.x(shape.x() - minX);
          shape.y(shape.y() - minY);
        }
      });
      rect.moveTo(this.selectionGroup);
      rect.draggable(false);
      tr.nodes([this.selectionGroup]);
      this.canvas.add(this.selectionGroup);
      this.canvas.draw();
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

            if (this.activeItem instanceof Konva.Circle) {
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
        
            const gridSize = this.initialGridSize / this.currentScale;
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
            const element = droppedItem.konvaObject;
            if (element) this.updateTooltipID(element);
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

      removeObject(selectedObject: KonvaTypes) {
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
        this.textLength = 0;
        this.selectedTextBox = false;

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
        const grid = this.scaleSnap;
        const xValue = pointer ? this.convertX(pointer.x) : 0;
        const yValue = pointer ? this.convertY(pointer.y) : 0;
        const snapPoint = {
            x: Math.round(xValue / grid) * grid,
            y: Math.round(yValue / grid) * grid,
        };

        // test if there already exists a wall
        const wall = this.canvas.findOne('.wall');
        if (wall) {
          this.currentPathStrokeWidth = wall.getAttr('strokeWidth');
        }
        else if (this.currentScale !== 1){
          this.currentPathStrokeWidth = this.currentGridStrokeWidth * 3;
        }
        else {
          this.currentPathStrokeWidth = 3;
        }
        
        const path = new Konva.Path({
            x: snapPoint.x,
            y: snapPoint.y,
            data: 'M0,0 L0,0',
            stroke: 'black',
            strokeWidth: this.currentPathStrokeWidth,
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

      calculatePathAngle(path: Konva.Path): number {
        const pointer = this.canvasContainer.getPointerPosition();
        if (path) {
          const object = this.updateData(path, pointer);
          const startPointX = object['startPointX'];
          const startPointY = object['startPointY'];
          const endPointX = object['endPointX'];
          const endPointY = object['endPointY'];
          const angle = Math.atan2(endPointY - startPointY, endPointX - startPointX) * 180 / Math.PI;
          this.activePathStartPoint = {
            x: startPointX,
            y: startPointY
          };
          this.activePathEndPoint = {
            x: endPointX,
            y: endPointY
          };
          return angle;
        }
        return 0;
      }

      calculateNewAngle(element: KonvaTypes): NumberSymbol {
        const angleRad = element.rotation();
        const angleDeg = angleRad * (180 / Math.PI);
        return angleDeg;
      }

      calculateWidth(element: Konva.Path): number {
        const data = element.data();
        const startPointX = parseFloat(data.split(' ')[0].split(',')[0].replace('M', ''));
        const startPointY = parseFloat(data.split(' ')[0].split(',')[1]);
        const endPointX = parseFloat(data.split(' ')[1].split(',')[0].slice(1));
        const endPointY = parseFloat(data.split(' ')[1].split(',')[1]);
        const width = Math.sqrt(Math.pow(endPointX, 2) + Math.pow(endPointY, 2));
        return width;
      }

      updateData(element: Konva.Path, pointer: any) : {newData: string, snapPoint: {x: number, y: number}, endPointX: number, endPointY: number, startPointX: number, startPointY: number} {
        const grid = this.scaleSnap;
        const xValue = pointer ? this.convertX(pointer.x) : 0;
        const yValue = pointer ? this.convertY(pointer.y) : 0;
        const snapPoint = {
            x: Math.round(xValue / grid) * grid,
            y: Math.round(yValue / grid) * grid,
        };
        const data = element.data();
        const startPointX = data.split(' ')[0].split(',')[0].replace('M', '');
        const startPointY = data.split(' ')[0].split(',')[1];
        const endPointX = snapPoint.x - element.x();
        const endPointY = snapPoint.y - element.y();
        const newData = `M${startPointX},${startPointY} L${endPointX},${endPointY}`;
        return {'newData': newData, 'snapPoint': snapPoint, 'endPointX': endPointX, 'endPointY': endPointY, 'startPointX': parseFloat(startPointX), 'startPointY': parseFloat(startPointY)};
      }
      
      onMouseMove(): void {
        if (this.ctrlDown) {
          return;
        }

        const pointer = this.canvasContainer.getPointerPosition();
        if (this.activePath) {
            const object = this.updateData(this.activePath, pointer);
            const newData = object['newData'];
            const endPointX = object['endPointX'];
            const endPointY = object['endPointY'];
            const startPointX = object['startPointX'];
            const startPointY = object['startPointY'];
            // this.activePath.setAttr('points', {'startPointX': startPointX, 'startPointY': startPointY, 'endPointX': endPointX, 'endPointY': endPointY});
            // console.log(this.activePath.getAttr('points'));
            const newWidth = Math.sqrt(Math.pow(endPointX, 2) + Math.pow(endPointY, 2));
            this.activePath.data(newData);
            const angle = this.calculatePathAngle(this.activePath);
            this.activePath.setAttr('angle', angle);
            this.activePath.setAttr('width', newWidth);
            this.canvas.batchDraw();
        }
      }
      
      onMouseUp(): void {
        this.openDustbin = false;
        this.mouseDown = false;

        const pointer = this.canvasContainer.getPointerPosition();
        if (this.activePath) {
          const object = this.updateData(this.activePath, pointer);
          const newData = object['newData'];
          const snapPoint = object['snapPoint'];
          const endPointX = object['endPointX'];
          const endPointY = object['endPointY'];
          const newWidth = Math.sqrt(Math.pow(endPointX, 2) + Math.pow(endPointY, 2));
          this.activePath.data(newData);
          const angle = this.calculatePathAngle(this.activePath);
          this.activePath.setAttr('angle', angle);
          this.activePath.setAttr('width', newWidth);
          this.canvas.batchDraw();

          // test if the line is more than a certain length
          const length = Math.sqrt(Math.pow(endPointX, 2) + Math.pow(endPointY, 2));
          if (length < this.scaleSnap) {
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
        const grid = this.initialGridSize;
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
        this.gridLines = gridGroup;

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

      adjustJSONData(json: Record<string, any>): void {
        // adjust children's attributes
        json['children'].forEach((child: any) => {
          child.attrs.width = this.adjustValue(child.attrs.width);
          child.attrs.height = this.adjustValue(child.attrs.height);
          if (isNaN(child.attrs.height)) {
            child.attrs.height = 0;
          }
          if (isNaN(child.attrs.height)) {
            child.attrs.height = 0;
          }
        });
      }

      revertJSONData(json: Record<string, any>): void {
        // adjust children's attributes
        json['children'].forEach((child: any) => {
          child.attrs.width = this.revertValue(child.attrs.width);
          child.attrs.height = this.revertValue(child.attrs.height);
          if (isNaN(child.attrs.height)) {
            child.attrs.height = 0;
          }
          if (isNaN(child.attrs.height)) {
            child.attrs.height = 0;
          }
        });
      }

      saveFloorLayout(): void {
        // remove grid lines from the JSON data
        const json = this.canvas.toObject();

        // remove the grid lines, transformers and groups from the JSON data
        json.children = json.children.filter((child: any) => {
          return child.attrs.name === 'wall' || child.attrs.name === 'stall' || child.attrs.name === 'sensor';
        });
        
        const adjustedJson = JSON.parse(JSON.stringify(json));
        this.adjustJSONData(adjustedJson);

        // const revertedJson = JSON.parse(JSON.stringify(adjustedJson));       this will be moved to the loadFlootLayout() function
        // this.revertJSONData(revertedJson);

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

        // save an image of the canvas
        const dataUrl = this.canvasContainer.toDataURL({ pixelRatio: 3 });
        this.downloadURI(dataUrl, 'stage.png');

      }

      downloadURI(uri: string, name: string) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // getUniqueId(): string {
      //   this.appApiService.getNewEventSensorId().subscribe((res: any) => {
      //     return res;
      //   });

      //   return '';
      // }

      updateWidth(event: any) {
        const input = this.revertValue(parseFloat(event.target.value));
        if (this.activeItem instanceof Konva.Path) {
          const newPathData = `M0,0 L${input},0`;
          this.activeItem?.setAttr('data', newPathData);
        }
        this.activeItem?.width(input);
        this.canvas.batchDraw();
      }
    
      updateHeight(event: any) {
        const input = this.revertValue(parseInt(event.target.value));
        if (this.activeItem instanceof Konva.Path) {
          const newPathData = `M0,0 L0,${input}`;
          this.activeItem?.setAttr('data', newPathData);
        }
        this.activeItem?.width(input);
        this.canvas.batchDraw();
      }

      updateText(event: any) {
        const input = event.target.value;
        const isStall = (this.activeItem instanceof Konva.Group && this.activeItem?.hasName('stall'));
        const isOnlyText = (this.activeItem instanceof Konva.Text && this.activeItem?.hasName('textBox'));
        if (isOnlyText || isStall) {
          const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
          if (!alphanumericRegex.test(input)) {
            // Remove non-alphanumeric characters, excluding white spaces
            const alphanumericInput = input.replace(/[^a-zA-Z0-9 ]/g, '');
            this.textInputField.value = alphanumericInput;
            return;
          }

          if (isOnlyText) {
            this.activeItem?.text(input);
          }
          else {
            // find child text of group
            const text = this.activeItem?.children.find((child: any) => {
              return child instanceof Konva.Text;
            });
            text?.text(input);
            this.updateTooltipID(text);
          }
          this.textLength = input.length;
        }
        this.canvas.batchDraw();
      }      

      updateRotation(event: any) {
        const input = parseFloat(event.target.value);
        if (input < 0) {
          this.activeItem?.rotation(360 + input);
        }
        else {
          this.activeItem?.rotation(input);
        }
      }

      getActiveItemWidth(): number {
        if (this.activeItem instanceof Konva.Path) {
          const width = this.calculateWidth(this.activeItem);
          return this.adjustValue(width);
        }
        else {
          return this.adjustValue(Math.round(this.activeItem?.width() * this.activeItem?.scaleX() * 10000) / 10000) ;
        }
      }

      getActiveItemHeight(): number {
        return this.adjustValue(Math.round(this.activeItem?.height() * this.activeItem?.scaleY() * 100) / 100);
      }

      getActiveItemText(): string {
        const isStall = (this.activeItem instanceof Konva.Group && this.activeItem?.hasName('stall'));
        const isOnlyText = (this.activeItem instanceof Konva.Text && this.activeItem?.hasName('textBox'));
        if (isOnlyText) {          
          this.textLength = this.activeItem?.text().length;
          return this.activeItem?.text();
        }
        else if (isStall) {
          // find child text of group
          const text = this.activeItem?.children.find((child: any) => {
            return child instanceof Konva.Text;
          });
          this.textLength = text?.text().length;
          return text?.text();
        }
        return '';
      }

      getTextLength(): number {
        return this.textLength;
      }

      getMaxTextLength(): number {
        if (this.activeItem instanceof Konva.Group && this.activeItem?.hasName('stall')) {
          return this.maxStallNameLength;
        }
        else if (this.activeItem instanceof Konva.Text && this.activeItem?.hasName('textBox')) {
          return this.maxTextLength;
        }
        else return 0;
      }

      getActiveItemRotation(): number {
        const angle = Math.round(this.activeItem?.getAttr('rotation') * 100) / 100;
        if (angle > 360) {
          return angle - 360;
        }
        else if (angle === 360) {
          return 0;
        }
        else if (angle < 0) {
          return 360 + angle;
        }
        else {
          return angle;
        }
      }

    isSensor() : boolean {
      if (this.activeItem && this.activeItem instanceof Konva.Circle) {
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

    getSelectedSensorId(element: Konva.Circle) {
      return element.getAttr('id');
    }

    updateLinkedSensors() {
      const request: IlinkSensorRequest = {
        id: this.activeItem.getAttr('customId')
      };

      const macAddress = (this.macAddrFromQR || this.macAddressBlocks.join(':')).toLowerCase();
      this.macAddrFromQR = '';
        this.appApiService.linkSensor(request, macAddress).then((res: any) => {
          if (res['success']) {
            // set the 'isLinked' attribute to true
            this.store.dispatch(new UpdateSensorLinkedStatus(request.id, true));

            //update active sensor
            this.store.dispatch(new UpdateActiveSensor(request.id));
            this.activeItem.setAttr('fill', 'lime');
          }
        });
    }

    handleMacAddressInput(event: any, blockIndex: number) {
      // Format and store the value in your desired format
      // Example: Assuming you have an array called macAddressBlocks to store the individual blocks
      this.macAddressBlocks[blockIndex] = event.target.value.toString();
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

    zoomIn(): void {
      this.zoomOutDisabled = false;
      const scale = this.canvasContainer.scaleX();
      if (this.currentScale !== 1) {
        this.handleScaleAndDrag(this.scaleBy, null, 'in');
      }
      else {
        this.handleScaleAndDrag(scale, null, 'in');
      }

      this.setZoomInDisabled(this.displayedSnap);
    }

    zoomOut(): void {
      this.zoomInDisabled = false;
      const scale = this.canvasContainer.scaleX();
      if (this.currentScale !== 1) {
        this.handleScaleAndDrag(this.scaleBy, null, 'out');
      }
      else {
        this.handleScaleAndDrag(scale, null, 'out');
      }

      this.setZoomOutDisabled(this.displayedSnap);
    }

    setZoomInDisabled(value: number): void {
      this.zoomInDisabled = value === this.snaps[this.snaps.length - 1] ? true : false;
    }

    setZoomOutDisabled(value: number): void {
      this.zoomOutDisabled = value === this.snaps[0] ? true : false;
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