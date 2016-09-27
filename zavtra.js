var fps = 20 //actually, it's not fps, it's miliseconds betveen frames

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function IceAxe (x1, y1, x2, y2) {
		elem = document.createElement('div')
		elem.className = 'iceaxe'
		this.trajectory = {
			l: 10,
			startx: x1,
			starty: y1,
			kx: x2 - x1,
			ky: y2 - y1
		}
		this.trajectory.dy = -Math.pow((Math.pow(this.trajectory.l, 2)/(Math.pow(this.trajectory.kx, 2)/Math.pow(this.trajectory.ky, 2) + 1)),0.5)
		this.trajectory.dx = this.trajectory.dy * this.trajectory.kx / this.trajectory.ky
		this.coords = { x: x1, y: y1 }
		this.elem = document.getElementById('gamefield').appendChild(elem)
		this.elem.style.top = this.coords.y + 'px'
		this.elem.style.left = this.coords.x + 'px'
		this.del = function () {
			document.getElementById('gamefield').removeChild(this.elem)
		}
		this.onFrame = function () {
			this.coords.x += this.trajectory.dx
			this.coords.y += this.trajectory.dy
			this.elem.style.top = this.coords.y + 'px'
			this.elem.style.left = this.coords.x + 'px'
			if (this.coords.x < 0 || this.coords.y < 0 || this.coords.x > 800) {
				this.del()
				return 42
			} 
		}
}

function Agregato () {
	this.elem = document.getElementById('agregato')
	this.x = 450;
	this.direct = Math.round(Math.random())
	this.move = getRandomInt(1, 50)
	this.speed = 10
	this.renewMove = function () {
		this.move = getRandomInt(1, 50)
	}
	this.onFrame = function () {
		if (this.move == 0 || this.x <= 0 || this.x >= 700) {
			this.direct = (this.direct) ? 0 : 1
			this.renewMove()
		}
		movedir = (this.direct) ? -1 : 1
		this.x += this.speed * movedir
		this.elem.style.left = this.x + 'px'
		this.move--
	}
}

function Score () {
	this.symbols = 0
	this.iceaxes = 10
	this.syncValues = function () {
		document.getElementById('symbols').innerHTML = this.symbols
		document.getElementById('iceaxecounter').innerHTML = this.iceaxes
	}
	this.onThrow = function () {
		this.iceaxes--
		this.syncValues()
	}
	this.onCollide = function () {
		this.symbols += getRandomInt(42, 256)
		this.iceaxes += getRandomInt(1,2)
		this.syncValues()
	}
}

var clicked = false;
var iceaxe
var mainlooptimer
var agregato
var score

function gfclick(event) {
	clicked = {
		x: event.pageX - 50,
		y: event.pageY - 100
	}
}

function newGame() {
	clearInterval(mainlooptimer)
	agregato = new Agregato()
	score = new Score()
	score.syncValues()
	mainlooptimer = setInterval(function () {
		if (clicked) {
			if (!iceaxe) {
				iceaxe = new IceAxe(400, 600, clicked.x, clicked.y)
				score.onThrow()
			}
			clicked = false
		}
		if (iceaxe) {
			if (iceaxe.coords.y < 90 && (Math.abs(iceaxe.coords.x - agregato.x) < 90)) { //sort of collider
				score.onCollide()
				iceaxe.del()
				iceaxe = null
			}
			if (iceaxe.onFrame() == 42) {
				iceaxe = null
			}
		}
		if (!iceaxe && score.iceaxes <= 0) {
			clearInterval(mainlooptimer)
		}
		agregato.onFrame()
	}, fps)
}
document.getElementById('newgame').onclick = newGame
document.getElementById('gamefield').onclick = gfclick

