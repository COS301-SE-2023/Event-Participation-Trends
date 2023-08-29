import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IEvent } from '@event-participation-trends/api/event/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { NgIconsModule, provideIcons } from '@ng-icons/core';

import { matSearch, matFilterCenterFocus, matZoomIn, matZoomOut } from "@ng-icons/material-icons/baseline";
import { matWarningAmberRound, matErrorOutlineRound } from "@ng-icons/material-icons/round";

import HeatMap from 'heatmap-ts';
import Konva from 'konva';
@Component({
  selector: 'event-participation-trends-heatmap-container',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconsModule],
  templateUrl: './heatmap-container.component.html',
  styleUrls: ['./heatmap-container.component.css'],
  providers: [
    provideIcons({matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, matWarningAmberRound, matErrorOutlineRound}),
  ],
})
export class HeatmapContainerComponent implements OnInit{
  @Input() public containerEvent: any | null = null;
  @Input() public parentContainer: HTMLDivElement | null = null;
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;

  loadingContent = true;
  show = false;
  showFloorplan = false;

  // Keys
  shiftDown = false;

  // Heatmap
  heatmap: HeatMap | null = null;
  heatmapLayer: Konva.Layer | null = null;
  floorlayoutStage: Konva.Stage | null = null;
  floorlayoutBounds: {top: number; left: number; right: number; bottom: number; } | null | undefined = null;
  hasFloorlayout = true;
  hasData = true;
  startDate: Date | null = null;
  endDate: Date | null = null;

  //Zoom and recenter
  minScale = 1; // Adjust this as needed
  maxScale = 5.0; // Adjust this as needed

  // Charts
  chartColors = {
    "ept-deep-grey": "#101010",
    "ept-bumble-yellow": "#facc15",
    "ept-off-white": "#F5F5F5",
    "ept-blue-grey": "#B1B8D4",
    "ept-navy-blue": "#22242A",
    "ept-light-blue": "#57D3DD",
    "ept-light-green": "#4ade80",
    "ept-light-red": "#ef4444"
  };

  constructor(private readonly appApiService: AppApiService) {}

  async ngOnInit() {
    // check if the event has device positions
    const startDate = new Date(this.containerEvent.StartDate);
    startDate.setDate(startDate.getDate() - 1);
    const endDate = new Date(this.containerEvent.EndDate);

    this.startDate = startDate;
    this.endDate = endDate;

    // get the boundaries from the floorlayout
    if (this.containerEvent.FloorLayout) {
      const response = await this.appApiService.getFloorplanBoundaries(this.containerEvent._id);
      this.floorlayoutBounds = response.boundaries;
    }

    if (!this.floorlayoutBounds) {
      this.hasFloorlayout = false;
    }

    window.addEventListener('keydown', (event: KeyboardEvent) => {
      //now check if no input field has focus and the Delete key is pressed
      if (event.shiftKey) {
        this.handleKeyDown(event);
      }
    });
    window.addEventListener('keyup', (event: KeyboardEvent) => this.handleKeyUp(event));

    this.loadingContent = false;

    setTimeout(() => {
      this.show = true;
    }, 200);
  }

  async ngAfterViewInit() {     
    setTimeout(() => {
      this.heatmapContainer = new ElementRef<HTMLDivElement>(document.getElementById('heatmapContainer-'+this.containerEvent._id) as HTMLDivElement);
  
      this.heatmap = new HeatMap({
        container: document.getElementById('view-'+this.containerEvent._id+'')!,
        maxOpacity: .6,
        radius: 50,
        blur: 0.90,
        gradient: {
          0.0: this.chartColors['ept-off-white'],
          0.25: this.chartColors['ept-light-blue'],
          0.5: this.chartColors['ept-light-green'],
          0.75: this.chartColors['ept-bumble-yellow'],
          1.0: this.chartColors['ept-light-red']
        }
      });
      this.getImageFromJSONData(this.containerEvent._id);   
    }, 1000);

    const positions = await this.appApiService.getEventDevicePosition(this.containerEvent._id, this.startDate, this.endDate);
    
    if (positions.length === 0) {
      this.hasData = false;
    }
  }

