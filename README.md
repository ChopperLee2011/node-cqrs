# node-cqrs (Under working)
 a cqrs toolkit lib with nodejs.
 ```
  Event store is only adding events.
  View store is more like normal CRUD database.
 ``` 
 
 
Inspired by the following libraries/examples:
- https://github.com/looplab/eventhorizon
- https://github.com/petrjanda/node-cqrs

## Installation
 `npm i`
 
 `npm test`

## Examples
   if you want see more detail information, please set `DEBUG=cqrs:*:*` ;
   
   simple api: `node examples/simple/index`
   
   couchbase api: `node couchbase/simple/index`

## RoadMap
 - [X] implemented mostly methods in lib: eventhorizon
 - [X] couchbase storage support
 - [ ] simplify with lib: SimpleCQRS
 - [ ] change to use lib: node-eventStore
 - [ ] example with restful api
 - [ ] snapshot support
 - [ ] use nodejs Event Emitter2