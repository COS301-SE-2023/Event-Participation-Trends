import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IEvent, IImage, IPosition } from '@event-participation-trends/api/event/util';
import { AppApiService } from '@event-participation-trends/app/api';
import { NgIconsModule, provideIcons } from '@ng-icons/core';

import { matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, matRedo } from "@ng-icons/material-icons/baseline";
import { matWarningAmberRound, matErrorOutlineRound } from "@ng-icons/material-icons/round";
import { matPlayCircleOutline, matPauseCircleOutline } from "@ng-icons/material-icons/outline";

import HeatMap from 'heatmap-ts';
import Konva from 'konva';

interface IHeatmapData {
  x: number,
  y: number,
  value: number,
  radius: number
}
@Component({
  selector: 'event-participation-trends-heatmap-container',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIconsModule],
  templateUrl: './heatmap-container.component.html',
  styleUrls: ['./heatmap-container.component.css'],
  providers: [
    provideIcons({matSearch, matFilterCenterFocus, matZoomIn, matZoomOut, matWarningAmberRound, matErrorOutlineRound, matRedo, matPlayCircleOutline, matPauseCircleOutline}),
  ],
})
export class HeatmapContainerComponent implements OnInit{
  @Input() public containerEvent: any | {_id: ''} = {_id: ''};
  @Input() public parentContainer: HTMLDivElement | null = null;
  @ViewChild('heatmapContainer') heatmapContainer!: ElementRef<HTMLDivElement>;

  loadingContent = true;
  show = false;
  showFloorplan = false;
  overTimeRange = false;
  changingTimeRange = false;
  paused = true;

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
  currentTime = '';
  totalSeconds = 0;
  positions: IPosition[] = [];
  highlightTimes: {startSeconds: number, endSeconds: number}[] = [];

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
  
  floorlayoutImages: IImage[] = [];
  STALL_IMAGE_URL = 'assets/stall-icon.png';

  constructor(private readonly appApiService: AppApiService) {}