  async getImageFromJSONData(eventId: string) {
    const response = this.containerEvent.FloorLayout;
    if (response && this.parentContainer) {
      // use the response to create an image
      this.floorlayoutStage = new Konva.Stage({
        container: 'floormap-'+this.containerEvent._id+'',
        width: this.heatmapContainer.nativeElement.offsetWidth * 0.98,
        height: this.heatmapContainer.nativeElement.offsetHeight * 0.98,
        draggable: true,
        visible: false,
      });

      // listen for when the stage is dragged and ensure teh following:
      // if the right side position is less than the width of the container, set the x position to the width of the container
      // if the left side position is greater than 0, set the x position to 0
      // if the bottom side position is less than the height of the container, set the y position to the height of the container
      // if the top side position is greater than 0, set the y position to 0
      // this.floorlayoutStage.on('dragmove', () => {
      //   if (this.floorlayoutStage && this.parentContainer) {
      //     const stageX = this.floorlayoutStage.x();
      //     const stageY = this.floorlayoutStage.y();
      //     const stageWidth = this.floorlayoutStage.width() * this.floorlayoutStage.scaleX();
      //     const stageHeight = this.floorlayoutStage.height() * this.floorlayoutStage.scaleY();
      //     const containerWidth = this.parentContainer.offsetWidth *0.98;
      //     const containerHeight = this.parentContainer.offsetHeight *0.98;
          
      //     // the stage must move beyond the container width and height but the following must be taken into account
      //     // if the stage's left position is inline with the container's left position, set the stage's x position to equal the container's left position
      //     // meaning if we move to the right it does not matter but once we move left and the stage's left position is inline with the container's left position, set the stage's x position to equal the container's left position
      //     // if the stage's right position is inline with the container's right position, set the stage's x position to equal the container's right position - the stage's width
      //     // meaning if we move to the left it does not matter but once we move right and the stage's right position is inline with the container's right position, set the stage's x position to equal the container's right position - the stage's width
      //     // if the stage's top position is inline with the container's top position, set the stage's y position to equal the container's top position
      //     // meaning if we move down it does not matter but once we move up and the stage's top position is inline with the container's top position, set the stage's y position to equal the container's top position
      //     // if the stage's bottom position is inline with the container's bottom position, set the stage's y position to equal the container's bottom position - the stage's height
      //     // meaning if we move up it does not matter but once we move down and the stage's bottom position is inline with the container's bottom position, set the stage's y position to equal the container's bottom position - the stage's height

      //     if (this.floorlayoutStage.x() > 0) {
      //       this.floorlayoutStage.x(0);
      //     }
      //     if (this.floorlayoutStage.x() < containerWidth - stageWidth) {
      //       this.floorlayoutStage.x(containerWidth - stageWidth);
      //     }
      //     if (this.floorlayoutStage.y() > 0) {
      //       this.floorlayoutStage.y(0);
      //     }
      //     if (this.floorlayoutStage.y() < containerHeight - stageHeight) {
      //       this.floorlayoutStage.y(containerHeight - stageHeight);
      //     }
      //   }
      // });

      // add rect to fill the stage
      // const rect = new Konva.Rect({
      //   x: 0,
      //   y: 0,
      //   width: this.parentContainer.offsetWidth,
      //   height: this.parentContainer.offsetHeight,
      //   fill: this.chartColors['ept-bumble-yellow'],
      //   stroke: this.chartColors['ept-light-blue'],
      //   strokeWidth: 20,
      // });

      // this.floorlayoutStage.add(new Konva.Layer().add(rect));

      // create node from JSON string
      this.heatmapLayer = Konva.Node.create(response, 'floormap');
      if (this.heatmapLayer) {
        this.heatmapLayer?.setAttr('name', 'floorlayoutLayer');

        // run through the layer and set the components not to be draggable
        this.heatmapLayer?.children?.forEach(element => {
          element.draggable(false);
        });

        // run through the layer and change the colors of the walls
        this.heatmapLayer?.find('Path').forEach((path) => {
          if (path.name() == 'wall') {
            path.attrs.stroke = this.chartColors['ept-blue-grey'];
          }
        });
        // run through the layer and change the colors of the border of the sensors
        this.heatmapLayer?.find('Circle').forEach((circle) => {
          if (circle.name() == 'sensor') {
            circle.attrs.stroke = this.chartColors['ept-blue-grey'];
          }
        });

        // // add the node to the layer
        this.floorlayoutStage.add(this.heatmapLayer);
      }

      // add event listener to the layer for scrolling
      const zoomFactor = 1.2; // Adjust this as needed
      const minScale = 0.7; // Adjust this as needed
      const maxScale = 8.0; // Adjust this as needed

      this.floorlayoutStage.on('wheel', (e) => {
        if (!this.shiftDown) return;

        if (this.floorlayoutStage) {
          e.evt.preventDefault(); // Prevent default scrolling behavior if Ctrl key is not pressed
      
          const oldScaleX = this.floorlayoutStage.scaleX();
          const oldScaleY = this.floorlayoutStage.scaleY();
      
          // Calculate new scale based on scroll direction
          const newScaleX = e.evt.deltaY > 0 ? oldScaleX / zoomFactor : oldScaleX * zoomFactor;
          const newScaleY = e.evt.deltaY > 0 ? oldScaleY / zoomFactor : oldScaleY * zoomFactor;
      
          // Apply minimum and maximum scale limits
          const clampedScaleX = Math.min(Math.max(newScaleX, minScale), maxScale);
          const clampedScaleY = Math.min(Math.max(newScaleY, minScale), maxScale);
      
          const zoomCenterX = this.floorlayoutStage.getPointerPosition()?.x;
          const zoomCenterY = this.floorlayoutStage.getPointerPosition()?.y;
      
          if (zoomCenterX && zoomCenterY) {
            if (clampedScaleX === minScale && clampedScaleY === minScale) {
              // Fully zoomed out - stop the user from zooming out further
              const oldScaleX = this.floorlayoutStage.scaleX();
              const oldScaleY = this.floorlayoutStage.scaleY();
              // Get the center of the viewport as the zoom center
              const zoomCenterX = this.floorlayoutStage.width() / 2;
              const zoomCenterY = this.floorlayoutStage.height() / 2;
          
              // Calculate new position for zoom center
              const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
              const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
          
              this.floorlayoutStage.x(newPosX);
              this.floorlayoutStage.y(newPosY);
              this.floorlayoutStage.scaleX(clampedScaleX);
              this.floorlayoutStage.scaleY(clampedScaleY);
            } else {
              // Calculate new position for zoom center
              const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
              const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
      
              this.floorlayoutStage.x(newPosX);
              this.floorlayoutStage.y(newPosY);
            }
      
            this.floorlayoutStage.scaleX(clampedScaleX);
            this.floorlayoutStage.scaleY(clampedScaleY);
          }

          console.log(this.floorlayoutStage.x(), this.floorlayoutStage.y());
        }
      });
      this.recenterFloorlayout();
    }
  }

