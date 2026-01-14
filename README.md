
#  Emergency Dispatch System (Motia Hackathon Project)

## Overview

This project is an **Emergency Dispatch System** built during a hackathon using **Motia**.
The goal was to build **anything using Motia**, and we chose a real-world problem where **event-driven architecture actually makes sense**.

The system handles emergency requests like **medical, fire, and police** and processes them asynchronously.


## Why This Project

Emergency systems should not work like simple CRUD apps.

They need:

* Async processing
* Background jobs
* Reliability
* Ability to handle multiple requests at once

Motia fits perfectly for this use case.



## What We Built

* Users can report emergencies from the frontend
* Each emergency triggers an **event**
* Events are processed using **queues**
* Dispatch logic runs in the background
* Cron jobs handle scheduled tasks


## How It Works (Simple Flow)

1. User reports an emergency (React frontend)
2. Backend emits an `EmergencyCreated` event
3. Motia queue processes the event
4. Emergency is categorized (medical / fire / police)
5. Dispatch workflow assigns responders
6. Status is updated asynchronously



## Event-Driven Design

This project follows an **event-driven approach**:

* No heavy synchronous logic
* Each step reacts to an event
* Easy to extend and retry workflows

Example events:

* `EmergencyCreated`
* `EmergencyDispatched`
* `EmergencyResolved`


## Queue Processing

Queues are used to:

* Handle multiple emergencies at the same time
* Avoid blocking requests
* Retry failed processing

This makes the system more reliable.



## Cron Jobs

Cron jobs are used for:

* Checking unresolved emergencies
* Cleanup of old data
* Periodic background tasks


## Frontend

* Built using **React**
* Simple UI for reporting emergencies
* Displays current status
* No business logic in frontend


## Tech Stack

* **Motia** – Event workflows & orchestration

* **Cron Jobs** – Scheduled tasks
* **React** – Frontend


## Hackathon Context

This project was built as part of a hackathon challenge where participants had to **build any project using Motia**.
Our focus was on using Motia properly with **events, queues, and background workflows**.







Just tell me.

