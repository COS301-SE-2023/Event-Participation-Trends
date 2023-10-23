# EventParticipationTrends

[![codecov](https://codecov.io/gh/COS301-SE-2023/Event-Participation-Trends/graph/badge.svg?token=NCQZ8GPXTG)](https://codecov.io/gh/COS301-SE-2023/Event-Participation-Trends)

## Indlovu - Gendac - Event Participation Trends

Event Participation Trends is a system that leverages the always-online nature of devices to track the number of people attending an event, generate heatmaps and flowmaps of the event, and provide a live feed of the event to the public.

The wireless sensors connect in a mesh-like topology to feed RSSI data to a wireless gateway. The gateway then sends the data to a server, which triangulates the position of the devices to generate the heatmaps and flowmaps and estimate the number of people attending the event.

The system uses Google Authentication to ensure security and privacy of the data and enforces role-based access control to ensure that only authorised users can access the data.

## Installation and Setup

Please refer to our [technical installation manual](https://github.com/COS301-SE-2023/Event-Participation-Trends/wiki/Technical-Installation-Manual).

## About Us

<table>
  <tr>
    <th width="200px">Member</th>
    <th>Role</th>
    <th max-width="600px">Description</th>
    <th>Profiles</th>
  </tr>
  <tr align="center">
    <td align="center">
      Lukas Anthonissen<br>
      <sub>u21434345</sub><br><br>
      <img src="https://github.com/COS301-SE-2023/Event-Participation-Trends/assets/91600454/98e8b476-4602-4826-a427-b264ea2a1ab0" width="156px" height="170px" style="pointer-events:none; max-width:156px; max-height:170px;"/><br><br>
    </td>
    <td>Project manager and AI engineer</td>
    <td align="left">
      Lukas is responsible for team management, project administration, documentation, and sprint planning, as well as the design of the User Interface. He researched and implemented the ratio-based trilateration positioning service, and mathematical filters that build upon it, that allow the system to estimate the participant positions.
    </td>
    <td>
      <a href="https://github.com/DieSeeKat">
        <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" style="max-width:100%"/>
      </a><br><br>
      <a href="https://www.linkedin.com/in/lukas-anthonissen-854980244">
        <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" style="max-width:100%"/>
      </a>
    </td>
  </tr>
  <tr align="center">
    <td align="center">
      Stefan van der Merwe<br>
      <sub>u21429121</sub><br><br>
      <img src="https://github.com/COS301-SE-2023/Event-Participation-Trends/assets/91600454/086385bf-9613-47ec-a67c-834a5a44e6f4" width="auto" height="170px" style="pointer-events:none; max-width:156px; max-height:170px;"/>    
    </td>
    <td>Hardware and DevOps engineer</td>
    <td align="left">
      Stefan is our DevOps and hardware guy. He created the firmware running on the ESP32-C3 Espressif Microcontroller, and the communication of those sensors with our API. He also handled the setting up of the VPS  that our project is running on and our CI/CD pipeline.
    </td>
    <td>
      <a href="https://github.com/Stefan-vdm">
        <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" style="max-width:100%"/>
      </a><br><br>
      <a href="https://www.linkedin.com/in/stefan-van-der-merwe-23a9a3244">
        <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" style="max-width:100%"/>
      </a>
    </td>
  </tr>
  <tr align="center">
    <td align="center">
      Reuben Jooste<br>
      <sub>u21457060</sub><br><br>
      <img src="https://github.com/COS301-SE-2023/Event-Participation-Trends/assets/91600454/117e1e5e-5dab-4877-ad5f-183a0fca2ed0" width="156px" height="170px" style="pointer-events:none; max-width:156px; max-height:170px;"/>
    </td>
    <td>UX/UI Designer and Front-end Engineer</td>
    <td align="left">
      Reuben is one of our front-end designers and developers. He designed and implemented both the dashboard, and compare pages. Reuben also implemented the functionality of displaying the heatmaps and other statistics on the dashboard. He was also responsible for the integration between the front end and back end.
    </td>
    <td>
      <a href="https://github.com/JsteReubsSoftware">
        <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" style="max-width:100%"/>
      </a><br><br>
      <a href="https://www.linkedin.com/in/reuben-jooste-137594269">
        <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" style="max-width:100%"/>
      </a>
    </td>
  </tr>
  <tr align="center">
    <td align="center">
      Arno Jooste<br>
      <sub>u21457451</sub><br><br>
      <img src="https://github.com/COS301-SE-2023/Event-Participation-Trends/assets/91600454/45c7aeb2-faf1-4803-9d43-dcf460390b2e" width="156px" height="170px" style="pointer-events:none; max-width:156px; max-height:170px;"/>
    </td>
    <td>UX/UI Designer and Front-end Engineer</td>
    <td align="left">
      Arno is our other front-end designer and developer. He implemented the floor plan editing tool, which allows an event manager to create/edit a floor plan for an event space. Arno was also responsible for integration between the front end and back end.
    </td>
    <td>
      <a href="https://github.com/08Arno30">
        <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" style="max-width:100%"/>
      </a><br><br>
      <a href="https://www.linkedin.com/in/arno-jooste-421078269">
        <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" style="max-width:100%"/>
      </a>
    </td>
  </tr>
  <tr align="center">
    <td align="center">
      Luca Loubser<br>
      <sub>u20439963</sub><br><br>
      <img src="https://github.com/COS301-SE-2023/Event-Participation-Trends/assets/91600454/11fa4f9f-e74b-41a6-861d-94994eb3cc6e" width="156px" height="170px" style="pointer-events:none; max-width:156px; max-height:170px;"/>
    </td>
    <td>Back-end and Database Engineer</td>
    <td align="left">
     Luca is our API and Database Engineer. He was responsible for design, implementation and documentation of the API and Database. He was also responsible for the testing of the API through: Unit and Integration tests.
    </td>
    <td>
      <a href="https://github.com/LucaLoubser">
        <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" style="max-width:100%"/>
      </a><br><br>
      <a href="https://www.linkedin.com/in/luca-loubser-518b23192">
        <img src="https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" style="max-width:100%"/>
      </a>
    </td>
  </tr>
</table>




## Links

| Description                       | Link                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------- |
| System Requirements Specification v1 | [Link](https://docs.google.com/document/d/1Doeb5QJNxG2spNTYSLdacT7NHsnLVPAS4rcuX1nRqrY/edit?usp=sharing) |
| System Requirements Specification v2 | [Link](https://docs.google.com/document/d/1iHdudGcnUYoy227o1OgBhCBoATmbfdSvOFCusW7_F54/edit?usp=sharing) |
| System Requirements Specification v3 | [Link](https://docs.google.com/document/d/1L8ZUmRvCnAo5dGfTijhnKHm9DuSSltOG0WrvUgLysvg/edit?usp=sharing) |
| System Requirements Specification v4 | [Link](https://docs.google.com/document/d/15h4X2jm_uBKAbkQX41ua-sZuAcgC_iCVEYdanp-sj9s/edit?usp=sharing) |
| Architecture Requirements Document | [Link](https://docs.google.com/document/d/1DCmlr6tthxqHlV5Asj0hk7cu2i9cDNINY6NU2OYsUmg/edit?usp=sharing)
| Notion | [Link](https://tricky-cylinder-c7d.notion.site/Indlovu-Event-Participant-Trends-c0a953a23efe4de1969fc2a8a46cb7e5?pvs=4) |
| Coding Standards Document | [Link](https://www.notion.so/Coding-Standards-7b82311f246d445c835abcd739321909?pvs=4) |
| Documentation Contributions | [Link](https://www.notion.so/List-of-Contributions-1c60a373935440e383232a35eac06898?pvs=4) |
| User Manual | [Link](https://docs.google.com/document/d/1_cKCrhkL_yB80d10c_E82UGZVLFnSZI2S8DJMGUVsJ0/edit?usp=sharing)
| Technical Installation Manual | [Link](https://github.com/COS301-SE-2023/Event-Participation-Trends/wiki/Technical-Installation-Manual) |
| Installation Instructions (Mobile Users) | [Link](https://github.com/COS301-SE-2023/Event-Participation-Trends/wiki/Installation-instructions-(Mobile-users)) |
