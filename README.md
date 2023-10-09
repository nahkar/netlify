# Bracket Builder
## Install Dependencies
```
yarn
```

# Run server
```
yarn dev
```

# Docker

- #### Build 
```bash
docker build -t bracket-builder .
```
- #### Run Dockerfile
```bash
docker run -d --rm -p 5173:5173 bracket-builder
```
- #### Run docker-compose
```bash
docker-compose up --build
```

# Notes
 - We have to remove strict mode to work properly with react-beautiful-dnd
 [Answer]( https://stackoverflow.com/questions/60029734/react-beautiful-dnd-i-get-unable-to-find-draggable-with-id-1)
