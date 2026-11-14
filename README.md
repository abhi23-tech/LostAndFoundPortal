# CampusFinds – Campus Lost & Found Portal
Node.js + Express + MongoDB (NoSQL) web application.

## Why NoSQL fits this problem
Each post is ONE document that already contains its own `claims` array (embedded sub-documents).
Reading an item needs no JOIN, and the schema can change without migrations.

## NoSQL concepts demonstrated
| Concept | Where |
|---|---|
| Document model + schema validation | models/Item.js |
| Embedded documents / arrays | `claims` inside each item |
| `$push` / `$set` operators | POST /api/items/:id/claims |
| Compound index | `{type, status, createdAt}` |
| Regex search + filters | GET /api/items |
| Aggregation with `$facet`, `$group`, `$sort`, `$limit` | GET /api/stats (dashboard) |
| Seeding | seed.js (runs when collection is empty) |

## REST API
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/items | report lost/found item |
| GET | /api/items?q=&type=&category=&status= | search and filter |
| GET | /api/items/:id | item with claims |
| PATCH | /api/items/:id/status | open / pending / returned |
| POST | /api/items/:id/claims | add embedded claim |
| DELETE | /api/items/:id | delete |
| GET | /api/stats | aggregation for dashboard |

## Run locally
npm install -> copy .env.example to .env -> set MONGODB_URI -> npm start -> http://localhost:3000

## Deploy (free): MongoDB Atlas + Render
1. Atlas: free M0 cluster, create DB user, Network Access allow 0.0.0.0/0, copy the mongodb+srv string.
2. Push the folder to GitHub.
3. Render -> New Web Service -> pick repo. Build: `npm install`. Start: `npm start`.
4. Add env var MONGODB_URI (Atlas string). Deploy and open the URL.