  async recenterFloorlayout() {
    if (this.floorlayoutStage && this.floorlayoutBounds) {
      const minScale = this.minScale;
      const maxScale = this.maxScale;

      const floorLayoutWidth = this.floorlayoutBounds.right - this.floorlayoutBounds.left;
      const floorLayoutHeight = this.floorlayoutBounds.bottom - this.floorlayoutBounds.top;
      
      // Get the dimensions of the viewport
      const viewportWidth = this.floorlayoutStage.width(); // Width of the viewport
      const viewportHeight = this.floorlayoutStage.height(); // Height of the viewport

      // Calculate the aspect ratios of the layout and the viewport
      const layoutAspectRatio = floorLayoutWidth / floorLayoutHeight;
      const viewportAspectRatio = viewportWidth / viewportHeight;

      // Calculate the zoom level based on the aspect ratios
      let zoomLevel;

      if (layoutAspectRatio > viewportAspectRatio) {
        // The layout is wider, so fit to the width
        zoomLevel = viewportWidth / floorLayoutWidth;
      } else {
        // The layout is taller, so fit to the height
        zoomLevel = viewportHeight / floorLayoutHeight;
      }

      // Apply minimum and maximum scale limits
      const clampedZoomLevel = Math.min(Math.max(zoomLevel, minScale), maxScale);

      const zoomCenterX = floorLayoutWidth / 2;
      const zoomCenterY = floorLayoutHeight / 2;

      // Calculate the new dimensions of the floor layout after applying the new scale
      const newLayoutWidth = floorLayoutWidth * clampedZoomLevel;
      const newLayoutHeight = floorLayoutHeight * clampedZoomLevel;

      // Calculate the required translation to keep the map centered while fitting within the viewport
      const translateX = (viewportWidth - newLayoutWidth) / 2 - zoomCenterX * (clampedZoomLevel - 1);
      const translateY = (viewportHeight - newLayoutHeight) / 2 - zoomCenterY * (clampedZoomLevel - 1);

      // Apply the new translation and scale
      this.floorlayoutStage.x(translateX);
      this.floorlayoutStage.y(translateY);
      this.floorlayoutStage.scaleX(clampedZoomLevel);
      this.floorlayoutStage.scaleY(clampedZoomLevel);
      this.floorlayoutStage.visible(true);
    }
  }

