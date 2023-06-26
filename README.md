# EventParticipationTrends

## Indlovu - Gendac - Event Participation Trends

Event Participation Trends is a system that leverages the always-online nature of devices to track the number of people attending an event, generate heatmaps and flowmaps of the event, and provide a live feed of the event to the public.

The wireless sensors connect in a mesh-like topology to feed RSSI data to a wireless gateway. The gateway then sends the data to a server, which triangulates the position of the devices to generate the heatmaps and flowmaps and estimate the number of people attending the event.

The system uses Google Authentication to ensure security and privacy of the data and enforces role-based access control to ensure that only authorised users can access the data.

## Installation and Setup

1. Clone the repository to your local machine using the following command:

   ```bash
   git clone https://github.com/COS301-SE-2023/Event-Participation-Trends
   ```

2. Navigate to the project directory:

   ```bash
   cd Event-Participation-Trends
   ```

3. Install the required dependencies
   ```bash
   yarn install
   ```
4. Configure the .env file

5. Start the Angular frontend:

   ```bash
   yarn nx serve app
   ```

6. Start the NestJs backend:

   ```bash
   yarn nx serve api
   ```

7. Open your web browser and visit `http://localhost:4200` to access the Event Management System.

## About Us

| Name                 | Student Number | GitHub Username                                           | Description                          | LinkedIn Profile                                                 |
| -------------------- | -------------- | --------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------- |
| Lukas Anthonissen    | u21434345      | [DieSeeKat](https://github.com/DieSeeKat)                 | Project manager and AI engineer      | [Link](https://www.linkedin.com/in/lukas-anthonissen-854980244/) |
| Stefan van der Merwe | u21429121      | [Stefan-vdm](https://github.com/Stefan-vdm)               | Hardware and DevOps engineer         | [Link](https://www.linkedin.com/in/stefan-van-der-merwe-23a9a3244/)|
| Reuben Jooste        | u21457060      | [JsteReubsSoftware](https://github.com/JsteReubsSoftware) | Ux/UI designer and frontend engineer | [Link](https://www.linkedin.com/in/reuben-jooste-137594269)
| Arno Jooste          | u21457451      | [08Arno30](https://github.com/08Arno30)                   | Ux/UI designer and frontend engineer | [Link](https://www.linkedin.com/in/arno-jooste-421078269)
| Luca Loubser         | u20439963      | [LucaLoubser](https://github.com/LucaLoubser)             | Backend and Database engineer        | [Link](https://www.linkedin.com/in/luca-loubser-518b23192)



## Links

| Description                       | Link                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| System Requirements Specification v1 | [Link](https://docs.google.com/document/d/1Doeb5QJNxG2spNTYSLdacT7NHsnLVPAS4rcuX1nRqrY/edit?usp=sharing) |
| System Requirements Specification v2 | [Link](https://docs.google.com/document/d/1iHdudGcnUYoy227o1OgBhCBoATmbfdSvOFCusW7_F54/edit?usp=sharing) |
| Architecture Requirements Document | [Link](https://docs.google.com/document/d/1DCmlr6tthxqHlV5Asj0hk7cu2i9cDNINY6NU2OYsUmg/edit?usp=sharing)
| Notion | [Link](https://lukasanthonissen.notion.site/Indlovu-Event-Participant-Trends-ffbc614bd9444ad2a031b2d77ae02324) |
| Documentation Contributions | [Link](https://lukasanthonissen.notion.site/List-of-Contributions-4138b8e2291c4ac5aee4b98d20c515b6?pvs=4) |