  async ngOnInit() {
    // check if the event has device positions
    const startDate = new Date(this.containerEvent.StartDate);
    // startDate.setDate(startDate.getDate() - 1); // for test Event: Demo 3
    const endDate = new Date(this.containerEvent.EndDate);

    this.startDate = startDate;
    this.endDate = endDate;
    
    //set current time in the format: hh:mm:ss
    this.currentTime = new Date(startDate).toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

    // get the total seconds
    this.totalSeconds = (endDate.getTime() - startDate.getTime()) / 1000;

    // get the boundaries from the floorlayout
    if (this.containerEvent.FloorLayout) {
      const response = await this.appApiService.getFloorplanBoundaries(this.containerEvent._id);
      this.floorlayoutBounds = response.boundaries;
      const images = await this.appApiService.getFloorLayoutImages(this.containerEvent._id);
      this.floorlayoutImages = images;
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
        width: 1000,
        height: 1000,
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

    this.positions = await this.appApiService.getEventDevicePosition(this.containerEvent._id, this.startDate, this.endDate);
    
    if (this.positions.length === 0) {
      this.hasData = false;
    }
    else {
      // run through the positions
      this.setHighlightPoints();

      // set the heatmap data to the positions that were detected in the first 5 seconds
      // only run through the positions until a timestamp is found that is 5 seconds greater than the start date
      this.setHeatmapIntervalData(this.startDate!);
    }
    
    //sort the positions by timestamp
    this.positions.sort((a: IPosition, b: IPosition) => {
      if (!a.timestamp || !b.timestamp) return 0;
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  async setHighlightPoints() {
    if (!this.startDate) return;

    let startInterval = 0;
    let endInterval = 0;

    // get positions in a 5 second interval and check if there is any data
    // first position seconds
    startInterval = this.positions[0].timestamp ? new Date(this.positions[0].timestamp).getTime() : 0;
    let gap = 0;
    if (this.totalSeconds > 10800) {
      gap = 300;
    }
    else if (this.totalSeconds > 3600) {
      gap = 120;
    } else if (this.totalSeconds > 1800) {
      gap = 60;
    } else if (this.totalSeconds > 900) {
      gap = 20;
    } else if (this.totalSeconds > 600) {
      gap = 5;
    } else {
      gap = 1;
    }

    // find first position where the position and the next position are not within the gap
    for (let i = 1; i < this.positions.length-1; i++) {
      const position = this.positions[i];
      const nextPosition = this.positions[i+1];
      if (position.timestamp && nextPosition.timestamp) {
        const positionDate = new Date(position.timestamp).getTime();
        const nextPositionDate = new Date(nextPosition.timestamp).getTime();
        if (nextPositionDate - positionDate > gap * 1000) {
          endInterval = positionDate;
          
          // add the interval to the highlight times
          this.highlightTimes.push({
            startSeconds: (startInterval - this.startDate?.getTime()) / 1000,
            endSeconds: (endInterval - this.startDate?.getTime()) / 1000
          });

          // set the start interval to the next position
          startInterval = nextPositionDate;
          endInterval = 0;
        }
      }
    }

    this.createHighlightPoints();
  }

  async createHighlightPoints() {
    const container = document.getElementById('container-'+this.containerEvent._id);

    const rangeInput = document.createElement('myRange-' + this.containerEvent._id);

    const highlightPointsContainer = document.getElementById('highlightPointsContainer-'+this.containerEvent._id);

    console.log(this.highlightTimes);
    //create the highlight points
    for (let i = 0; i < this.highlightTimes.length; i++) {
      const highlightPoint = document.createElement('div');
      highlightPoint.style.left = ((this.highlightTimes[i].startSeconds / this.totalSeconds) * 100) + '%';
      highlightPoint.style.width = (((this.highlightTimes[i].endSeconds - this.highlightTimes[i].startSeconds) / this.totalSeconds) * 100) + '%';
      // highlightPoint.style.height = container?.clientHeight ? (container?.clientHeight - rangeInput.offsetHeight) + 'px' : '100%';

      highlightPoint.classList.add('absolute');
      highlightPoint.classList.add('h-1/2');
      //  opacity-50 z-1 cursor-pointer rounded-2xl bg-ept-light-blue');
      highlightPoint.classList.add('opacity-50');
      highlightPoint.classList.add('z-1');
      highlightPoint.classList.add('cursor-pointer');
      highlightPoint.classList.add('rounded-md');
      highlightPoint.classList.add('bg-ept-light-blue');
      highlightPoint.classList.add('self-center');

      highlightPointsContainer?.appendChild(highlightPoint);
    }
  }

  async setHeatmapIntervalData(startTime: Date) {
    const positionsToUse: IHeatmapData[] = [];

    //find the first index where the timestamp is within 5 seconds of the start time
    const index = this.positions.findIndex((position: IPosition) => {
      if (position.timestamp) {
        if (Math.abs(startTime.getTime() - new Date(position.timestamp).getTime()) <= 5000) {
          return true;
        }
      }
      return false;
    });

    for (let i = index; i < this.positions.length; i++) {
      const position = this.positions[i];
      
      if (position && position.timestamp && position.x && position.y) {
        const positionDate = new Date(position.timestamp);
        console.log("position: " + positionDate);

        if (Math.abs(startTime.getTime() - positionDate.getTime()) <= 5000) {
          if (position.x != null && position.y != null) {
            positionsToUse.push({
              x: position.x,
              y: position.y,
              value: 20,
              radius: 10
            });
          } else {
            positionsToUse.push({
              x: 100,
              y: 100,
              value: 0,
              radius: 20
            });
          }

          positionsToUse.push({
            x: 600,
            y: 100,
            value: 0,
            radius: 20
          });

        } else {
          break;
        }
      }
    }
    console.log(positionsToUse);
    this.setHeatmapData(positionsToUse);
  }

  updateHeatmap(event: any) {
    //set the current time based on the value of the time range input
    const time = event.target.value;

    //add the time to the start date's seconds
    const updatedTime = new Date(this.startDate!);
    updatedTime.setSeconds(updatedTime.getSeconds() + parseInt(time));

    //set the current time
    this.currentTime = updatedTime.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });

    this.setHeatmapIntervalData(updatedTime);
  }

  updateCurrentTime(event: any) {
    // stop the interval of the auto play if it is active
    this.changingTimeRange = true;
    this.paused = true;

    //set the current time based on the value of the time range input
    const time = event.target.value;

    //add the time to the start date's seconds
    const updatedTime = new Date(this.startDate!);
    updatedTime.setSeconds(updatedTime.getSeconds() + parseInt(time));

    //set the current time
    this.currentTime = updatedTime.toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
  }

  setHeatmapData(data: IHeatmapData[]) {
    // remove the old heatmap layer
    this.floorlayoutStage?.find('Layer').forEach((layer) => {
      if (layer.name() === 'heatmapLayer') {
        layer.destroy();
      }
    });

    this.heatmap?.setData({
      max: 100,
      min: 1,
      data: data
    });

    this.heatmap?.repaint();

    // create an image from using the decoded base64 data url string
    // Create a new Image object
    const image = new Image();

    // Get the ImageData URL (base64 encoded) from this.heatmap?.getDataURL()
    const base64Url = this.heatmap?.getDataURL();
    if (base64Url) {
      image.src = base64Url;

      // Use the image's onload event to retrieve the dimensions
      image.onload = () => {
        const originalWidth = image.width;     // Width of the loaded image
        const originalHeight = image.height;   // Height of the loaded image

        // For example:
        const heatmapLayer = new Konva.Layer({
          name: 'heatmapLayer',
          visible: true
        });
        const heatmapImage = new Konva.Image({
          image: image,
          x: 0,
          y: 0,
          width: originalWidth,
          height: originalHeight,
        });

        heatmapLayer.add(heatmapImage);
        this.floorlayoutStage?.add(heatmapLayer);
      };
    }

  }

  async getImageFromJSONData(eventId: string) {
    const response = this.containerEvent.FloorLayout;    
    const imageResponse = this.floorlayoutImages;

    if (response && this.parentContainer) {
      // use the response to create an image
      this.floorlayoutStage = new Konva.Stage({
        container: 'floormap-'+this.containerEvent._id+'',
        width: this.heatmapContainer.nativeElement.offsetWidth * 0.98,
        height: this.heatmapContainer.nativeElement.offsetHeight * 0.98,
        draggable: true,
        visible: false,
      });

      // create node from JSON string
      this.heatmapLayer = Konva.Node.create(response, 'floormap-'+ this.containerEvent._id);
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
        // run through the layer and change the image attribute for the stalls
        this.heatmapLayer?.find('Group').forEach((group) => {
          if (group.name() == 'stall') {
            (group as Konva.Group).children?.forEach((child) => {
              if (child instanceof Konva.Image) {
                const image = new Image();
                image.onload = () => {
                  // This code will execute once the image has finished loading.
                  child.attrs.image = image;
                  this.heatmapLayer?.draw();
                };
                image.src = this.STALL_IMAGE_URL;
              }
            });
          }
        });

        imageResponse.forEach((image: any) => {
          const imageID = image._id;
          const imageSrc = image.imageBase64;
          let imageAttrs = image.imageObj;
          
          imageAttrs = JSON.parse(imageAttrs);
          const imageBackupID = imageAttrs.attrs.id;
    
          this.heatmapLayer?.find('Group').forEach((group) => {
            if (group.name() === 'uploadedFloorplan' && group.hasChildren()) {
              if ((group.getAttr('databaseID') === imageID) || group.getAttr('id') === imageBackupID) {
                  (group as Konva.Group).children?.forEach((child) => {
                    if (child instanceof Konva.Image) {
                      const image = new Image();
                      image.onload = () => {
                        // This code will execute once the image has finished loading.
                        child.attrs.image = image;
                        this.heatmapLayer?.draw();
                      };
                      image.src = imageSrc;
                    }
                  });
                }
              }
            });
          });

        this.heatmapLayer.children?.forEach((child) => {
          if (child instanceof Konva.Group && (child.name() === 'uploadedFloorplan' && child.children?.length === 0)) {
            child.destroy();
            this.heatmapLayer?.draw();
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

  addFiveSeconds(valid: boolean) {
    const rangeElement = document.getElementById('myRange-'+this.containerEvent._id) as HTMLInputElement;

    // increase or decrease the value of the range element by 5 seconds
    const newValue = valid ? parseInt(rangeElement.value) + 5 : parseInt(rangeElement.value) - 5;
    rangeElement.value = newValue.toString();

    // Create and dispatch a new "change" event
    const event = new Event('change', { bubbles: true });
    rangeElement.dispatchEvent(event);
  }

  async playFlowOfHeatmap() {
    this.paused = false;

    const rangeElement = document.getElementById('myRange-'+this.containerEvent._id) as HTMLInputElement;

    // set the changing time range to false
    this.changingTimeRange = false;

    // increase or decrease the value of the range element by 5 seconds on an interval until the end time is reached
    const interval = setInterval(() => {
      if (this.changingTimeRange) {
        clearInterval(interval);
        return;
      }

      if (parseInt(rangeElement.value) < this.totalSeconds) {
        this.addFiveSeconds(true);
      } else {
        this.overTimeRange = true;
        clearInterval(interval);
      }
    }, 500);
  }

  pauseFlowOfHeatmap() {
    this.paused = true;
    this.changingTimeRange = true;
  }
}
