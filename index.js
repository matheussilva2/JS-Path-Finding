const unselectedNodeValue = 0
const selectedNodeValue = 1
const originNodeValue = 2
const targetNodeValue = 3
const obstacleNodeValue = 4


const colors = ["#FFFFFF", "#001dff", "#008402", "#aa0000", "#343804"]

let map = []

let origin = 0
let currentPos = origin
let target = 0

let mapWidth 
let mapHeight


const start = () => {
	generateMap()

	origin = randint(0, (mapWidth * mapHeight)) -1
	target = randint(0, (mapWidth * mapHeight)) -1

	currentPos = origin

	generateObstacles()

	changeNodeValue(origin, originNodeValue)
	changeNodeValue(target, targetNodeValue)


	renderMatrix()
	generatePath()
}

const randint = (min, max) => {
	return Math.round(Math.random() * (+max - +min) + +min)
}

const generateObstacles = () => {
	const quantity = 50
	for(let i = 0; i < quantity; i++){
		let position = randint(0, (mapWidth * mapHeight))-1
		changeNodeValue(position, obstacleNodeValue)
	}
}

const generatePath = () => {
	const debug = false
	if(debug){
		setInterval(()=>{
			if( currentPos != target ){
				map[getNearestPosition()] = 1
				currentPos = getNearestPosition()
				renderMatrix()
			}
		}, 1)
	}else{
		while( currentPos !=  target ){
			map[getNearestPosition()] = 1
			currentPos = getNearestPosition()
			renderMatrix()
		}
	}
}

const changeNodeValue = ( index, value ) => {
	map[index] = value
}

const generateMap = () => {
	mapWidth = 40
	mapHeight = 40

	for (let i = 0; i < ( mapWidth * mapHeight ); i++){
		map[i] = 0
	}
}

const defineNodes = ( new_origin, new_target ) => {
	origin = new_origin
	target = new_target
}

const renderMatrix = () => {
	const debug = true

	let html = "<table cellpadding=0 cellspacing=0>"
	for (let row = 0; row < mapHeight; row++){
		html += "<tr>"

		for(let col = 0; col < mapWidth; col++){
			const tileIndex = col + (mapWidth * row)

			if(debug === true){
				html += `<td class='tile' style='background-color: ${ colors[map[tileIndex]] }'>`
				html += `<div class="tile-index"></div>`
				html += "</td>"
			}
		}
		html += "</tr>"
	}
	html += "</table>"
	document.querySelector("#mapCanvas").innerHTML = html
}

const get1DPosition = (coords) => {
	return coords.x + mapWidth * coords.y
}

const get2DPosition = (position) => {
	let x = position % mapWidth;
	let y = Math.floor(position / mapWidth);
	return { 'x': x, 'y': y }
}

const calculateDistance  = (origin, target) => {
	distance = Math.sqrt( Math.pow((target.x - origin.x), 2)  + Math.pow((target.y - origin.y) , 2))
	return distance
}

const getNearestPosition = () => {
	let neighbors = {
		"leftNeighbor": {
			position: get2DPosition(currentPos - 1)
		},
		"rightNeighbor": {
			position: get2DPosition(currentPos + 1)
		},
		"topNeighbor" : {
			position: get2DPosition(currentPos - mapWidth)
		},
		"bottomNeighbor": {
			position: get2DPosition(currentPos + mapWidth)
		},
		"topLeftNeighbor": {
			position: get2DPosition(currentPos - mapWidth - 1)
		},
		"topRightNeighbor": {
			position: get2DPosition(currentPos - mapWidth + 1)
		},
		"bottomLeftNeighbor": {
			position: get2DPosition(currentPos + mapWidth - 1)
		},
		"bottomRightNeighbor": {
			position: get2DPosition(currentPos + mapWidth + 1)
		}
	}

	neighbors.leftNeighbor.distance = calculateDistance(
		{"x": neighbors.leftNeighbor.position.x, "y": neighbors.leftNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.rightNeighbor.distance = calculateDistance(
		{"x": neighbors.rightNeighbor.position.x, "y": neighbors.rightNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.bottomNeighbor.distance = calculateDistance(
		{"x": neighbors.bottomNeighbor.position.x, "y": neighbors.bottomNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.topNeighbor.distance = calculateDistance(
		{"x": neighbors.topNeighbor.position.x, "y": neighbors.topNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.topLeftNeighbor.distance = calculateDistance(
		{"x": neighbors.topLeftNeighbor.position.x, "y": neighbors.topLeftNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.topRightNeighbor.distance = calculateDistance(
		{"x": neighbors.topRightNeighbor.position.x, "y": neighbors.topRightNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.bottomLeftNeighbor.distance = calculateDistance(
		{"x": neighbors.bottomLeftNeighbor.position.x, "y": neighbors.bottomLeftNeighbor.position.y},
		get2DPosition(target)
		)
	neighbors.bottomRightNeighbor.distance = calculateDistance(
		{"x": neighbors.bottomRightNeighbor.position.x, "y": neighbors.bottomRightNeighbor.position.y},
		get2DPosition(target)
		)

	let nearestNeighbor = { distance: Infinity }
	let instructions = []

	Object.keys(neighbors).forEach(( neighbor )=>{
		
		if(map[get1DPosition(
				{
					x: neighbors[neighbor].position.x,
					y: neighbors[neighbor].position.y
				}
			)] != obstacleNodeValue)
		{
			if( nearestNeighbor.distance > neighbors[neighbor].distance ){
				nearestNeighbor = neighbors[neighbor]
			}
		}
	})
	return get1DPosition(nearestNeighbor.position)
}

start()