  zoomIn() {
    if (this.floorlayoutStage) {
      const oldScaleX = this.floorlayoutStage.scaleX();
      const oldScaleY = this.floorlayoutStage.scaleY();
  
      // Calculate new scale based on zoom in factor
      const newScaleX = oldScaleX * 1.2;
      const newScaleY = oldScaleY * 1.2;
  
      // Apply minimum and maximum scale limits
      const clampedScaleX = Math.min(Math.max(newScaleX, 1), this.maxScale);
      const clampedScaleY = Math.min(Math.max(newScaleY, 1), this.maxScale);
  
      // Get the center of the viewport as the zoom center
      const zoomCenterX = this.floorlayoutStage.width() / 2;
      const zoomCenterY = this.floorlayoutStage.height() / 2;
  
      // Calculate new position for zoom center
      const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
      const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);
  
      this.floorlayoutStage.x(newPosX);
      this.floorlayoutStage.y(newPosY);
      this.floorlayoutStage.scaleX(clampedScaleX);
      this.floorlayoutStage.scaleY(clampedScaleY);
    }
  }
  
  zoomOut() {
    if (this.floorlayoutStage) {
      // zoom out should work as follows
      // if we zoom out and a side exceeded its boundaries then set the x or y position to the boundary

      const oldScaleX = this.floorlayoutStage.scaleX();
      const oldScaleY = this.floorlayoutStage.scaleY();

      // Calculate new scale based on zoom out factor
      const newScaleX = oldScaleX / 1.2;
      const newScaleY = oldScaleY / 1.2;

      // Apply minimum and maximum scale limits
      const clampedScaleX = Math.min(Math.max(newScaleX, 1), this.maxScale);
      const clampedScaleY = Math.min(Math.max(newScaleY, 1), this.maxScale)

      // Get the center of the viewport as the zoom center
      const zoomCenterX = this.floorlayoutStage.width() / 2;
      const zoomCenterY = this.floorlayoutStage.height() / 2;

      // now check if the new position exceeds the boundaries of the container
      const containerWidth = this.heatmapContainer.nativeElement.offsetWidth *0.98;
      const containerHeight = this.heatmapContainer.nativeElement.offsetHeight *0.98;
      const stageWidth = this.floorlayoutStage.width() * clampedScaleX;
      const stageHeight = this.floorlayoutStage.height() * clampedScaleY;

      let xFixed = false;
      let yFixed = false;

      if (this.floorlayoutStage.x() > 0) {
        this.floorlayoutStage.x(0);
        xFixed = true;
      }
      if (this.floorlayoutStage.x() < containerWidth - stageWidth) {
        this.floorlayoutStage.x(containerWidth - stageWidth);
        xFixed = true;
      }
      if (this.floorlayoutStage.y() > 0) {
        this.floorlayoutStage.y(0);
        yFixed = true;
      }
      if (this.floorlayoutStage.y() < containerHeight - stageHeight) {
        this.floorlayoutStage.y(containerHeight - stageHeight);
        yFixed = true;
      }

      // Calculate new position for zoom center
      const newPosX = zoomCenterX - (zoomCenterX - this.floorlayoutStage.x()) * (clampedScaleX / oldScaleX);
      const newPosY = zoomCenterY - (zoomCenterY - this.floorlayoutStage.y()) * (clampedScaleY / oldScaleY);

      if (!xFixed) {
        this.floorlayoutStage.x(newPosX);
      }
      if (!yFixed) {
        this.floorlayoutStage.y(newPosY);
      }

      this.floorlayoutStage.scaleX(clampedScaleX);
      this.floorlayoutStage.scaleY(clampedScaleY);
      
    }
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.shiftDown = false;
    event.preventDefault();
    
    if (event.shiftKey) {
      this.shiftDown = true;
    }
  }

  handleKeyUp(event: KeyboardEvent): void {
    this.shiftDown = false;
    event.preventDefault();
  }
}
